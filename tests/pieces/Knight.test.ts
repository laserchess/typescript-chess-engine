import { Board, Generator, Move, MoveType, Player } from "@lc/core"
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

    const move: Move = {
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
      destination: new BoardVector2d(5, 5),
      moveType: MoveType.Move | MoveType.Capture
    } as Move;
    knigth1.move(move);

    expect(knigth1.position).toStrictEqual(new BoardVector2d(5, 5));
    expect(knigth1.moveCount).toStrictEqual(2);

    move = {
      destination: new BoardVector2d(5, 5),
      moveType: MoveType.RangedCapture
    } as Move;
    knigth1.move(move);
    expect(knigth1.position).toStrictEqual(new BoardVector2d(5, 5));
    expect(knigth1.moveCount).toStrictEqual(3);
  })

  describe("Knight movement", () => {
    describe("updateMoves", () => {
      const data: Generator.StandardPieceData = {
        position: new BoardVector2d(4, 4),
        playerId: Player.White,
        board: board
      }

      const knigthMovementTest = Generator.createStandardPiece(data, PieceType.KNIGHT);

      test("No other pieces", () => {
        const moves: Set<Partial<Move>> = new Set(
          [
            { destination: new BoardVector2d(3, 2), moveType: MoveType.Move },
            { destination: new BoardVector2d(2, 3), moveType: MoveType.Move },
            { destination: new BoardVector2d(3, 6), moveType: MoveType.Move },
            { destination: new BoardVector2d(2, 5), moveType: MoveType.Move },
            { destination: new BoardVector2d(5, 2), moveType: MoveType.Move },
            { destination: new BoardVector2d(6, 3), moveType: MoveType.Move },
            { destination: new BoardVector2d(5, 6), moveType: MoveType.Move },
            { destination: new BoardVector2d(6, 5), moveType: MoveType.Move },
          ]
        )
        knigthMovementTest.movement.updateMoves();
        for (const move of moves) {
          expect(knigthMovementTest.movement.legalMoves).toContainEqual(move);
        }
        for (const move of moves) {
          move.moveType = MoveType.RangedCapture
          expect(knigthMovementTest.movement.illegalMoves).toContainEqual(move);
        }
      })

      test("Enemy and friendly piece", () => {
        const friendly = Generator.createStandardPiece({
          position: new BoardVector2d(3, 2),
          playerId: Player.White,
          board: board
        }, PieceType.KNIGHT);
        const enemy = Generator.createStandardPiece({
          position: new BoardVector2d(2, 3),
          playerId: Player.Black,
          board: board
        }, PieceType.KNIGHT);

        board.addPieces([friendly, enemy]);
        knigthMovementTest.movement.updateMoves();


        expect(knigthMovementTest.movement.illegalMoves).toContainEqual({ destination: new BoardVector2d(3, 2), moveType: MoveType.Move },);
        expect(knigthMovementTest.movement.legalMoves).toContainEqual({ destination: new BoardVector2d(2, 3), moveType: MoveType.Move | MoveType.Capture },);
        expect(knigthMovementTest.movement.legalMoves).toContainEqual({ destination: new BoardVector2d(2, 3), moveType: MoveType.RangedCapture },);

      })

    }

    )
  })

})


