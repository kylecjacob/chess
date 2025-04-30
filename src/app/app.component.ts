import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { GameControlsComponent } from './components/game-controls/game-controls.component';

@Component({
  selector: 'app',
  standalone: true,
  imports: [CommonModule, BoardComponent, GameControlsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chess';
}
