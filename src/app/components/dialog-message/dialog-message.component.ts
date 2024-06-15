import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogMessage } from '../../interface/mat-dialog-message';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-message',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './dialog-message.component.html',
  styleUrl: './dialog-message.component.scss'
})
export class DialogMessageComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly injectedMatDialogData: MatDialogMessage,
    public readonly matDialogRef: MatDialogRef<DialogMessageComponent>
  ) { }

  public closeDialogWithResponse(response: boolean): void {
    this.matDialogRef.close(response);
  }

}
