import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigComponent } from './config.component';
import { LMSTudioAPIConfiguration } from '../../interface/configuration';

describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ConfigComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset formGroup to default configuration', () => {
    component.resetToDefaults();
    expect(component.formGroup.value).toEqual(component["configService"]._defaultConfiguration);
  });

  it('should set configuration and close dialog', () => {
    const reloadModelsAfterCloseThisModal = true;
    component.formGroup.setValue({
      host: 'example.com',
      systemPrompt: 'Hello',
    });
    spyOn(component["configService"], "setConfiguration");
    component.setConfiguration(reloadModelsAfterCloseThisModal);
    expect(component["configService"].setConfiguration).toHaveBeenCalledWith(component.formGroup.value as LMSTudioAPIConfiguration);
    expect(component["matDialogRef"].close).toHaveBeenCalledWith(reloadModelsAfterCloseThisModal);
  });
});
