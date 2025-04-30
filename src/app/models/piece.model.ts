export enum PieceColor {
  White = 'white',
  Black = 'black'
}

export enum PieceType {
  Pawn = 'pawn',
  Knight = 'knight',
  Bishop = 'bishop',
  Rook = 'rook',
  Queen = 'queen',
  King = 'king'
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece: Piece | null;
  isCastling?: boolean;
  isEnPassant?: boolean;
  isPromotion?: boolean;
  promotionPieceType?: PieceType;
}

export abstract class Piece {
  constructor(
    public type: PieceType,
    public color: PieceColor,
    public position: Position,
    public hasMoved: boolean = false
  ) {}

  abstract getValidMoves(board: (Piece | null)[][]): Position[];
  
  canMoveTo(position: Position, board: (Piece | null)[][]): boolean {
    return this.getValidMoves(board).some(
      move => move.row === position.row && move.col === position.col
    );
  }

  moveTo(position: Position): void {
    this.position = position;
    this.hasMoved = true;
  }
} 