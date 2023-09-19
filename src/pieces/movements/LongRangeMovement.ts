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

  protected override updateMoves(): void {
    this.preUpdateMoves();
    this.allLongRangeMoves = this.getAllLongRangeMoves();

    for (let direction of this.directions) {
      let legal: boolean = true;
      for (let move of this.allLongRangeMoves[direction]!) {
        if (Syntax.inAlternative(move.moveType!, MoveType.Capture)) {
          legal = false;
        }

        if (legal) {
          this.legalMoves.push(move);
        }
        else {
          this.illegalMoves.push(move);
        }
      }
    }
  }

  private getAllLongRangeMoves(): Partial<Record<Direction, Partial<Move>[]>> {
    const moves: Partial<Record<Direction, Partial<Move>[]>> = {};
    for (const direction of this.directions) {
      moves[direction] =  this.getAllCoordinatesByDirection(direction);
    }
    return moves;
  }

  private getAllCoordinatesByDirection(direction: Direction): Partial<Move>[] {
    const x = this.piece.position.x, 
          y = this.piece.position.y,
          tuple = DirectionUtils.toTuple(direction),
          step = { x: tuple[0], y: tuple[1] };
    const maxMoveLength = {
      x: step.x > 0 ? this.board.width  - x : x,
      y: step.y > 0 ? this.board.height - y : y
    };
    const moveLength = Math.min(maxMoveLength.x, maxMoveLength.y);

    const moveArray: Partial<Move>[] = [];
    let i = 0;
    for (;i < moveLength; i++) {
      let vector: BoardVector2d = new BoardVector2d(x + i * step.x, y + i * step.y);
      if (this.board.canMoveTo(vector, this.piece, CaptureOptions.NoCapture)) {
        moveArray.push({
          destination: vector,
          moveType: MoveType.Move
        })
      }
      else if (this.board.canMoveTo(vector, this.piece, CaptureOptions.RequiredCapture)) {
        moveArray.push({
          destination: vector,
          moveType: MoveType.Move | MoveType.Capture
        })
      }
    }
    return  moveArray
  }
}