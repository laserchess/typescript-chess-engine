import { Board, Generator, MovesPredictionsType, Tile } from "@lc/core"
import { Player } from "@lc/core"
import { BoardVector2d } from "geometry/Vector2d.js"
import { King, PieceType, Queen } from "@lc/pieces"

describe("Tile", () => {
  const board: Board = new Board(8, 8);

  const data: Generator.StandardPieceData = {
    position: new BoardVector2d(2, 2),
    playerId: Player.White,
    board: board
  }
  const piece1: King = Generator.createStandardPiece(data, PieceType.KING) as King;

  data.playerId = Player.Black
  const piece2: Queen = Generator.createStandardPiece(data, PieceType.QUEEN) as Queen;

  const tile = new Tile(new BoardVector2d(2, 2));

  test("addPieceMovesToTile", () => {
    tile.addPieceMovesToTile(piece1, MovesPredictionsType.Illegal);
    expect(tile.checkIfPieceMovesInTile(piece1, MovesPredictionsType.Illegal)).toBe(true);
    expect(tile.checkIfPieceMovesInTile(piece1, MovesPredictionsType.Legal)).toBe(false);
  })

  test("removePieceMovesFromTile", () => {
    tile.addPieceMovesToTile(piece2, MovesPredictionsType.Legal);
    tile.removePieceMovesFromTile(piece1, MovesPredictionsType.Illegal);
    expect(tile.checkIfPieceMovesInTile(piece1, MovesPredictionsType.Illegal)).toBe(false);
    expect(tile.checkIfPieceMovesInTile(piece2, MovesPredictionsType.Legal)).toBe(true);
  })

  test("isPieceMovesEmpty", () => {
    expect(tile.isPieceMovesEmpty(piece2.playerId, MovesPredictionsType.Legal)).toBe(false);
    expect(tile.isPieceMovesEmpty(piece2.playerId, MovesPredictionsType.Illegal)).toBe(true);
  })

  test("getPieceMovesOfTile", () => {
    expect(tile.getPieceMovesOfTile(piece2.playerId, MovesPredictionsType.Illegal | MovesPredictionsType.Legal).size).toBe(1)
  })

  test("clearAllPredictions", () => {
    tile.addPieceMovesToTile(piece1, MovesPredictionsType.Illegal);
    tile.clearAllPredictions();
    expect(tile.getPieceMovesOfTile(piece1.playerId, MovesPredictionsType.Illegal | MovesPredictionsType.Legal).size).toBe(0);
  })
})