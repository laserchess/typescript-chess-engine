import { Board, Generator, Move, MoveType, Player } from "@lc/core"
import { Direction, Rotation } from "geometry/Direction.js";
import { BoardVector2d } from "geometry/Vector2d.js"
import { Mirror } from "pieces/Mirror.js";
import { PieceType } from "pieces/Piece.js";

describe("Mirror", () => {
  const board: Board = new Board(8, 8);

  test("direction", () => {
    const mirror: Mirror = Generator.createMirror(
      {
        position: new BoardVector2d(2, 3),
        playerId: Player.White,
        board: board,
        direction: Direction.BottomLeftDiagonal
      }
    )
    expect(mirror.direction).toBe(Direction.BottomLeftDiagonal);
    expect(() => {mirror.direction = Direction.BottomFile}).toThrow();
  })

  test("move", () => {
    const mirror: Mirror = Generator.createMirror(
      {
        position: new BoardVector2d(2, 3),
        playerId: Player.White,
        board: board,
        direction: Direction.BottomLeftDiagonal
      }
    )
    let move: Move = {
      moveType: MoveType.Rotation,
      rotation: Rotation.Anticlockwise
    } as Move

    mirror.move(move);
    expect(mirror.direction).toBe(Direction.BottomRightDiagonal);
    move.rotation = Rotation.Clockwise;
    mirror.move(move);
    expect(mirror.direction).toBe(Direction.BottomLeftDiagonal);

    move = {
      moveType: MoveType.Move,
      destination: new BoardVector2d(3, 4)
    } as Move;
    mirror.move(move);
    expect(mirror.position).toStrictEqual(new BoardVector2d(3, 4));
  })

  describe("movement", () => {
    describe("updateMoves", () => {
      test("No other pieces", () => {
        const mirror: Mirror = Generator.createMirror(
          {
            position: new BoardVector2d(3, 4),
            playerId: Player.White,
            board: board,
            direction: Direction.BottomLeftDiagonal
          }
        )
        mirror.movement.updateMoves();
        const moves: Set<Partial<Move>> = new Set(
          [
            {destination: new BoardVector2d(2, 3), moveType: MoveType.Move},
            {destination: new BoardVector2d(3, 3), moveType: MoveType.Move},
            {destination: new BoardVector2d(4, 3), moveType: MoveType.Move},
            {destination: new BoardVector2d(4, 4), moveType: MoveType.Move},
            {destination: new BoardVector2d(4, 5), moveType: MoveType.Move},
            {destination: new BoardVector2d(3, 5), moveType: MoveType.Move},
            {destination: new BoardVector2d(2, 5), moveType: MoveType.Move},
            {destination: new BoardVector2d(2, 4), moveType: MoveType.Move},
            {rotation: Rotation.Clockwise},
            {rotation: Rotation.Anticlockwise}
          ]
        )
        for (const move of moves) {
          expect(mirror.movement.legalMoves).toContainEqual(move)
        }
      })
      test("Enemy/Friendly", () => {
        const mirror: Mirror = Generator.createMirror(
          {
            position: new BoardVector2d(3, 4),
            playerId: Player.White,
            board: board,
            direction: Direction.BottomLeftDiagonal
          }
        )
        const friend = Generator.createStandardPiece(
          {
            position: new BoardVector2d(2, 3),
            playerId: Player.White,
            board: board,
          },
          PieceType.KNIGHT
        )
        const enemy = Generator.createStandardPiece(
          {
            position: new BoardVector2d(3, 3),
            playerId: Player.Black,
            board: board,
          },
          PieceType.KNIGHT
        )
        board.addPieces([friend, enemy]);
        mirror.movement.updateMoves();
        let m1 = {destination: new BoardVector2d(2, 3), moveType: MoveType.Move}
        let m2 = {destination: new BoardVector2d(3, 3), moveType: MoveType.Move | MoveType.Capture}
        expect(mirror.movement.illegalMoves).toContainEqual(m1);
        expect(mirror.movement.illegalMoves).toContainEqual(m2);
      })
    })
  })
})