import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ConfigService } from '../../services/config.service';
import { LMSTudioAPIConfiguration } from '../../interface/configuration';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {

  private readonly configService = inject(ConfigService);
  private readonly matDialogRef = inject(MatDialogRef<ConfigComponent>);
  private readonly config: LMSTudioAPIConfiguration = this.configService.getConfiguration();

  public formGroup = new FormGroup({
    host: new FormControl(this.config.host, Validators.required),
    systemPrompt: new FormControl(this.config.systemPrompt, Validators.required),
  });

  public resetToDefaults(): void {
    this.formGroup.setValue(this.configService._defaultConfiguration);
  }

  public setConfiguration(reloadModelsAfterCloseThisModal: boolean): void {
    if (this.formGroup.valid) {
      this.configService.setConfiguration(this.formGroup.value as LMSTudioAPIConfiguration);
      this.matDialogRef.close(reloadModelsAfterCloseThisModal);
    }
  }

}
