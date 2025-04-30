import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Piece, Position } from '../../models/piece.model';
import { BoardCoordinatesComponent } from '../board-coordinates/board-coordinates.component';

@Component({
  selector: 'board',
  standalone: true,
  imports: [CommonModule, BoardCoordinatesComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: (Piece | null)[][] = [];
  selectedPiece: Piece | null = null;
  validMoves: Position[] = [];
  showCoordinates = true;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getBoard().subscribe(board => {
      this.board = board;
    });

    this.gameService.getSelectedPiece().subscribe(piece => {
      this.selectedPiece = piece;
    });

    this.gameService.getValidMoves().subscribe(moves => {
      this.validMoves = moves;
    });

    this.gameService.getGameSettings().subscribe(settings => {
      this.showCoordinates = settings.showCoordinates;
    });
  }

  onSquareClick(row: number, col: number): void {
    const position: Position = { row, col };
    
    if (this.selectedPiece) {
      this.gameService.movePiece(position);
    } else {
      this.gameService.selectPiece(position);
    }
  }

  isLightSquare(row: number, col: number): boolean {
    return (row + col) % 2 === 0;
  }

  isDarkSquare(row: number, col: number): boolean {
    return !this.isLightSquare(row, col);
  }

  isSelected(row: number, col: number): boolean {
    return this.selectedPiece?.position.row === row && this.selectedPiece?.position.col === col;
  }

  isValidMove(row: number, col: number): boolean {
    return this.validMoves.some(move => move.row === row && move.col === col);
  }

  getPieceSymbol(piece: Piece): string {
    switch (piece.type) {
      case 'king':
        return '♔';
      case 'queen':
        return '♕';
      case 'rook':
        return '♖';
      case 'bishop':
        return '♗';
      case 'knight':
        return '♘';
      case 'pawn':
        return '♙';
      default:
        return '';
    }
  }

  getFile(col: number): string {
    return String.fromCharCode(97 + col); // 'a' through 'h'
  }

  getRank(row: number): string {
    return (8 - row).toString(); // '1' through '8'
  }
}
