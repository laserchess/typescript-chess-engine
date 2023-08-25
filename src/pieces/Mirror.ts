import { Move } from "@lc/core";
import { Direction, Rotation } from "@lc/geometry";
import { DirectedPiece, PieceType } from "@lc/pieces";
import { CloseRangeMovement } from "@lc/piece-movements";
import { ObjectsUtilities } from "@lc/utils";


export class Mirror extends DirectedPiece {
  protected override initType(): void {
    this._type = PieceType.MIRROR;
    this._movement  = new MirrorMovement(this, this.board);
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
    this.capturableMoves.length = 0;
    const move: Partial<Move> = {
      rotation: Rotation.Anticlockwise
    }  
    this.legalMoves.push(ObjectsUtilities.deepCopy(move));
    this.allMoves.push(ObjectsUtilities.deepCopy(move));
    
    move.rotation = Rotation.Clockwise;
    this.legalMoves.push(ObjectsUtilities.deepCopy(move));
    this.allMoves.push(move);
  }
}