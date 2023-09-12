import { PieceType, Piece } from "pieces/Piece.js";
import { AbstractPieceFactory, StandardPieceData } from "./AbstractPieceFactory.js";
import { King } from "pieces/King.js";
import { Queen } from "pieces/Queen.js";
import { Knight } from "pieces/Knight.js";
import { BoardVector2d } from "geometry/Vector2d.js";
import { Board } from "core/Board.js";

export interface StandardPieceData {
  position: BoardVector2d,
  playerId: number,
  board: Board
}

export class StandardPieceFactory extends AbstractPieceFactory {
  public createPiece(pieceData: StandardPieceData, type: PieceType): Piece {
    switch(type) {
      case PieceType.KING:
        return new King(pieceData.position, pieceData.playerId, pieceData.board);
      case PieceType.QUEEN:
        return new Queen(pieceData.position, pieceData.playerId, pieceData.board);
      case PieceType.BISHOP:
        return new Bishop(pieceData.position, pieceData.playerId, pieceData.board);
      case PieceType.ROOK:
        return new Rook(pieceData.position, pieceData.playerId, pieceData.board);
      case PieceType.KNIGHT:
        return new Knight(pieceData.position, pieceData.playerId, pieceData.board);
    }
    throw new Error("Unable to create this type of piece using StandardPieceFactory.")
  }
  
}