import { Board, Generator } from "@lc/core"
import { BoardVector2d, Direction } from "@lc/geometry";
import { Bishop, King, Knight, Mirror, Pawn, Piece, Queen, Rook } from "@lc/pieces";
import { PieceType } from "@lc/pieces";




describe("PieceGenerator", () => {
  const board: Board = new Board(8, 8);
  
  test("createStandardPiece", () => {
    let data: Generator.StandardPieceData = {
      position: new BoardVector2d(1, 1),
      playerId: 0,
      board: board,
    }
    const constructors = [King, Queen, Bishop, Rook, Knight];
    let enumValues: PieceType[] = [PieceType.KING, PieceType.QUEEN, PieceType.BISHOP, PieceType.ROOK, PieceType.KNIGHT];
    for(let zip of constructors.map((e, i) => {return [e, enumValues[i]] as [any, PieceType]})) {
      expect(Generator.createStandardPiece(data, zip[1])).toStrictEqual(new zip[0](data.position,data.playerId,data.board));
    }
    enumValues = [PieceType.MIRROR, PieceType.PAWN];
    for(let single of enumValues) {
      expect(() => Generator.createStandardPiece(data, single)).toThrowError(Error);
    }
  }) 

  test("createMirror", () => {
    let data: Generator.DirectedPieceData = {
      position: new BoardVector2d(1, 1),
      playerId: 0,
      board: board,
      direction: Direction.BottomLeftDiagonal
    }
    const mirror: Mirror = new Mirror(data.position,data.playerId,data.board);
    mirror.direction = data.direction;
    expect(Generator.createMirror(data)).toStrictEqual(mirror);
  })

  test("createPawn", () => {
    let data: Generator.PawnPieceData = {
      position: new BoardVector2d(1, 1),
      playerId: 0,
      board: board,
      direction: Direction.UpperFile,
      enPassantPosition: new BoardVector2d(2, 3),
      promotionPosition: new BoardVector2d(5, 5)
    }
    const pawn: Pawn = new Pawn(data.position,data.playerId,data.board);
    pawn.direction = data.direction;
    pawn.enPassantPosition = data.enPassantPosition;
    pawn.promotionPosition = data.promotionPosition
    expect(Generator.createPawn(data)).toStrictEqual(pawn);
  })  
}
)