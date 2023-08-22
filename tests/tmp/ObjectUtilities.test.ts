
import { MoveType, Move, Board, SendableMove } from "@lc/core";
import { Rotation } from "@lc/geometry";
import { BoardVector2d } from "@lc/geometry";
import { King } from "@lc/pieces";
import { ObjectsUtilities } from "@lc/utils";

describe("Vector2d", () => {
  let m: Move = {
    origin: new BoardVector2d(1, 1),
    destination: new BoardVector2d(1, 1),
    moveType: MoveType.Capture,
    rotation: Rotation.Clockwise,
    promotedTo: null,
    piece: new King(new BoardVector2d(1, 1), 0, new Board(5, 5)),
    captured: null
  } 
  
  let m2: SendableMove = {
    origin: new BoardVector2d(1, 1),
    destination: new BoardVector2d(1, 1),
    moveType: MoveType.Capture,
    rotation: Rotation.Clockwise,
    promotedTo: null
  }
  console.log(Object.keys({} as SendableMove));
  test("Vector's toString()", () => {
    expect(ObjectsUtilities.extractSubtype<SendableMove>(m2)(m)).toStrictEqual(m2);
  });
}
)