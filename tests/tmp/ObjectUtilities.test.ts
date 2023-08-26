
import { describe, test, expect } from "@jest/globals";
import { ObjectUtilities } from "@lc/utils";

describe("ObjectUtilities tests", () => {
  test("ObjectUtilities.deepCopy", () => {
    const basicObject = {
      name: "Test object",
      id: 2137
    };
    expect(ObjectUtilities.deepCopy(basicObject)).toStrictEqual(basicObject);
    expect(ObjectUtilities.deepCopy(basicObject)).not.toBe(basicObject);

    const extendedObject = {
      name: "Test object",
      id: 2137,
      data: {
        timestamp: new Date(),
        values: [ 1, 2, 3, 4, 5 ],
        message: "Hi, I'm a test object!"
      }
    };
    expect(ObjectUtilities.deepCopy(extendedObject)).toStrictEqual(extendedObject);
    expect(ObjectUtilities.deepCopy(extendedObject)).not.toBe(extendedObject);
    // So shitty name.
    // let m: Move = {
    //   origin: new BoardVector2d(1, 1),
    //   destination: new BoardVector2d(1, 1),
    //   moveType: MoveType.Capture,
    //   rotation: Rotation.Clockwise,
    //   promotedTo: null,
    //   piece: new King(new BoardVector2d(1, 1), 0, new Board(5, 5)),
    //   captured: null
    // }
  });
});
