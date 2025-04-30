import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { AiService, Difficulty } from '../../services/ai.service';
import { PieceColor } from '../../models/piece.model';

@Component({
  selector: 'game-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.scss']
})
export class GameControlsComponent implements OnInit {
  showCoordinates = true;
  boardColor = 'default';
  difficulty: Difficulty = Difficulty.Intermediate;
  playerColor: PieceColor = PieceColor.White;
  canUndo = false;

  constructor(
    private gameService: GameService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.gameService.getGameSettings().subscribe(settings => {
      this.showCoordinates = settings.showCoordinates;
      this.boardColor = settings.boardColor;
    });
  }

  updateSettings(): void {
    this.gameService.updateGameSettings({
      showCoordinates: this.showCoordinates,
      boardColor: this.boardColor
    });
  }

  updateDifficulty(): void {
    this.aiService.setDifficulty(this.difficulty);
  }

  updatePlayerColor(): void {
    // This would be implemented to switch the player's color
    // and potentially rotate the board
  }

  undoMove(): void {
    this.gameService.undoMove();
  }

  resetGame(): void {
    // This would be implemented to start a new game
  }
}
