import { BoardVector2d } from "geometry";
import { DirectedPiece, Direction, PieceOpitons, PieceType } from "pieces";
import { AroundMovement } from "pieces/around_piece.js";

export class MirrorPiece extends DirectedPiece {
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
    super.direction = direction;
  }
}

export class MirrorMovement extends AroundMovement {

  public turnClockwise(): void {
    const piece: MirrorPiece = this.piece as MirrorPiece;
    piece.direction = Direction.turnDoubleRight(piece.direction)
  }

  public turnAnticlockwise(): void {
    const piece: MirrorPiece = this.piece as MirrorPiece;
    piece.direction = Direction.turnDoubleLeft(piece.direction)
  }

  public updateMoves(): void {
    super.updateMoves();
    this._capturableMoves.length = 0;  
  }
}