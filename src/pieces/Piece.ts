import { Board } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { PieceMovement } from "@lc/piece-movements";


export enum PieceType {
  KING   = "K",
  QUEEN  = "Q",
  PAWN   = "",
  BISHOP = "B",
  ROOK   = "R",
  KNIGHT = "N",
  MIRROR = "M",
  LASGUN = "L"
}

export interface PieceOptions {
  pieceType: PieceType,
  movement: PieceMovement
}

export abstract class Piece {

  public readonly initialPosition: BoardVector2d;
  public readonly playerId: number;
  protected readonly board: Board;
  protected _type!: PieceType;
  protected _movement!: PieceMovement;
  public readonly defendsKingsFrom: [Piece | null, Piece | null];
  public position: BoardVector2d;
  protected moveCounter: number;


  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    this.initialPosition  = position;
    this.position         = position;
    this.playerId         = playerId;
    this.moveCounter      = 0;
    this.board            = board;
    this.defendsKingsFrom = [null, null];

    this.initType();
  }

  protected abstract initType(): void;

  public get type(): PieceType {
    if (!this._type) {
      throw new Error("Piece type is not initialised");
    }
    return this._type;
  }

  public get movement(): PieceMovement {
    if (!this._movement) {
      throw new Error("Piece movement is not initialised");
    }
    return this._movement;
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof Piece)) {
      return false;
    }
    return this.initialPosition === other.initialPosition
        && this.position === other.position
        && this.playerId === other.playerId
        && this.moveCounter === other.playerId
        && this._movement === other.movement
        && this.type === other.type
  }

  public toString(): string {
    return this.type.valueOf();
  }

  public wasMoved(): boolean {
    return this.moveCounter > 0;
  }

  public isSameColor(other: Piece | number): boolean {
    if (other instanceof Piece) {
      return this.playerId === other.playerId;
    }
    return this.playerId === other;
  }

  public move(destination: BoardVector2d) {
    // const origin: BoardVector2d = this.position.copy();
    this.position = destination;
    this.moveCounter += 1;
    // this.board.notifyPositionChange(origin, destination);
  }
}
