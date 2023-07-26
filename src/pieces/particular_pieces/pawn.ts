import { BoardVector2d } from "geometry";
import { DirectedPiece, PieceOpitons, PieceMovement, PieceType } from "pieces"

export class PawnPiece extends DirectedPiece {
  public constructor(position: BoardVector2d, playerId: number, board: Board){
    let options: PieceOpitons =
    {
      pieceType: PieceType.PAWN,
      movement: new PawnMovement(board)
    } 
    super(position, playerId, board, options);
  }
}

export class PawnMovement extends PieceMovement {

}