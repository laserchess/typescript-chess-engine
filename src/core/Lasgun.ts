import { Board } from "@lc/core";
import { BoardVector2d, Direction } from "@lc/geometry";

export const enum LaserState {
  LaserFired = 1 << 0,
  LaserSustained = 1 << 1,
  LaserOff = 1 << 2
}

export class Lasgun {
  private _maxToCharge?: number;
  private _currentCharge: number;
  private _direction?: Direction;
  private readonly board: Board;
  public readonly playerId: number;
  public readonly position: BoardVector2d;

  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    this.position = position;
    this.playerId = playerId;
    this.board = board;
    this._currentCharge = 0;
  }

  public set direction(direction: Direction) {
    if (direction % 2 === 0) {
      throw new Error("Direction for MirrorPiece have to be diagonal.");
    }
    this._direction = direction;
  }
  public get direction(): Direction | undefined {
    return this._direction;
  }

  public set maxToCharge(load: number) {
    this._maxToCharge = load;
  }

  public get maxToCharge(): number {
    return this.currentCharge;
  }

  public get currentCharge(): number {
    return this.currentCharge;
  }

  public get laserState(): LaserState {
    return LaserState.LaserFired;
  }

  public propagateLaser() {
    // TODO
  }

  public chargeLaser() {
    this._currentCharge = Math.min(this.currentCharge + 1, this._maxToCharge!);
  }

  public isLoaded() {
    return this._currentCharge === this._maxToCharge;
  }
}

