import { IntVector2d, Vector2d, BoardVector2d, Symmetry } from "@lc/geometry";
import { Board } from "@lc/core";

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
    expect(new Vector2d(1, 1)).not.toStrictEqual(new BoardVector2d(1, 1));
  });

  test("Multiplying/dividing 2 vectors", () => {
    expect(new Vector2d(1, 2).mul(new Vector2d(2, 1.5))).toStrictEqual(new Vector2d(2, 3));
    expect(new Vector2d(1, 2).div(new Vector2d(2, 2))).toStrictEqual(new Vector2d(0.5, 1));
    expect(() => {
      new Vector2d(1, 2).div(new Vector2d(2, 0))
    }).toThrow(Error);
  });

  test("Multiplying/dividing vector and scalar", () => {
    expect(new Vector2d(1, 1).mul(3.5)).toStrictEqual(new Vector2d(3.5, 3.5));
    expect(new Vector2d(5, 2).div(2)).toStrictEqual(new Vector2d(2.5, 1));
    expect(() => {
      new Vector2d(1, 2).div(0)
    }).toThrow(Error);
  });

  test("Opposite, reverseAxis, pivotSymmettry", () => {
    expect(new Vector2d(1, 1).opposite()).toStrictEqual(new Vector2d(-1, -1));
    expect(new Vector2d(1.5, 2).reverseAxis()).toStrictEqual(new Vector2d(2, 1.5));
    expect(new Vector2d(1, 1).applySymmetry(Symmetry.Origin)).toStrictEqual(new Vector2d(-1, -1));
    expect(new Vector2d(1, 1).applySymmetry(Symmetry.XAxis)).toStrictEqual(new Vector2d(1, -1));
    expect(new Vector2d(1, 1).applySymmetry(Symmetry.YAxis)).toStrictEqual(new Vector2d(-1, 1));
  });

  test("Copy vector", () => {
    expect(new Vector2d(1, 1).copy()).toStrictEqual(new Vector2d(1, 1));
    expect(new Vector2d(1.5, 2).copy()).not.toStrictEqual(new Vector2d(1, 2));
  });

  test("Length", () => {
    expect(new Vector2d(3, 4).getLength()).toStrictEqual(5);
  });

  test("Unit Vector", () => {
    expect(new Vector2d(3, 4).createUnitVector()).toStrictEqual(new Vector2d(0.6, 0.8));
  });



});

describe("IntVector2d", () => {
  test("Creating vector", () => {
    expect(new IntVector2d(1, 3)).toStrictEqual(new IntVector2d(1, 3));
    expect(new IntVector2d(2, 3)).not.toStrictEqual((new IntVector2d(2, 2.9)));
  });

  test("Equality", () => {
    expect(new IntVector2d(1, 1)).toStrictEqual(new IntVector2d(1, 1));
    expect(new IntVector2d(1, 10)).not.toStrictEqual(new IntVector2d(1, 1));
    expect(new IntVector2d(1, 1)).not.toStrictEqual(new BoardVector2d(1, 1));
  });

  test("Multiplying/dividing 2 vectors", () => {
    expect(new IntVector2d(1, 3).mul(new IntVector2d(2, 2))).toStrictEqual(new IntVector2d(2, 6));
    expect(new IntVector2d(1, 2).div(new IntVector2d(2, 2))).toStrictEqual(new IntVector2d(0, 1));
    expect(new IntVector2d(7, 2).div(new IntVector2d(3, 2))).toStrictEqual(new IntVector2d(2, 1));
  });

  test("Multiplying/dividing vector and scalar", () => {
    expect(new IntVector2d(1, 1).mul(3.5)).toStrictEqual(new IntVector2d(3, 3));
    expect(new IntVector2d(5, 2).div(2)).toStrictEqual(new IntVector2d(2, 1));
  });

  test("Copy vector", () => {
    expect(new IntVector2d(1, 1).copy()).toStrictEqual(new IntVector2d(1, 1));
    expect(new IntVector2d(1.5, 2).copy()).toStrictEqual(new IntVector2d(1, 2));
  });

  test("Unit Vector", () => {
    expect(new IntVector2d(3, 4).createUnitVector()).toStrictEqual(new IntVector2d(0, 1));
    expect(new IntVector2d(-6, 4).createUnitVector()).toStrictEqual(new IntVector2d(-1, 0));
    expect(new IntVector2d(3, 3).createUnitVector()).toStrictEqual(new IntVector2d(1, 0));
    expect(new IntVector2d(3, 3).createUnitVector(true)).toStrictEqual(new IntVector2d(0, 1));
  });
});

describe("BoardVector2d", () => {
  test("Creating BoardVector2d from other type vectors", () => {
    expect(BoardVector2d.fromVector2d(new Vector2d(1.5, 3))).toStrictEqual(new BoardVector2d(1, 3));
    expect(BoardVector2d.fromVector2d(new IntVector2d(4, 1))).toStrictEqual(new BoardVector2d(4, 1));
  });

  test("Equality", () => {
    expect(new BoardVector2d(1, 1)).toStrictEqual(new BoardVector2d(1, 1));
    expect(new BoardVector2d(1, 10)).not.toStrictEqual(new BoardVector2d(1, 1));
    expect(new BoardVector2d(1, 1)).not.toStrictEqual(new IntVector2d(1, 1));
  });


  test("toString functions", () => {
    expect(new BoardVector2d(1, 3).xToString()).toStrictEqual("b");
    expect(new BoardVector2d(1, 3).yToString()).toStrictEqual("4");
    expect(new BoardVector2d(1, 3).toString()).toStrictEqual("b4");
  });


  test("Copy vector", () => {
    expect(new BoardVector2d(1, 1).copy()).toStrictEqual(new BoardVector2d(1, 1));
    expect(new BoardVector2d(1, 2).copy()).toStrictEqual(new BoardVector2d(1, 2));
  });

  test("Getting moves", () => {
    // vi.mock('@lc/core', () => {
    //   const Board = vi.fn();
    //   Board.prototype.width = 8;
    //   Board.prototype.height = 8;
    //   return {Board};
    // })
    // const board: Board = new Board();
    const board: Board = new Board(8,8)
    let vector: BoardVector2d = new BoardVector2d(7,7);
    expect(vector.getDirectedMoveFromTuple([1,1],board)).toStrictEqual([new BoardVector2d(7,7)]);
    vector = new BoardVector2d(2,4);
    expect(vector.getDirectedMoveFromTuple([-1,1],board)).toStrictEqual([new BoardVector2d(2,4), new BoardVector2d(1,5),new BoardVector2d(0,6)]);
  })

});


describe("Different types vectors", () => {
  test("Creating BoardVector2d from other type vectors", () => {
    expect(new BoardVector2d(2,2).add(new Vector2d(2,2)).toString()).toStrictEqual(new BoardVector2d(4, 4).toString());
    expect(new Vector2d(2,2).add(new BoardVector2d(2,2)).toString()).toStrictEqual(new Vector2d(4, 4).toString());
  });
  
});