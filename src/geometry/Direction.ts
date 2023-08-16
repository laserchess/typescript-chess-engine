import { BoardVector2d } from "geometry";

export enum Direction {
  LeftRank            = 0,
  UpperLeftDiagonal   = 1,
  UpperFile           = 2,
  UpperRightDiagonal  = 3,
  RightRank           = 4,
  BottomRightDiagonal = 5,
  BottomFile          = 6,
  BottomLeftDiagonal  = 7
}

export const enum Rotation {
  Clockwise           = 0,
  Anticlockwise       = 1
}

export namespace Direction {

  export function turnLeft(direction: Direction): Direction {
    return (direction.valueOf() + 7) % 8 as Direction;
  }

  export function turnRight(direction: Direction): Direction {
    return (direction.valueOf() + 1) % 8 as Direction;
  }

  export function turnDoubleLeft(direction: Direction): Direction {
    return turnLeft(turnLeft(direction)) as Direction;
  }

  export function turnDoubleRight(direction: Direction): Direction {
    return turnRight(turnRight(direction)) as Direction;
  }

  export function turnByStep(direction: Direction, turnNumber: number): Direction {
    if (turnNumber > 0) {
      return (direction.valueOf() + turnNumber) % 8 as Direction;
    }
    else if (turnNumber < 0) {
      let turnsLeft = Math.abs(turnNumber) - direction.valueOf();
      if (turnsLeft < 0) {
        return Math.abs(turnsLeft);
      }
      return 7 - (turnsLeft % 8) as Direction;
    }
  }

  export function createFrom(coordinates: BoardVector2d | [number, number]): Direction {
    if (coordinates instanceof BoardVector2d) {
      coordinates = coordinates.toTuple();
    }
    switch (coordinates.join(", ")) {
      case "-1, 0":
        return Direction.LeftRank;
      case "1, 0":
        return Direction.RightRank;
      case "0, 1":
        return Direction.UpperFile;
      case "0, -1":
        return Direction.BottomFile;
      case "-1, 1":
        return Direction.UpperLeftDiagonal;
      case "1, 1":
        return Direction.UpperRightDiagonal;
      case "1, -1":
        return Direction.BottomRightDiagonal;
      case "-1, -1":
        return Direction.BottomLeftDiagonal;
      default:
        throw new Error("Wrong value of vector")
    }
  }


  export function toTuple(direction: Direction): [number, number] {
    switch (direction) {
      case Direction.LeftRank:
        return [-1, 0]
      case Direction.RightRank:
        return [1, 0]
      case Direction.UpperFile:
        return [0, 1]
      case Direction.BottomFile:
        return [0, -1]
      case Direction.UpperLeftDiagonal:
        return [-1, 1]
      case Direction.UpperRightDiagonal:
        return [1, 1]
      case Direction.BottomRightDiagonal:
        return [1, -1]
      case Direction.BottomLeftDiagonal:
        return [-1, -1]
    }
  }

  export function toBoardVector2d(direction: Direction): BoardVector2d {
    switch (direction) {
      case Direction.LeftRank:
        return new BoardVector2d(-1, 0);
      case Direction.RightRank:
        return new BoardVector2d(1, 0)
      case Direction.UpperFile:
        return new BoardVector2d(0, 1)
      case Direction.BottomFile:
        return new BoardVector2d(0, -1)
      case Direction.UpperLeftDiagonal:
        return new BoardVector2d(-1, 1)
      case Direction.UpperRightDiagonal:
        return new BoardVector2d(1, 1)
      case Direction.BottomRightDiagonal:
        return new BoardVector2d(1, -1)
      case Direction.BottomLeftDiagonal:
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