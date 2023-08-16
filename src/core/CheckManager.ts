import { Board } from "core/board.js";
import { MovesPredictionsType } from "core/tile.js";
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
    return !this.board.getTile(position)?.isPieceMovesEmpty(playerId, MovesPredictionsType.Capturable);
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

  }

  public canPlayerMove(playerId: number): boolean {
    const king: KingPiece = this.board.getPiecesOfType(playerId, PieceType.KING)[0] as KingPiece;

    // Can king move

    for (let move of king.movement.legalMoves) {
      if (!this.isCheckAt(move, king.playerId)) {
        return true;
      }
    }

    const protectors: Piece[] = this.board.getKingProtectors(playerId);


  }
}