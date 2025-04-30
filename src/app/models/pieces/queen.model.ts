import { Piece, PieceColor, Position, PieceType } from '../piece.model';

export class Queen extends Piece {
  constructor(color: PieceColor, position: Position, hasMoved: boolean = false) {
    super(PieceType.Queen, color, position, hasMoved);
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const directions = [
      { row: -1, col: -1 }, // Up-left
      { row: -1, col: 1 },  // Up-right
      { row: 1, col: -1 },  // Down-left
      { row: 1, col: 1 },   // Down-right
      { row: -1, col: 0 },  // Up
      { row: 1, col: 0 },   // Down
      { row: 0, col: -1 },  // Left
      { row: 0, col: 1 }    // Right
    ];

    for (const direction of directions) {
      let currentRow = this.position.row + direction.row;
      let currentCol = this.position.col + direction.col;

      while (this.isValidPosition({ row: currentRow, col: currentCol })) {
        const targetPiece = board[currentRow][currentCol];
        
        if (!targetPiece) {
          moves.push({ row: currentRow, col: currentCol });
        } else {
          if (targetPiece.color !== this.color) {
            moves.push({ row: currentRow, col: currentCol });
          }
          break;
        }

        currentRow += direction.row;
        currentCol += direction.col;
      }
    }

    return moves;
  }

  private isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  }
} 