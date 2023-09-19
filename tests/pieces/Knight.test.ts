import { Board, Generator, Move, Player } from "@lc/core"
import { BoardVector2d } from "@lc/geometry"
import { KnightMovement } from "@lc/pieces";
import { PieceType } from "@lc/pieces";

describe("Knight", () => {
  const board: Board = new Board(8, 8);
  const data: Generator.StandardPieceData = {
    position: new BoardVector2d(4, 0),
    playerId: Player.White,
    board: board
  }

  const knigth1 = Generator.createStandardPiece(data, PieceType.KNIGHT);
  // const knigth2 = Generator.createStandardPiece(data, PieceType.KNIGHT);

  test("type", () => {
    expect(knigth1.type).toBe(PieceType.KNIGHT);
  })

  test("movement", () => {
    expect(knigth1.movement).toBeInstanceOf(KnightMovement);
  })

  test("toString", () => {
    expect(knigth1.toString()).toBe("N");
  })

  test("wasMoved", () => {
    expect(knigth1.wasMoved()).toBeFalsy();

    let move: Move = {
      destination: new BoardVector2d(2, 2)
    } as Move;
    knigth1.move(move);

    expect(knigth1.wasMoved()).toBeTruthy();
  })

  test("isSameColor", () => {
    expect(knigth1.isSameColor(Player.Black)).toBeFalsy();
    expect(knigth1.isSameColor(Player.White)).toBeTruthy();
    
    const knigth2 = Generator.createStandardPiece(data, PieceType.KNIGHT);
    data.playerId = Player.Black;
    const knigth3 = Generator.createStandardPiece(data, PieceType.KNIGHT);
    
    expect(knigth1.isSameColor(knigth2)).toBeTruthy();
    expect(knigth1.isSameColor(knigth3)).toBeFalsy();
  })

  test("move", () => {
    let move: Move = {
      destination: new BoardVector2d(5, 5)
    } as Move;
    knigth1.move(move);
    
    expect(knigth1.position).toStrictEqual(new BoardVector2d(5, 5));
    expect(knigth1.moveCount).toStrictEqual(1);
  })

})


