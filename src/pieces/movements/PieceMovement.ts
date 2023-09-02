import { Board, Move } from "@lc/core";
import { Piece } from "@lc/pieces";


export abstract class PieceMovement {
  protected board: Board;
  protected piece: Piece;
  protected lastUpdate: number;
  public readonly allMoves: Partial<Move>[];
  public readonly legalMoves: Partial<Move>[];
  public readonly capturableMoves: Partial<Move>[];

  public constructor(piece: Piece, board: Board) {
    this.piece           = piece;
    this.board           = board;
    this.lastUpdate      = 0;
    this.allMoves        = [];
    this.legalMoves      = [];
    this.capturableMoves = [];
  }

  protected clearMoves(): void {
    this.allMoves.length        = 0;
    this.legalMoves.length      = 0;
    this.capturableMoves.length = 0;
  }

  protected preUpdateMoves(): void {
    this.clearMoves();
  }

  protected abstract updateMoves(): void;
}
