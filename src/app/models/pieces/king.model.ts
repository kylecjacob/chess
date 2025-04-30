import { Piece, PieceColor, Position, PieceType } from '../piece.model';

export class King extends Piece {
  constructor(color: PieceColor, position: Position, hasMoved: boolean = false) {
    super(PieceType.King, color, position, hasMoved);
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const moves: Position[] = [];
    const directions = [
      { row: -1, col: -1 }, // Up-left
      { row: -1, col: 0 },  // Up
      { row: -1, col: 1 },  // Up-right
      { row: 0, col: -1 },  // Left
      { row: 0, col: 1 },   // Right
      { row: 1, col: -1 },  // Down-left
      { row: 1, col: 0 },   // Down
      { row: 1, col: 1 }    // Down-right
    ];

    // Normal moves
    for (const direction of directions) {
      const newPos = {
        row: this.position.row + direction.row,
        col: this.position.col + direction.col
      };

      if (this.isValidPosition(newPos)) {
        const targetPiece = board[newPos.row][newPos.col];
        if (!targetPiece || targetPiece.color !== this.color) {
          moves.push(newPos);
        }
      }
    }

    // Castling
    if (!this.hasMoved) {
      const row = this.color === PieceColor.White ? 7 : 0;
      
      // Kingside castling
      if (this.canCastleKingside(board, row)) {
        moves.push({ row, col: 6 });
      }

      // Queenside castling
      if (this.canCastleQueenside(board, row)) {
        moves.push({ row, col: 2 });
      }
    }

    return moves;
  }

  private canCastleKingside(board: (Piece | null)[][], row: number): boolean {
    const rookCol = 7;
    const rook = board[row][rookCol];
    
    return !!(
      rook &&
      rook.type === PieceType.Rook &&
      !rook.hasMoved &&
      !board[row][5] &&
      !board[row][6] &&
      !this.isSquareUnderAttack(board, { row, col: 5 }) &&
      !this.isSquareUnderAttack(board, { row, col: 6 })
    );
  }

  private canCastleQueenside(board: (Piece | null)[][], row: number): boolean {
    const rookCol = 0;
    const rook = board[row][rookCol];
    
    return !!(
      rook &&
      rook.type === PieceType.Rook &&
      !rook.hasMoved &&
      !board[row][1] &&
      !board[row][2] &&
      !board[row][3] &&
      !this.isSquareUnderAttack(board, { row, col: 2 }) &&
      !this.isSquareUnderAttack(board, { row, col: 3 })
    );
  }

  private isSquareUnderAttack(board: (Piece | null)[][], pos: Position): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color !== this.color) {
          const moves = piece.getValidMoves(board);
          if (moves.some(move => move.row === pos.row && move.col === pos.col)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  }
} 