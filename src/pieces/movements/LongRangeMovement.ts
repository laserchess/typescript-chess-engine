import { Board, CaptureOptions, Move, MoveType } from "@lc/core";
import { BoardVector2d, Direction, DirectionUtils } from "@lc/geometry";
import { Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/pieces";
import { Syntax } from "@lc/utils";

export class LongRangeMovement extends PieceMovement {
  public allLongRangeMoves: Partial<Record<Direction, Partial<Move>[]>> = {};
  public readonly directions: Direction[];

  constructor(piece: Piece, board: Board, directions: Direction[]) {
    super(piece, board);
    this.directions = directions;
  }

  public override updateMoves(): void {
    this.preUpdateMoves();
    this.allLongRangeMoves = this.getAllLongRangeMoves();

    for (const direction of this.directions) {
      let legal: boolean = true;
      for (const move of this.allLongRangeMoves[direction]!) {
        if (this.board.isPieceAt(move.destination!) && !this.board.canMoveTo(move.destination!, this.piece, CaptureOptions.RequiredCapture)) {
          legal = false;
        }
        if (legal) {
          this.legalMoves.push(move);
        }
        else {
          this.illegalMoves.push(move);
        }

        if (Syntax.inAlternative(move.moveType!, MoveType.Capture)) {
          legal = false;
        }
      }
    }
  }

  private getAllLongRangeMoves(): Partial<Record<Direction, Partial<Move>[]>> {
    const moves: Partial<Record<Direction, Partial<Move>[]>> = {};
    for (const direction of this.directions) {
      moves[direction] = this.getAllCoordinatesByDirection(direction);
    }
    return moves;
  }

  private getAllCoordinatesByDirection(direction: Direction): Partial<Move>[] {
    const x = this.piece.position.x,
      y = this.piece.position.y,
      tuple = DirectionUtils.toTuple(direction),
      step = { x: tuple[0], y: tuple[1] };
    const maxMoveLength: {x: number, y: number} = {} as {x: number, y: number};
    if (step.x > 0) {
      maxMoveLength.x = this.board.width - x;
    }
    else if (step.x < 0){
      maxMoveLength.x = x;
    }
    else {
      maxMoveLength.x = Infinity;
    }

    if (step.y > 0) {
      maxMoveLength.y = this.board.height - y;
    }
    else if (step.y < 0){
      maxMoveLength.y = y;
    }
    else {
      maxMoveLength.y = Infinity;
    }
    
    const moveLength = Math.min(maxMoveLength.x, maxMoveLength.y);

    const moveArray: Partial<Move>[] = [];
    let i = 1;
    for (; i < moveLength + 1; i++) {
      const vector: BoardVector2d = new BoardVector2d(x + i * step.x, y + i * step.y);
      if (!this.board.isOutOfBounds(vector)) {
        if (this.board.canMoveTo(vector, this.piece, CaptureOptions.RequiredCapture)) {
          moveArray.push({
            destination: vector,
            moveType: MoveType.Move | MoveType.Capture
          })
        } 
        else {
          moveArray.push({
            destination: vector,
            moveType: MoveType.Move
          })
        }
      }
      
    }
    return moveArray
  }
}