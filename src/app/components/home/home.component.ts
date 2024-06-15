import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatTabsModule, MatListModule, MatButtonModule, MatIconModule, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  public tabs = new Array(1).fill(0).map((_, i) => `Chat ${i + 1}`);

  addNewTab() {
    this.tabs.push(`Chat ${this.tabs.length + 1}`);
  }
}
