import { Piece, PieceColor, Position, PieceType } from '../piece.model';

export class Knight extends Piece {
  constructor(color: PieceColor, position: Position, hasMoved: boolean = false) {
    super(PieceType.Knight, color, position, hasMoved);
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const possibleMoves = [
      { row: this.position.row - 2, col: this.position.col - 1 },
      { row: this.position.row - 2, col: this.position.col + 1 },
      { row: this.position.row - 1, col: this.position.col - 2 },
      { row: this.position.row - 1, col: this.position.col + 2 },
      { row: this.position.row + 1, col: this.position.col - 2 },
      { row: this.position.row + 1, col: this.position.col + 2 },
      { row: this.position.row + 2, col: this.position.col - 1 },
      { row: this.position.row + 2, col: this.position.col + 1 }
    ];

    for (const move of possibleMoves) {
      if (this.isValidPosition(move)) {
        const targetPiece = board[move.row][move.col];
        if (!targetPiece || targetPiece.color !== this.color) {
          moves.push(move);
        }
      }
    }

    return moves;
  }

  private isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  }
} 