import { Board, Move } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";


export abstract class PieceMovement {
  protected board: Board;
  protected _piece?: Piece;
  protected readonly _allMoves: Partial<Move>[];
  protected readonly _legalMoves: Partial<Move>[];
  protected readonly _capturableMoves: Partial<Move>[];

  public constructor(board: Board) {
    this.board = board;
    this._allMoves = [];
    this._legalMoves = [];
    this._capturableMoves = [];
  }

  public set piece(piece: Piece) {
    this._piece = piece;
  }

  protected clearMoves(): void {
    this._allMoves.length = 0;
    this._legalMoves.length = 0;
    this._capturableMoves.length = 0;
  }

  protected abstract updateMovesWrapped(): void;

  public updateMoves(): void {
    this.clearMoves();
    this.updateMovesWrapped();
  }

  public get allMoves(): Partial<Move>[] {
    return this._allMoves;
  }

  public get legalMoves(): Partial<Move>[] {
    return this._legalMoves;
  }

  public get capturableMoves(): Partial<Move>[] {
    return this._capturableMoves;
  }
}
