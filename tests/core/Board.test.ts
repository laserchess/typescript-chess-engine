import { Generator, Player } from "@lc/core";
import { Board } from "@lc/core"
import { BoardVector2d } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";


describe("Board", () => {
  const size = 8;
  const board = new Board(size, size);
  const types = [
    PieceType.BISHOP,
    PieceType.KING,
    PieceType.KNIGHT,
    PieceType.QUEEN,
    PieceType.ROOK
  ]
  const both = [new Set<Piece>, new Set<Piece>];
  const ofType = new Map<PieceType, Set<Piece>>();
  const all: Piece[] = [];
  for (const type of types) {
    ofType.set(type, new Set<Piece>);
  }
  for (let i = 0; i < size; i++) {
    const piece = Generator.createStandardPiece(
      {
        playerId: i % 2,
        board: board,
        position: new BoardVector2d(i, i)
      },
      types[i % 5]
    )
    both[piece.playerId].add(piece);
    ofType.get(piece.type)!.add(piece);
    board.addPiece(piece);
    all.push(piece);
  }
  test("getPiecesOfPlayer", () => {
    expect(board.getPiecesOfPlayer(Player.Black).size).toBe(4);
    expect(board.getPiecesOfPlayer(Player.White).size).toBe(4);
  })
  test("getPiece", () => {
    expect(board.getPiece(new BoardVector2d(0, 0))).toStrictEqual(all[0]);
    expect(board.getPiece(new BoardVector2d(1, 2))).toBe(null);
  })
  test("getPiecesOfType", () => {
    expect(board.getPiecesOfType(Player.White,PieceType.BISHOP).size).toBe(1);
    expect(board.getPiecesOfType(Player.White,PieceType.PAWN).size).toBe(0);
  })
  test("isOutOfBounds", () => {
    expect(board.isOutOfBounds(new BoardVector2d(7, 10))).toBeTruthy();
    expect(board.isOutOfBounds(new BoardVector2d(0, 0))).toBeFalsy();
    expect(board.isOutOfBounds(new BoardVector2d(5, 5))).toBeFalsy();
  })
  test("isPieceAt", () => {
    expect(board.isPieceAt(new BoardVector2d(1, 1))).toBeTruthy();
    expect(board.isPieceAt(new BoardVector2d(1, 0))).toBeFalsy();
  })
  test("addPiece",() => {
    const queen = Generator.createStandardPiece(
      {
        playerId: Player.White,
        position: new BoardVector2d(1, 1),
        board: board
      },
      PieceType.QUEEN
    )
    expect(() => (board.addPiece(queen))).toThrow();
    queen.position = new BoardVector2d(5, 2);
    board.addPiece(queen);
    expect(board.isPieceAt(queen.position)).toBeTruthy()
  })
  test("addPieces",() => {
    const queen = Generator.createStandardPiece(
      {
        playerId: Player.White,
        position: new BoardVector2d(6, 3),
        board: board
      },
      PieceType.QUEEN
    )
    const knight = Generator.createStandardPiece(
      {
        playerId: Player.Black,
        position: new BoardVector2d(2, 3),
        board: board
      },
      PieceType.KNIGHT
    )
    board.addPieces([queen, knight]);
    expect(board.isPieceAt(queen.position)).toBeTruthy();
    expect(board.isPieceAt(knight.position)).toBeTruthy()
  })
  test("removePiece",() => {
    const knight = Generator.createStandardPiece(
      {
        playerId: Player.Black,
        position: new BoardVector2d(5, 7),
        board: board
      },
      PieceType.KNIGHT
    )
    board.addPiece(knight);
    board.removePiece(knight);
    expect(board.isPieceAt(knight.position)).toBeFalsy();
  })
  test("shiftPiece",() => {
    const knight = Generator.createStandardPiece(
      {
        playerId: Player.Black,
        position: new BoardVector2d(1, 7),
        board: board
      },
      PieceType.KNIGHT
    )
    board.addPiece(knight)
    expect(() => (board.shiftPiece(new BoardVector2d(1, 7), new BoardVector2d(6, 6)))).toThrow();
    expect(() => (board.shiftPiece(new BoardVector2d(5, 0), new BoardVector2d(4, 5)))).toThrow();
    board.shiftPiece(new BoardVector2d(1, 7), new BoardVector2d(2, 6));
    expect(board.isPieceAt(new BoardVector2d(1, 7))).toBeFalsy();
    expect(board.isPieceAt(new BoardVector2d(2, 6))).toBeTruthy();
  })
})