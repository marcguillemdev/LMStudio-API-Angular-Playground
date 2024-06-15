import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigComponent } from './config.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';

describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfigComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
