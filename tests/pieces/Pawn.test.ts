import { Board, Generator, Player } from "@lc/core"
import { Direction } from "geometry/Direction.js";
import { BoardVector2d } from "geometry/Vector2d.js"

describe("Pawn", () => {
  const board = new Board(8, 8);
  test("direction", () => {
    const pawn = Generator.createPawn(
      {
        position: new BoardVector2d(1, 1),
        playerId: Player.White,
        board: board,
        enPassantPosition: new BoardVector2d(1, 4),
        promotionPosition: new BoardVector2d(1, 7),
        direction: Direction.UpperFile
      }
    )
    pawn.direction = Direction.BottomFile;
    expect(pawn.direction).toBe(Direction.BottomFile);
    expect(() => pawn.direction = Direction.UpperLeftDiagonal).toThrow();
  })
  
  test("isOnEnPassantPosition", () => {
    const pawn = Generator.createPawn(
      {
        position: new BoardVector2d(1, 4),
        playerId: Player.White,
        board: board,
        enPassantPosition: new BoardVector2d(1, 4),
        promotionPosition: new BoardVector2d(1, 7),
        direction: Direction.UpperFile
      }
    )
    expect(pawn.isOnEnPassantPosition()).toBeTruthy();

    pawn.enPassantPosition = new BoardVector2d(1, 5);
    expect(pawn.isOnEnPassantPosition()).toBeFalsy();

    pawn.enPassantPosition = undefined as unknown as BoardVector2d;
    expect(() => pawn.enPassantPosition).toThrow()
  })

  test("isOnPromotionPosition", () => {
    const pawn = Generator.createPawn(
      {
        position: new BoardVector2d(1, 7),
        playerId: Player.White,
        board: board,
        enPassantPosition: new BoardVector2d(1, 4),
        promotionPosition: new BoardVector2d(1, 7),
        direction: Direction.UpperFile
      }
    )
    expect(pawn.isOnPromotionPosition()).toBeTruthy();

    pawn.position = new BoardVector2d(2, 7);
    expect(pawn.isOnPromotionPosition()).toBeTruthy();

    pawn.position = new BoardVector2d(2, 6);
    expect(pawn.isOnPromotionPosition()).toBeFalsy();

    pawn.promotionPosition = undefined as unknown as BoardVector2d;
    expect(() => pawn.promotionPosition).toThrow();
  })
  describe("movement", () => {
    describe("updateMoves", () => {
      
    })
  })
})