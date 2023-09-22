import { BoardVector2d, Direction, DirectionUtils } from "@lc/geometry";

describe("DirectionUtils", () => {
  test("rotate", () => {
    expect(DirectionUtils.rotate(Direction.LeftRank, 3)).toBe(Direction.UpperRightDiagonal);
    expect(DirectionUtils.rotate(Direction.UpperFile, -3)).toBe(Direction.BottomLeftDiagonal);
    expect(DirectionUtils.rotate(Direction.UpperFile, 20)).toBe(Direction.BottomFile);
  })
  test("rotateClockwise", () => {
    expect(DirectionUtils.rotateClockwise(Direction.LeftRank)).toBe(Direction.UpperLeftDiagonal);
  })
  test("rotateAnticlockwise", () => {
    expect(DirectionUtils.rotateAnticlockwise(Direction.LeftRank)).toBe(Direction.BottomLeftDiagonal);
  })
  test("rotateDoubleClockwise", () => {
    expect(DirectionUtils.rotateDoubleClockwise(Direction.LeftRank)).toBe(Direction.UpperFile);
  })
  test("rotateDoubleAnticlockwise", () => {
    expect(DirectionUtils.rotateDoubleAnticlockwise(Direction.LeftRank)).toBe(Direction.BottomFile);
  })
  test("formCoordinates", () => {
    const coordinates: [[number, number], Direction][] = [
      [[-1, 0], Direction.LeftRank],
      [[1, 0], Direction.RightRank],
      [[0, 1], Direction.UpperFile],
      [[0, -1], Direction.BottomFile],
      [[-1, 1], Direction.UpperLeftDiagonal],
      [[1, 1], Direction.UpperRightDiagonal],
      [[1, -1], Direction.BottomRightDiagonal],
      [[-1, -1], Direction.BottomLeftDiagonal]
    ]
    for (const corresponding of coordinates) {
      expect(DirectionUtils.fromCoordinates(corresponding[0])).toBe(corresponding[1]);
    }
  })
  test("toTuple", () => {
    const coordinates: [[number, number], Direction][] = [
      [[-1, 0], Direction.LeftRank],
      [[1, 0], Direction.RightRank],
      [[0, 1], Direction.UpperFile],
      [[0, -1], Direction.BottomFile],
      [[-1, 1], Direction.UpperLeftDiagonal],
      [[1, 1], Direction.UpperRightDiagonal],
      [[1, -1], Direction.BottomRightDiagonal],
      [[-1, -1], Direction.BottomLeftDiagonal]
    ]
    for (const corresponding of coordinates) {
      expect(DirectionUtils.toTuple(corresponding[1])).toStrictEqual(corresponding[0]);
    }
  })
  test("toBoardVector2d", () => {
    const coordinates: Direction[] = [
      Direction.LeftRank,
      Direction.RightRank,
      Direction.UpperFile,
      Direction.BottomFile,
      Direction.UpperLeftDiagonal,
      Direction.UpperRightDiagonal,
      Direction.BottomRightDiagonal,
      Direction.BottomLeftDiagonal
    ]

    for (const corresponding of coordinates) {
      expect(DirectionUtils.toBoardVector2d(corresponding)).toStrictEqual(BoardVector2d.fromTuple(DirectionUtils.toTuple(corresponding)));
    }
  })
});