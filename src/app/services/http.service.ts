import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LMStudioCompletionInput } from '../interface/completion-input';
import { LMStudioCompletionChoiceMessage } from '../interface/completion-response';
import { LMSTudioAPIConfiguration } from '../interface/configuration';
import { LMStudioModels } from '../interface/model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly _configService = inject(ConfigService);

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getAvailableModels(): Observable<LMStudioModels> {
    const host = this._configService.getConfiguration().host;
    return this._http.get<LMStudioModels>(`${host}/v1/models`);
  }

  public sendMessage(model: string, messages: LMStudioCompletionChoiceMessage[]) {
    const config: LMSTudioAPIConfiguration = this._configService.getConfiguration();
    const lMStudioCompletionInput: LMStudioCompletionInput = {
      model,
      messages: [
        { role: 'system', content: config.systemPrompt },
        ...messages
      ],
      max_tokens: -1,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      structured: { type: 'json' }
    };
    return this._http.post(`${config.host}/v1/chat/completions`, lMStudioCompletionInput, {
      observe: "events",
      responseType: 'text',
      reportProgress: true
    });
  }

}
