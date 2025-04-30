import { Injectable } from '@angular/core';
import { Piece, Position, Move, PieceColor } from '../models/piece.model';

export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced'
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private difficulty: Difficulty = Difficulty.Intermediate;

  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }

  getNextMove(board: (Piece | null)[][], color: PieceColor): Move | null {
    switch (this.difficulty) {
      case Difficulty.Beginner:
        return this.getRandomMove(board, color);
      case Difficulty.Intermediate:
        return this.getIntermediateMove(board, color);
      case Difficulty.Advanced:
        return this.getAdvancedMove(board, color);
      default:
        return this.getRandomMove(board, color);
    }
  }

  private getRandomMove(board: (Piece | null)[][], color: PieceColor): Move | null {
    const possibleMoves: Move[] = [];
    
    // Collect all possible moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const moves = piece.getValidMoves(board);
          moves.forEach(to => {
            possibleMoves.push({
              from: { row, col },
              to,
              piece,
              capturedPiece: board[to.row][to.col]
            });
          });
        }
      }
    }

    // Return a random move if any are available
    if (possibleMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      return possibleMoves[randomIndex];
    }

    return null;
  }

  private getIntermediateMove(board: (Piece | null)[][], color: PieceColor): Move | null {
    const possibleMoves: Move[] = [];
    let bestScore = -Infinity;
    let bestMove: Move | null = null;

    // Collect all possible moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const moves = piece.getValidMoves(board);
          moves.forEach(to => {
            const move: Move = {
              from: { row, col },
              to,
              piece,
              capturedPiece: board[to.row][to.col]
            };
            possibleMoves.push(move);
          });
        }
      }
    }

    // Evaluate each move
    for (const move of possibleMoves) {
      const score = this.evaluateMove(board, move);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private getAdvancedMove(board: (Piece | null)[][], color: PieceColor): Move | null {
    // This would implement a minimax algorithm with alpha-beta pruning
    // For now, we'll use the intermediate logic
    return this.getIntermediateMove(board, color);
  }

  private evaluateMove(board: (Piece | null)[][], move: Move): number {
    let score = 0;

    // Capture value
    const targetPiece = board[move.to.row][move.to.col];
    if (targetPiece) {
      score += this.getPieceValue(targetPiece.type);
    }

    // Position value
    score += this.getPositionValue(move.to, move.piece.type);

    // Center control
    if (this.isInCenter(move.to)) {
      score += 0.5;
    }

    // Development (moving pieces from starting position)
    if (!move.piece.hasMoved) {
      score += 0.3;
    }

    // Add some randomness to avoid predictable play
    score += Math.random() * 0.5;

    return score;
  }

  private getPieceValue(type: string): number {
    switch (type) {
      case 'pawn':
        return 1;
      case 'knight':
        return 3;
      case 'bishop':
        return 3;
      case 'rook':
        return 5;
      case 'queen':
        return 9;
      case 'king':
        return 100;
      default:
        return 0;
    }
  }

  private getPositionValue(pos: Position, type: string): number {
    // This would implement position-based evaluation
    // For now, return a simple value based on piece type
    return this.getPieceValue(type) * 0.1;
  }

  private isInCenter(pos: Position): boolean {
    return pos.row >= 3 && pos.row <= 4 && pos.col >= 3 && pos.col <= 4;
  }
}
