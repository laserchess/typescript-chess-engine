import { describe, expect, test } from "@jest/globals";
import { IntVector2d, Vector2d, BoardVector2d, Symmetry } from "geometry";
import { int, Integer } from "utils";

describe("Vector2d", () => {

  test("Vector's toString()", () => {
    expect(new Vector2d(1, 1).toString()).toStrictEqual("1, 1");
  });

  test("Adding/substracting 2 vectors", () => {
    expect(new Vector2d(1, 1).add(new Vector2d(2, 2))).toStrictEqual(new Vector2d(3, 3));
    expect(new Vector2d(1, 1.5).sub(new Vector2d(2, 2))).toStrictEqual(new Vector2d(-1, -0.5));
  });

  test("Equality", () => {
    expect(new Vector2d(1.2, 1)).toStrictEqual(new Vector2d(1.2, 1));
    expect(new Vector2d(1, 10)).not.toStrictEqual(new Vector2d(1, 1));
    expect(new Vector2d(1, 1)).not.toStrictEqual(new BoardVector2d(1 as int, 1 as int));
  });

  test("Multiplying/dividing 2 vectors", () => {
    expect(new Vector2d(1, 2).mul(new Vector2d(2, 1.5))).toStrictEqual(new Vector2d(2, 3));
    expect(new Vector2d(1, 2).div(new Vector2d(2, 2))).toStrictEqual(new Vector2d(0.5, 1));
  });

  test("Multiplying/dividing vector and scalar", () => {
    expect(new Vector2d(1, 1).mul(3.5)).toStrictEqual(new Vector2d(3.5, 3.5));
    expect(new Vector2d(5, 2).div(2)).toStrictEqual(new Vector2d(2.5, 1));
  });

  test("Opposite, reverseAxis, pivotSymmettry", () => {
    expect(new Vector2d(1, 1).opposite()).toStrictEqual(new Vector2d(-1, -1));
    expect(new Vector2d(1.5, 2).reverseAxis()).toStrictEqual(new Vector2d(2, 1.5));

    expect(new Vector2d(1, 1).pivotSymmetry(Symmetry.ORIGIN)).toStrictEqual(new Vector2d(-1, -1));
    expect(new Vector2d(1, 1).pivotSymmetry(Symmetry.X_AXIS)).toStrictEqual(new Vector2d(1, -1));
    expect(new Vector2d(1, 1).pivotSymmetry(Symmetry.Y_AXIS)).toStrictEqual(new Vector2d(-1, 1));
  });

  test("Copy vector", () => {
    expect(new Vector2d(1, 1).copy()).toStrictEqual(new Vector2d(1, 1));
    expect(new Vector2d(1.5, 2).copy()).not.toStrictEqual(new Vector2d(1, 2));
  });


})

describe("IntVector2d", () => {
  test("Creating vector", () => {
    expect(new IntVector2d(1 as int, 3 as int)).toStrictEqual(new IntVector2d(1 as int, 3 as int));
    expect(new IntVector2d(2 as int, 3 as int)).not.toStrictEqual((new IntVector2d(2 as int, 2.9 as int)));
  });

  test("Equality", () => {
    expect(new IntVector2d(1 as int, 1 as int)).toStrictEqual(new IntVector2d(1 as int, 1 as int));
    expect(new IntVector2d(1 as int, 10 as int)).not.toStrictEqual(new IntVector2d(1 as int, 1 as int));
    expect(new IntVector2d(1 as int, 1 as int)).not.toStrictEqual(new BoardVector2d(1 as int, 1 as int));
  });

  test("Multiplying/dividing 2 vectors", () => {
    expect(new IntVector2d(1 as int, 3 as int).mul(new IntVector2d(2 as int, 2 as int))).toStrictEqual(new IntVector2d(2 as int, 6 as int));
    expect(new IntVector2d(1 as int, 2 as int).div(new IntVector2d(2 as int, 2 as int))).toStrictEqual(new IntVector2d(0 as int, 1 as int));
    expect(new IntVector2d(7 as int, 2 as int).div(new IntVector2d(3 as int, 2 as int))).toStrictEqual(new IntVector2d(2 as int, 1 as int));
  });

  test("Multiplying/dividing vector and scalar", () => {
    expect(new IntVector2d(1 as int, 1 as int).mul(3.5)).toStrictEqual(new IntVector2d(3 as int, 3 as int));
    expect(new IntVector2d(5 as int, 2 as int).div(2)).toStrictEqual(new IntVector2d(2 as int, 1 as int));
  });

  test("Copy vector", () => {
    expect(new IntVector2d(1 as int, 1 as int).copy()).toStrictEqual(new IntVector2d(1 as int, 1 as int));
    expect(new IntVector2d(1.5 as int, 2 as int).copy()).toStrictEqual(new IntVector2d(1 as int, 2 as int));
  });

})

describe("BoardVector2d", () => {
  test("Creating BoardVector2d from other type vectors", () => {
    expect(BoardVector2d.fromVector2d(new Vector2d(1.5 as int, 3 as int))).toStrictEqual(new BoardVector2d(1 as int, 3 as int));
    expect(BoardVector2d.fromVector2d(new IntVector2d(4 as int, 1 as int))).toStrictEqual(new BoardVector2d(4 as int, 1 as int));
  });

  test("Equality", () => {
    expect(new BoardVector2d(1 as int, 1 as int)).toStrictEqual(new BoardVector2d(1 as int, 1 as int));
    expect(new BoardVector2d(1 as int, 10 as int)).not.toStrictEqual(new BoardVector2d(1 as int, 1 as int));
    expect(new BoardVector2d(1 as int, 1 as int)).not.toStrictEqual(new IntVector2d(1 as int, 1 as int));
  });


  test("ToString functions", () => {
    expect(new BoardVector2d(1 as int, 3 as int).xToString()).toStrictEqual("b");
    expect(new BoardVector2d(1 as int, 3 as int).yToString()).toStrictEqual("4");
    expect(new BoardVector2d(1 as int, 3 as int).toString()).toStrictEqual("b4");
  });


  test("Copy vector", () => {
    expect(new BoardVector2d(1 as int, 1 as int).copy()).toStrictEqual(new BoardVector2d(1 as int, 1 as int));
    expect(new BoardVector2d(1 as int, 2 as int).copy()).toStrictEqual(new BoardVector2d(1 as int, 2 as int));
  });

})