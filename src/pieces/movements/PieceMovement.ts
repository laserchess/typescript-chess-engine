import { BoardVector2d } from "geometry";
import { Piece } from "pieces";
import { Board } from "core/board.js";

export abstract class PieceMovement {
  protected board: Board;
  protected _piece?: Piece;
  protected readonly _allMoves: BoardVector2d[];
  protected readonly _legalMoves: BoardVector2d[];
  protected readonly _capturableMoves: BoardVector2d[];

  public constructor(board: Board) {
    this.board = board;
    this._allMoves = [];
    this._legalMoves = [];
    this._capturableMoves = [];
  }

  public set piece(piece: Piece) {
    if (this._piece === undefined) {
      this._piece = piece;
    }
  }

  protected clearMoves(): void {
    this._allMoves.length = 0;
    this._legalMoves.length = 0;
    this._capturableMoves.length = 0;
  }

  public abstract updateMoves(): void;


  public get allMoves(): BoardVector2d[] {
    return this._allMoves;
  }

  public get legalMoves(): BoardVector2d[] {
    return this._legalMoves;
  }

  public get capturableMoves(): BoardVector2d[] {
    return this._capturableMoves;
  }
}
