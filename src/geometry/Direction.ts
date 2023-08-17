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
      const turnsLeft = Math.abs(turnNumber) - direction.valueOf();
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
}