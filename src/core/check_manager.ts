import { Board } from "core/board.js";
import { MovesPredictionsType, Tile } from "core/tile.js";
import { Game } from "game.js";
import { BoardVector2d } from "geometry";
import { Piece, PieceType } from "pieces";
import { KingPiece } from "pieces/particular_pieces/king.js";


export class CheckManager {
  public board: Board;
  
  public constructor(board: Board) {
    this.board = board;
  }

  public isCheckAt(position: BoardVector2d, playerId: number) {
    return !this.board.getTile(position)?.isPieceMovesEmpty(playerId, MovesPredictionsType.CAPTURABLE);
  }

  public getCheckingPieces(playerId: number): Set<Piece> {
    if (this.isKingDead(playerId)) {
      throw new Error("King is dead. Unable to get checking pieces of dead king.");
    }
    const king: KingPiece = this.board.getPiecesOfType(playerId, PieceType.KING)[0] as KingPiece;
    const tile: Tile = this.board.getTileOfPiece(king);
    return tile.getPieceMovesOfTile(playerId, MovesPredictionsType.CAPTURABLE);
  }

  public isKingUnderCheck(playerId: number): boolean {
    const enemyId: number = Game.getEnemyId(playerId);
    if (this.isKingDead(playerId)) {
      return false;
    }
    const position: BoardVector2d = this.board.getPiecesOfType(playerId, PieceType.KING)[0].position;
    return this.board.getTile(position)!.isPieceMovesEmpty(enemyId, MovesPredictionsType.CAPTURABLE);
  }

  public isKingDead(playerId: number): boolean {
    return this.board.getPiecesOfType(playerId, PieceType.KING).length === 0;
  }

  public canPieceMoveTo(piece: Piece, destination: BoardVector2d): boolean {
    const playerId: number = piece.playerId;
    if (this.isKingUnderCheck(playerId)) {
      if (piece instanceof KingPiece) {
        return !this.isCheckAt(destination, playerId);
      }
    }
  }


}