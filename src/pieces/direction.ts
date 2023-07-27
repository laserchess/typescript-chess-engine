import { BoardVector2d } from "geometry";

export enum Direction {
  LEFT_RANK = 0,
  UPPER_LEFT_DIAGONAL = 1,
  UPPER_FILE = 2,
  UPPER_RIGHT_DIAGONAL = 3,
  RIGHT_RANK = 4,
  BOTTOM_RIGHT_DIAGONAL = 5,
  BOTTOM_FILE = 6,
  BOTTOM_LEFT_DIAGONAL = 7
}

export enum Rotation {
  CLOCKWISE = 0,
  ANTICLOCKWISE = 1
}

export namespace Direction {

  export function left(direction: Direction): Direction {
    return (direction.valueOf() + 7) % 8 as Direction;
  }

  export function right(direction: Direction): Direction {
    return (direction.valueOf() + 1) % 8 as Direction;
  }

  export function doubleLeft(direction: Direction): Direction {
    return left(left(direction)) as Direction;
  }

  export function doubleRight(direction: Direction): Direction {
    return right(right(direction)) as Direction;
  }

  export function createFrom(coordinates: BoardVector2d | [number, number]): Direction {
    if (coordinates instanceof BoardVector2d) {
      coordinates = coordinates.toTuple();
    }
    switch (coordinates.join(", ")) {
      case "-1, 0":
        return Direction.LEFT_RANK;
      case "1, 0":
        return Direction.RIGHT_RANK;
      case "0, 1":
        return Direction.UPPER_FILE;
      case "0, -1":
        return Direction.BOTTOM_FILE;
      case "-1, 1":
        return Direction.UPPER_LEFT_DIAGONAL;
      case "1, 1":
        return Direction.UPPER_RIGHT_DIAGONAL;
      case "1, -1":
        return Direction.BOTTOM_RIGHT_DIAGONAL;
      case "-1, -1":
        return Direction.BOTTOM_LEFT_DIAGONAL;
      default:
        throw new Error("Wrong value of vector")
    }
  }


  export function toTuple(direction: Direction): [number, number] {
    switch (direction) {
      case Direction.LEFT_RANK:
        return [-1, 0]
      case Direction.RIGHT_RANK:
        return [1, 0]
      case Direction.UPPER_FILE:
        return [0, 1]
      case Direction.BOTTOM_FILE:
        return [0, -1]
      case Direction.UPPER_LEFT_DIAGONAL:
        return [-1, 1]
      case Direction.UPPER_RIGHT_DIAGONAL:
        return [1, 1]
      case Direction.BOTTOM_RIGHT_DIAGONAL:
        return [1, -1]
      case Direction.BOTTOM_LEFT_DIAGONAL:
        return [-1, -1]
    }
  }

  export function toBoardVector2d(direction: Direction): BoardVector2d {
    switch (direction) {
      case Direction.LEFT_RANK:
        return new BoardVector2d(-1, 0);
      case Direction.RIGHT_RANK:
        return new BoardVector2d(1, 0)
      case Direction.UPPER_FILE:
        return new BoardVector2d(0, 1)
      case Direction.BOTTOM_FILE:
        return new BoardVector2d(0, -1)
      case Direction.UPPER_LEFT_DIAGONAL:
        return new BoardVector2d(-1, 1)
      case Direction.UPPER_RIGHT_DIAGONAL:
        return new BoardVector2d(1, 1)
      case Direction.BOTTOM_RIGHT_DIAGONAL:
        return new BoardVector2d(1, -1)
      case Direction.BOTTOM_LEFT_DIAGONAL:
        return new BoardVector2d(-1, -1)
    }
  }

  export function getSquaresFromTuple(increment: [number, number], board: Board, origin: BoardVector2d): BoardVector2d[] {
    let xi: number = increment[0];
    let yi: number = increment[1];
    if (xi === 0 && yi === 0) {
      throw new Error("Increment tuple must be different than (0, 0)");
    }
    let xs: number[] = [];
    let ys: number[] = [];
    if (xi !== 0) {
      for (let i = origin.x; i < (xi > 0 ? board.width : -1); i += xi) {
        xs.push(i);
      }
    }
    if (yi !== 0) {
      for (let i = origin.y; i < (yi > 0 ? board.width : -1); i += yi) {
        ys.push(i);
      }
    }
    if (xi === 0) {
      for (let i = 0; i < ys.length; i++) {
        xs.push(origin.x);
      }
    }
    if (yi === 0) {
      for (let i = 0; i < xs.length; i++) {
        ys.push(origin.y);
      }
    }
    let moves: BoardVector2d[] = [];
    for (let sInX of xs) {
      for (let sInY of ys) {
        moves.push(new BoardVector2d(sInX, sInY));
      }
    }
    //TODO laser fields 
    return moves;
  }

  export function getSqares(direction: Direction, board: Board, origin: BoardVector2d): BoardVector2d[] {
    return getSquaresFromTuple(Direction.toTuple(direction), board, origin);
  }
}