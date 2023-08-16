import { BoardVector2d, Symmetry } from "geometry";
import { Piece, PieceMovement, PieceOpitons, PieceType } from "pieces";

export class KnightPiece extends Piece {
  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    let options: PieceOpitons =
    {
      pieceType: PieceType.KNIGHT,
      movement: new KnightMovement(board)
    }
    super(position, playerId, board, options);
    this.movement.piece = this;
  }

  public rangedCapture(destination: BoardVector2d) {
    this._position = destination;
    this.moveCounter += 1;
    this.board.notifyRangedCapture(this, destination);
  }
}

export class KnightMovement extends PieceMovement {
  public updateMoves(): void {
    const piece: KnightPiece = this._piece as KnightPiece;
    const board: Board = this.board;
    const baseVectors: BoardVector2d[] = [new BoardVector2d(1, 2), new BoardVector2d(2, 1)];
    const symmetries: Symmetry[] = [Symmetry.None, Symmetry.XAxis, Symmetry.Origin, Symmetry.YAxis];
    const positions: BoardVector2d[] = []

    this.clearMoves();

    for (let symmetry of symmetries) {
      for (let vector of baseVectors) {
        positions.push(piece.position.add(vector.applySymmetry(symmetry)));
      }
    }

    for (let position of positions) {
      if (!board.isOutOfBounds(position)) {
        this._allMoves.push(position);
        if (board.canMoveTo(position, piece)) {
          this._legalMoves.push(position);
        }
        if (board.canMoveTo(position, piece)) { //Additional data 
          this._capturableMoves.push(position);
        }
      }
    }
  }
}