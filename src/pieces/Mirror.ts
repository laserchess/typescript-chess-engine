import { Move, MoveType } from "@lc/core";
import { Direction, DirectionUtils, Rotation } from "@lc/geometry";
import { DirectedPiece, PieceType } from "@lc/pieces";
import { CloseRangeMovement } from "@lc/piece-movements";

export class Mirror extends DirectedPiece {
  protected override initType(): void {
    this._type = PieceType.MIRROR;
    this._movement  = new MirrorMovement(this, this.board);
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
  
  private turnClockwise(): void {
    this.direction = Direction.turnDoubleRight(this.direction!);
  }

  private turnAnticlockwise(): void {
    this.direction = Direction.turnDoubleLeft(this.direction!);
  }

  private turn(rotation: Rotation): void {
    switch(rotation) {
      case Rotation.Anticlockwise:
        this.turnAnticlockwise();
      break;
      case Rotation.Anticlockwise:
        this.turnClockwise();
      break;
    }
  }

  public override move(move: Move): void {
    if ((move.moveType & MoveType.Rotation) === MoveType.Rotation) {
      this.moveCounter++;
      this.turn(move.rotation!);
    }
    else {
      super.move(move);
    }
  }

}

export class MirrorMovement extends CloseRangeMovement {

  protected updateMoves(): void {
    this.preUpdateMoves();

    this.capturableMoves.length = 0;
    const move: Partial<Move> = {
      rotation: Rotation.Anticlockwise
    }  
    this.legalMoves.push(ObjectUtilities.deepCopy(move));
    this.allMoves.push(ObjectUtilities.deepCopy(move));
    
    move.rotation = Rotation.Clockwise;
    this.legalMoves.push(ObjectUtilities.deepCopy(move));
    this.allMoves.push(move);
  }

}