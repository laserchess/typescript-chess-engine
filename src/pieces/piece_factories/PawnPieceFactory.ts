import { Piece, PieceType } from "pieces/Piece.js";
import { StandardPieceData, StandardPieceFactory } from "./StandardPieceFactory.js";
import { Direction } from "geometry/Direction.js";
import { BoardVector2d } from "geometry/Vector2d.js";
import { Pawn } from "pieces/Pawn.js";

export interface PawnPieceData extends StandardPieceData{
  direction: Direction
  enPassantPosition: BoardVector2d,
  promotionPosition: BoardVector2d,
} 

export class PawnPieceFactory {
  public createPiece(pieceData: PawnPieceData): Piece {
    const pawn: Pawn = new Pawn(pieceData.position, pieceData.playerId, pieceData.board);
    pawn.direction = pieceData.direction;
    pawn.enPassantPosition = pieceData.enPassantPosition;
    pawn.promotionPosition = pieceData.promotionPosition;
    return pawn;
  }
}