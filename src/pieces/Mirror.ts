import { Move, MoveType } from "@lc/core";
import { Direction, DirectionUtils, Rotation } from "@lc/geometry";
import { DirectedPiece, PieceType } from "@lc/pieces";
import { CloseRangeMovement } from "@lc/piece-movements";
import { Syntax } from "@lc/utils";

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
    this.direction = DirectionUtils.rotateDoubleClockwise(this.direction!);
  }

  private turnAnticlockwise(): void {
    this.direction = DirectionUtils.rotateDoubleAnticlockwise(this.direction!);
  }

  private turn(rotation: Rotation): void {
    switch(rotation) {
      case Rotation.Anticlockwise:
        this.turnAnticlockwise();
      break;
      case Rotation.Clockwise:
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

  public override updateMoves(): void {
    super.updateMoves();
    const capturable: Partial<Move>[] = this.legalMoves.filter((move) => Syntax.inAlternative(move.moveType!, MoveType.Capture));
    this.illegalMoves = this.illegalMoves.concat(capturable);
    this.legalMoves = this.legalMoves.filter((move) => !capturable.includes(move));

    let move: Partial<Move> = {
      rotation: Rotation.Anticlockwise
    }  
    if(this.board.canRotate(Rotation.Anticlockwise, this.piece)) {
      this.legalMoves.push(move);
    }
    else {
      this.illegalMoves.push(move);
    }

    move = {
      rotation: Rotation.Clockwise
    }  
    if(this.board.canRotate(Rotation.Anticlockwise, this.piece)) {
      this.legalMoves.push(move);
    }
    else {
      this.illegalMoves.push(move);
    }
  }

}