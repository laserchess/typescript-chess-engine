import { BoardVector2d, Direction } from "@lc/geometry";

export function rotate(direction: Direction, steps: number): Direction {
  if (steps >= 0) {
    return (direction + steps) % Direction.Last as Direction;
  }
  else {
    const notNormalizedDirection = (direction + steps) % Direction.Last;
    const normalizedDirection = Direction.Last - notNormalizedDirection;
    return normalizedDirection;
  }
}

export function rotateClockwise(direction: Direction): Direction {
  return rotate(direction, 1);
}

export function rotateAnticlockwise(direction: Direction): Direction {
  return rotate(direction, -1);
}

export function rotateDoubleClockwise(direction: Direction): Direction {
  return rotate(direction, 2);
}

export function rotateDoubleAnticlockwise(direction: Direction): Direction {
  return rotate(direction, -2);
}

export function fromCoords(coordinates: BoardVector2d | [number, number]): Direction {
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
      throw new Error(`Invalid coordinates '${coordinates}'`);
  }
}

export function toTuple(direction: Direction): [number, number] {
  switch (direction) {
    case Direction.LeftRank:
      return [-1, 0];
    case Direction.RightRank:
      return [1, 0];
    case Direction.UpperFile:
      return [0, 1];
    case Direction.BottomFile:
      return [0, -1];
    case Direction.UpperLeftDiagonal:
      return [-1, 1];
    case Direction.UpperRightDiagonal:
      return [1, 1];
    case Direction.BottomRightDiagonal:
      return [1, -1];
    case Direction.BottomLeftDiagonal:
      return [-1, -1];
    default:
      throw new Error("Invalid direction");
  }
}

export function toBoardVector2d(direction: Direction): BoardVector2d {
  switch (direction) {
    case Direction.LeftRank:
      return new BoardVector2d(-1, 0);
    case Direction.RightRank:
      return new BoardVector2d(1, 0);
    case Direction.UpperFile:
      return new BoardVector2d(0, 1);
    case Direction.BottomFile:
      return new BoardVector2d(0, -1);
    case Direction.UpperLeftDiagonal:
      return new BoardVector2d(-1, 1);
    case Direction.UpperRightDiagonal:
      return new BoardVector2d(1, 1);
    case Direction.BottomRightDiagonal:
      return new BoardVector2d(1, -1);
    case Direction.BottomLeftDiagonal:
      return new BoardVector2d(-1, -1);
    default:
      throw new Error("Invalid direction");
  }
}
