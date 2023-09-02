import { Board, Move } from "@lc/core";
import { NotImplementedError } from "@lc/utils";
import { BoardVector2d, Direction, DirectionUtils } from "@lc/geometry";
import { Piece } from "@lc/pieces";
import { PieceMovement } from "@lc/piece-movements";

export class LongRangeMovement extends PieceMovement {
  // All moves but grouped by its direction.
  public allLongRangeMoves: Partial<Record<Direction, Partial<Move>>> = {};
  public readonly directions: Direction[];

  constructor(piece: Piece, board: Board, directions: Direction[]) {
    super(piece, board);
    this.directions = directions;
  }

  protected override updateMoves(): void {
    this.clearMoves();

  }

  private getAllLongRangeMoves(): Partial<Record<Direction, Partial<Move>>> {
    const moves: Partial<Record<Direction, Partial<Move>>> = {};
    for (const direction of this.directions) {
      const moveCoordinates = this.getAllCoordinatesByDirection(direction);
    }
    return moves;
  }

  private getAllCoordinatesByDirection(direction: Direction): BoardVector2d[] {
    const x = this.piece.position.x, y = this.piece.position.y,
          tuple = DirectionUtils.toTuple(direction),
          step = { x: tuple[0], y: tuple[1] };
    const maxMoveLength = {
      x: step.x > 0 ? this.board.width  - x : x,
      y: step.y > 0 ? this.board.height - y : y
    };
    const moveLength = Math.min(maxMoveLength.x, maxMoveLength.y);

    return new Array(moveLength)
      .map((_: unknown, i: number) => new BoardVector2d(x + i * step.x, y + i * step.y));
  }

  public getAllMoves(): BoardVector2d[][] {
    throw new NotImplementedError("getAllMoves() method is not implemented yet");
  }

  public getLegalMoves(): BoardVector2d[][] {
    throw new NotImplementedError("getLegalMoves() method is not implemented yet");
  }
}