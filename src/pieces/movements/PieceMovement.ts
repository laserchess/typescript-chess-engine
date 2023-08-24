import { Board, Move } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";


export abstract class PieceMovement {
  protected board: Board;
  protected _piece?: Piece;
  public readonly allMoves: Partial<Move>[];
  public readonly legalMoves: Partial<Move>[];
  public readonly capturableMoves: Partial<Move>[];

  public constructor(board: Board) {
    this.board           = board;
    this.allMoves        = [];
    this.legalMoves      = [];
    this.capturableMoves = [];
  }

  public set piece(piece: Piece) {
    this._piece = piece;
  }

  protected clearMoves(): void {
    this.allMoves.length        = 0;
    this.legalMoves.length      = 0;
    this.capturableMoves.length = 0;
  }

  protected abstract updateMovesWrapped(): void;

  public updateMoves(): void {
    this.clearMoves();
    this.updateMovesWrapped();
  }
}
