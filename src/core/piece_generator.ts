import { 
  PieceType,
  Piece, 
  King, 
  Queen, 
  Knight, 
  Mirror, 
  Pawn, 
  Bishop, 
  Rook } from "@lc/pieces";
import { BoardVector2d, Direction } from "@lc/geometry";
import { Board } from "@lc/core";

export interface StandardPieceData {
  position: BoardVector2d,
  playerId: number,
  board: Board
}

export interface DirectedPieceData extends StandardPieceData {
  direction: Direction,
}

export interface PawnPieceData extends DirectedPieceData {
  enPassantPosition: BoardVector2d,
  promotionPosition: BoardVector2d
}

export function createStandardPiece(pieceData: StandardPieceData, type: PieceType): Piece {
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
    throw new Error("Unable to create this type of piece using PieceGenerator.createStandardPiece.")
  }

  export function createMirror(pieceData: DirectedPieceData): Mirror {
    const piece: Mirror = new Mirror(pieceData.position, pieceData.playerId, pieceData.board);
    piece.direction = pieceData.direction;
    return piece;
  }

  export function createPawn(pieceData: PawnPieceData): Pawn {
    const piece: Pawn = new Pawn(pieceData.position, pieceData.playerId, pieceData.board);
    piece.direction = pieceData.direction;
    piece.enPassantPosition = pieceData.enPassantPosition;
    piece.promotionPosition = pieceData.promotionPosition;
    return piece;
  }
  
