
import { Board } from "core/Board.js";
import { MovesPredictionsType, Tile } from "core/Tile.js";
import { Game } from "game.js";
import { BoardVector2d } from "geometry";
import { Piece, PieceType } from "pieces";
import { King } from "pieces/King.js";



export class CheckManager {
  public board: Board;
  
  public constructor(board: Board) {
    this.board = board;
  }

  public isCheckAt(position: BoardVector2d, playerId: number) {
    return !this.board.getTile(position)?.isPieceMovesEmpty(playerId, MovesPredictionsType.Capturable);
  }

  public getCheckingPieces(playerId: number): Set<Piece> {
    if (this.isKingDead(playerId)) {
      throw new Error("King is dead. Unable to get checking pieces of dead king.");
    }
    const king: King = this.board.getPiecesOfType(playerId, PieceType.KING)[0] as King;
    const tile: Tile = this.board.getTileOfPiece(king);
    return tile.getPieceMovesOfTile(playerId, MovesPredictionsType.Capturable);
  }

  public isKingUnderCheck(playerId: number): boolean {
    const enemyId: number = Game.getEnemyId(playerId);
    if (this.isKingDead(playerId)) {
      return false;
    }
    const position: BoardVector2d = this.board.getPiecesOfType(playerId, PieceType.KING)[0].position;
    return this.board.getTile(position)!.isPieceMovesEmpty(enemyId, MovesPredictionsType.Capturable);
  }

  public isKingDead(playerId: number): boolean {
    return this.board.getPiecesOfType(playerId, PieceType.KING).length === 0;
  }

  public canPieceMoveTo(piece: Piece, destination: BoardVector2d): boolean {
    const playerId: number = piece.playerId;
    if (this.isKingUnderCheck(playerId)) {
      if (piece instanceof King) {
        return !this.isCheckAt(destination, playerId);
      }
    }
    return false;
  }


}