import { Board } from "core/Board.js";
import { BoardVector2d, Direction } from "geometry";
import { DirectedPiece, PieceOpitons, PieceType } from "pieces";
import { CloseRangeMovement } from "pieces/movements/CloseRangeMovement.js";


export class Mirror extends DirectedPiece {
  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    let options: PieceOpitons =
    {
      pieceType: PieceType.MIRROR,
      movement: new MirrorMovement(board)
    }
    super(position, playerId, board, options);
    this.movement.piece = this
  }
  public set direction(direction: Direction) {
    if (direction % 2 === 0) {
      throw new Error("Direction for MirrorPiece have to be diagonal.");
    }
    super._direction = direction;
  }

  public get direction(): Direction | undefined {
    return this._direction;
  }
}

export class MirrorMovement extends CloseRangeMovement {

  public turnClockwise(): void {
    const piece: Mirror = this.piece as Mirror;
    piece.direction = Direction.turnDoubleRight(piece.direction!);
  }

  public turnAnticlockwise(): void {
    const piece: Mirror = this.piece as Mirror;
    piece.direction = Direction.turnDoubleLeft(piece.direction!);
  }

  protected updateMovesWrapped(): void {
    super.updateMoves();
    this._capturableMoves.length = 0;  
  }
}