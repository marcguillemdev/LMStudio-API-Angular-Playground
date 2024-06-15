import { HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MarkdownModule, MermaidAPI } from 'ngx-markdown';
import { Subject, takeUntil } from 'rxjs';
import { LMStudioCompletionChoice } from '../../interface/completion-response';
import { LMStudioCompletionChoiceMessage } from '../../interface/completion-stream-response';
import { ChatCompletionChunk, Choice } from '../../interface/event-stream-chunk';
import { LMStudioModels } from '../../interface/model';
import { HttpService } from '../../services/http.service';
import { ConfigComponent } from '../config/config.component';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MatSelectModule, MatIconModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatDialogModule, MarkdownModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {

  /**
   * @description Injected services.
   */
  private readonly _httpService = inject(HttpService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _matDialogService = inject(MatDialog);

  // Subject to close the stream when the user sends a new message.
  private readonly _closeStreamSubject = new Subject<void>();

  // Reference to the loading dialog.
  private _loadingDialogRef!: MatDialogRef<LoadingComponent>;

  // Reference to the body wrapper to scroll to the bottom of the chat.
  @ViewChild('bodyWrapper', { static: true })
  bodyWrapper!: ElementRef<HTMLDivElement>;

  // The available models from the LMStudio API.
  public models!: LMStudioModels;

  // The form group to send messages to the LMStudio API.
  public formGroup: FormGroup = new FormGroup({
    model: new FormControl('no-model', Validators.required),
    message: new FormControl('')
  });

  // The messages in the chat.
  public messages: Array<LMStudioCompletionChoice> = [];

  // Temporal variable to store the text of the chat when the event stream response is being parsed.
  public text: string = '';

  // Flag to check if the chat request is completed. This is used to avoid multiple requests at the same time.
  public completedChatRequest = true;

  ngOnInit(): void {
    this._loadAvailableModels();
  }

  /**
   * @description Open the config dialog.
   */
  public openConfig(): void {
    this._matDialogService.open(ConfigComponent);
  }

  /**
   * @description Open the settings dialog.
   */
  public openSettings(): void {
    this._matDialogService.open(ConfigComponent).afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._loadAvailableModels();
        }
      });
  }

  /**
   * @description Load the available models from the LMStudio API.
   */
  private _loadAvailableModels(): void {
    this._showLoadingDialog();
    this._httpService.getAvailableModels()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (models) => {
          this._closeLoadingDialog();
          this.models = models;
          this.formGroup.get('model')?.setValue(models.data[0].id);
        },
        error: (error) => {
          this._closeLoadingDialog();
          this._matDialogService.open(DialogMessageComponent,
            {
              data:
              {
                title: 'LMStudio API not available',
                message: 'The LMStudio API is not available. Please check your configuration or try again later.'
              }
            }).afterClosed()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
              next: (response: boolean) => {
                if (response) {
                  this._loadAvailableModels();
                }
              }
            });
          console.error(error);
        }
      });
  }

  /**
   * @description Show a loading dialog while the model list is being loaded.
   */
  private _showLoadingDialog(): void {
    this._loadingDialogRef = this._matDialogService.open(LoadingComponent, {
      data: {
        title: 'Loading...',
        message: 'Please wait while the model list is being loaded.'
      }
    });
  }

  /**
   * @description Close the loading dialog.
   */
  private _closeLoadingDialog(): void {
    if (this._loadingDialogRef) {
      this._loadingDialogRef.close();
    }
  }

  /**
   * @description Send a message to the LMStudio API and read the event stream response.
   */
  public sendMessageAndReadEventStream(): void {
    if (this.formGroup.valid && this.formGroup.get('message')?.value !== '' && this.completedChatRequest) {
      const model = this.formGroup.get('model')?.value;
      const message = this.formGroup.get('message')?.value;
      this._pushMessage({
        content: message, role: 'user'
      });
      const messages: Array<LMStudioCompletionChoiceMessage> = this._getMessages();
      this._setFormMessage('');
      this._httpService.sendMessage(model, messages)
        .pipe(takeUntilDestroyed(this._destroyRef), takeUntil(this._closeStreamSubject))
        .subscribe({
          next: (event) => {
            this._setIsChatRequestCompleted(false);
            this._startListeningStreamResponse(event);
          },
          error: (error) => {
            this._setIsChatRequestCompleted(true);
            console.error(error);
          },
          complete: () => {
            this._setIsChatRequestCompleted(true);
            console.info('Complete');
          }
        });
    } else {
      if (!this.completedChatRequest) {
        this._closeStreamSubject.next();
      } else {
        this.formGroup.get('message')?.setErrors({ required: true });
      }
    }
  }

  /**
   * @description Set the message in the form.
   * @param message The message to set in the form.
   */
  private _setFormMessage(message: string): void {
    this.formGroup.get('message')?.setValue(message);
  }

  /**
   * @description Set the completedChatRequest property.
   * @param value The value to set in the completedChatRequest property.
   */
  private _setIsChatRequestCompleted(value: boolean): void {
    this.completedChatRequest = value;
  }

  /**
   * @description Parse the event stream response and show the messages in the chat.
   * @param event The event to parse and show in the chat.
   */
  private _startListeningStreamResponse(event: HttpEvent<string>): void {
    if (event.type === HttpEventType.DownloadProgress) {
      const progressEvent = event as HttpDownloadProgressEvent;
      const chunks: Array<ChatCompletionChunk> = this._parseChunk(progressEvent.partialText ?? '');
      let mergedText = '';
      chunks.forEach((chunk) => {
        chunk.choices.forEach((choice: Choice) => {
          if (choice.delta.content) {
            mergedText += choice.delta.content;
          }
        });
      });
      if (mergedText) {
        this.text += mergedText;
      }
      if (this.messages[this.messages.length - 1].message.role === 'user') {
        this.messages.push({ finish_reason: 'stop', index: this.messages.length, message: { content: mergedText, role: 'assistant' } });
      } else {
        this.messages[this.messages.length - 1].message.content = mergedText;
      }
      this.text = '';
    }
    this.bodyWrapper.nativeElement.scrollTop = this.bodyWrapper.nativeElement.scrollHeight;
  }

  /**
   * @description Push a message in the messages array.
   * @param message The message to push in the messages array.
   */
  private _pushMessage(message: LMStudioCompletionChoiceMessage): void {
    this.messages.push({ finish_reason: 'stop', index: this.messages.length, message });
  }

  /**
   * @description Get the messages array.
   * @returns The messages array.
   */
  private _getMessages(): Array<LMStudioCompletionChoiceMessage> {
    return this.messages.map((message) => ({ role: message.message.role, content: message.message.content }));
  }

  /**
   * @description Parse the chunks from the event stream response.
   * @param data The data to parse.
   * @returns The parsed chunks.
   */
  private _parseChunk(data: string): Array<ChatCompletionChunk> {
    const chunks: Array<ChatCompletionChunk> = [];
    const lines = data.split('\n');
    lines.forEach((line: string) => {
      try {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('data: {')) {
          const jsonData: ChatCompletionChunk = JSON.parse(trimmedLine.substring(5)); // Elimina 'data: ' del inicio
          chunks.push(jsonData);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });
    return chunks;
  }

  public mermaidOptions: MermaidAPI.Config = {
    fontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    logLevel: MermaidAPI.LogLevel.Info,
    theme: MermaidAPI.Theme.Dark,
    themeCSS: '.node rect { fill: #333; }',
    securityLevel: MermaidAPI.SecurityLevel.Strict
  };
}
