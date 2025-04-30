import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Piece, PieceColor, Position, Move, PieceType } from '../models/piece.model';
import { Pawn } from '../models/pieces/pawn.model';
import { Knight } from '../models/pieces/knight.model';
import { Bishop } from '../models/pieces/bishop.model';
import { Rook } from '../models/pieces/rook.model';
import { Queen } from '../models/pieces/queen.model';
import { King } from '../models/pieces/king.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private board: (Piece | null)[][] = [];
  private selectedPiece: Piece | null = null;
  private validMoves: Position[] = [];
  private moveHistory: Move[] = [];
  private currentPlayer: PieceColor = PieceColor.White;
  private gameSettings = {
    showCoordinates: true,
    boardColor: 'default',
    difficulty: 'intermediate'
  };

  private boardSubject = new BehaviorSubject<(Piece | null)[][]>([]);
  private selectedPieceSubject = new BehaviorSubject<Piece | null>(null);
  private validMovesSubject = new BehaviorSubject<Position[]>([]);
  private currentPlayerSubject = new BehaviorSubject<PieceColor>(PieceColor.White);
  private gameSettingsSubject = new BehaviorSubject(this.gameSettings);

  constructor() {
    this.initializeBoard();
  }

  getBoard(): Observable<(Piece | null)[][]> {
    return this.boardSubject.asObservable();
  }

  getSelectedPiece(): Observable<Piece | null> {
    return this.selectedPieceSubject.asObservable();
  }

  getValidMoves(): Observable<Position[]> {
    return this.validMovesSubject.asObservable();
  }

  getCurrentPlayer(): Observable<PieceColor> {
    return this.currentPlayerSubject.asObservable();
  }

  getGameSettings(): Observable<any> {
    return this.gameSettingsSubject.asObservable();
  }

  selectPiece(position: Position): void {
    const piece = this.board[position.row][position.col];
    if (piece && piece.color === this.currentPlayer) {
      this.selectedPiece = piece;
      this.validMoves = piece.getValidMoves(this.board);
      this.selectedPieceSubject.next(piece);
      this.validMovesSubject.next(this.validMoves);
    }
  }

  movePiece(to: Position): void {
    if (this.selectedPiece && this.isValidMove(to)) {
      const from = { ...this.selectedPiece.position };
      const capturedPiece = this.board[to.row][to.col];
      
      // Handle special moves
      const move: Move = {
        from,
        to,
        piece: this.selectedPiece,
        capturedPiece
      };

      if (this.isCastling(from, to)) {
        move.isCastling = true;
        this.handleCastling(from, to);
      } else if (this.isPawnPromotion(this.selectedPiece, to)) {
        move.isPromotion = true;
        // Handle promotion in the UI
      }

      // Update board
      this.board[to.row][to.col] = this.selectedPiece;
      this.board[from.row][from.col] = null;
      this.selectedPiece.moveTo(to);

      // Update game state
      this.moveHistory.push(move);
      this.currentPlayer = this.currentPlayer === PieceColor.White ? PieceColor.Black : PieceColor.White;
      
      // Clear selection
      this.selectedPiece = null;
      this.validMoves = [];

      // Update subjects
      this.boardSubject.next(this.board);
      this.selectedPieceSubject.next(null);
      this.validMovesSubject.next([]);
      this.currentPlayerSubject.next(this.currentPlayer);
    }
  }

  undoMove(): void {
    if (this.moveHistory.length > 0) {
      const lastMove = this.moveHistory.pop()!;
      
      // Restore the moved piece
      this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
      lastMove.piece.moveTo(lastMove.from);
      
      // Restore captured piece if any
      if (lastMove.capturedPiece) {
        this.board[lastMove.to.row][lastMove.to.col] = lastMove.capturedPiece;
      } else {
        this.board[lastMove.to.row][lastMove.to.col] = null;
      }

      // Handle special moves
      if (lastMove.isCastling) {
        this.undoCastling(lastMove);
      }

      // Update game state
      this.currentPlayer = this.currentPlayer === PieceColor.White ? PieceColor.Black : PieceColor.White;
      
      // Update subjects
      this.boardSubject.next(this.board);
      this.currentPlayerSubject.next(this.currentPlayer);
    }
  }

  updateGameSettings(settings: Partial<typeof this.gameSettings>): void {
    this.gameSettings = { ...this.gameSettings, ...settings };
    this.gameSettingsSubject.next(this.gameSettings);
  }

  private initializeBoard(): void {
    // Initialize empty board
    for (let i = 0; i < 8; i++) {
      this.board[i] = new Array(8).fill(null);
    }

    // Place pawns
    for (let i = 0; i < 8; i++) {
      this.board[1][i] = new Pawn(PieceColor.Black, { row: 1, col: i });
      this.board[6][i] = new Pawn(PieceColor.White, { row: 6, col: i });
    }

    // Place other pieces
    const backRow = [
      PieceType.Rook,
      PieceType.Knight,
      PieceType.Bishop,
      PieceType.Queen,
      PieceType.King,
      PieceType.Bishop,
      PieceType.Knight,
      PieceType.Rook
    ];

    for (let i = 0; i < 8; i++) {
      // Black pieces
      this.board[0][i] = this.createPiece(backRow[i], PieceColor.Black, { row: 0, col: i });
      // White pieces
      this.board[7][i] = this.createPiece(backRow[i], PieceColor.White, { row: 7, col: i });
    }

    this.boardSubject.next(this.board);
  }

  private createPiece(type: PieceType, color: PieceColor, position: Position): Piece {
    switch (type) {
      case PieceType.Pawn:
        return new Pawn(color, position);
      case PieceType.Knight:
        return new Knight(color, position);
      case PieceType.Bishop:
        return new Bishop(color, position);
      case PieceType.Rook:
        return new Rook(color, position);
      case PieceType.Queen:
        return new Queen(color, position);
      case PieceType.King:
        return new King(color, position);
      default:
        throw new Error(`Unknown piece type: ${type}`);
    }
  }

  private isValidMove(to: Position): boolean {
    return this.validMoves.some(
      move => move.row === to.row && move.col === to.col
    );
  }

  private isCastling(from: Position, to: Position): boolean {
    if (!this.selectedPiece || this.selectedPiece.type !== PieceType.King) {
      return false;
    }

    return Math.abs(from.col - to.col) === 2;
  }

  private handleCastling(from: Position, to: Position): void {
    const row = from.row;
    const isKingside = to.col > from.col;
    const rookFromCol = isKingside ? 7 : 0;
    const rookToCol = isKingside ? 5 : 3;

    // Move rook
    const rook = this.board[row][rookFromCol];
    if (rook) {
      this.board[row][rookToCol] = rook;
      this.board[row][rookFromCol] = null;
      rook.moveTo({ row, col: rookToCol });
    }
  }

  private undoCastling(move: Move): void {
    const row = move.from.row;
    const isKingside = move.to.col > move.from.col;
    const rookFromCol = isKingside ? 7 : 0;
    const rookToCol = isKingside ? 5 : 3;

    // Move rook back
    const rook = this.board[row][rookToCol];
    if (rook) {
      this.board[row][rookFromCol] = rook;
      this.board[row][rookToCol] = null;
      rook.moveTo({ row, col: rookFromCol });
    }
  }

  private isPawnPromotion(piece: Piece, to: Position): boolean {
    return (
      piece.type === PieceType.Pawn &&
      ((piece.color === PieceColor.White && to.row === 0) ||
        (piece.color === PieceColor.Black && to.row === 7))
    );
  }
}
