import { BoardVector2d } from "geometry";
import { DirectedPiece, Direction, PieceMovement, PieceOpitons, PieceType } from "pieces";

export class LasgunPiece extends DirectedPiece {
  public _maxToCharge?: number;
  public _currentCharge: number;
  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    let options: PieceOpitons =
    {
      pieceType: PieceType.LASGUN,
      movement: new LasgunMovement(board)
    }
    super(position, playerId, board, options);
    this.movement.piece = this;
    this._currentCharge = 0;
  }

  public set direction(direction: Direction) {
    if (direction % 2 === 0) {
      throw new Error("Direction for MirrorPiece have to be diagonal.");
    }
    super.direction = direction;
  }

  public set maxToCharge(load: number) {
    this._maxToCharge = load;
  }

  public get currentCharge(): number {
    return this.currentCharge;
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

export class LasgunMovement extends PieceMovement {
  protected updateMovesWrapped(): void {
    // Hands up, don't move!
  }
}