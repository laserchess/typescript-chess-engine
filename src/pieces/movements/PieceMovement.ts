import { Board, Move } from "@lc/core";
import { Piece } from "@lc/pieces";


export abstract class PieceMovement {
  protected board: Board;
  protected piece: Piece;
  public readonly illegalMoves: Partial<Move>[];
  public readonly legalMoves: Partial<Move>[];

  public constructor(piece: Piece, board: Board) {
    this.piece           = piece;
    this.board           = board;
    this.legalMoves      = [];
    this.illegalMoves    = [];
  }

  protected clearMoves(): void {
    this.legalMoves.length   = 0;
    this.illegalMoves.length = 0;
  }

  protected preUpdateMoves(): void {
    this.clearMoves();
  }

  protected abstract updateMoves(): void;
}
