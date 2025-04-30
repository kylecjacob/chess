import { Piece, PieceColor, Position, PieceType } from '../piece.model';

export class Pawn extends Piece {
  constructor(color: PieceColor, position: Position, hasMoved: boolean = false) {
    super(PieceType.Pawn, color, position, hasMoved);
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const direction = this.color === PieceColor.White ? -1 : 1;
    const startRow = this.color === PieceColor.White ? 6 : 1;

    // Forward move
    const forwardPos = { row: this.position.row + direction, col: this.position.col };
    if (this.isValidPosition(forwardPos) && !board[forwardPos.row][forwardPos.col]) {
      moves.push(forwardPos);

      // Initial two-square move
      if (!this.hasMoved && this.position.row === startRow) {
        const doubleForwardPos = { row: this.position.row + 2 * direction, col: this.position.col };
        if (!board[doubleForwardPos.row][doubleForwardPos.col]) {
          moves.push(doubleForwardPos);
        }
      }
    }

    // Captures
    const capturePositions = [
      { row: this.position.row + direction, col: this.position.col - 1 },
      { row: this.position.row + direction, col: this.position.col + 1 }
    ];

    for (const pos of capturePositions) {
      if (this.isValidPosition(pos)) {
        const targetPiece = board[pos.row][pos.col];
        if (targetPiece && targetPiece.color !== this.color) {
          moves.push(pos);
        }
      }
    }

    return moves;
  }

  private isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  }
} 