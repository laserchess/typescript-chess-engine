import { BoardVector2d } from "geometry";
import { DirectedPiece, PieceOpitons, PieceMovement, PieceType, Direction, Piece } from "pieces"

export class PawnPiece extends DirectedPiece {
  private _enPassantPosition?: BoardVector2d;
  private _promotionPosition?: BoardVector2d;

  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    let options: PieceOpitons =
    {
      pieceType: PieceType.PAWN,
      movement: new PawnMovement(board)
    }
    super(position, playerId, board, options);
    this.movement.piece = this
  }

  public set enPassantPosition(position: BoardVector2d) {
    if (this._enPassantPosition === undefined) {
      this._enPassantPosition = position;
    }
  }

  public set promotionPosition(position: BoardVector2d) {
    if (this._promotionPosition === undefined) {
      this._promotionPosition = position;
    }
  }

  public isOnEnPassantPosition(): boolean {
    return this._enPassantPosition === this.position;
  }

  public isOnPromotionPosition(): boolean {
    return this._promotionPosition!.y === this._position.y;
  }
}

export class PawnMovement extends PieceMovement {

  public isEnPassantLegal(destination: BoardVector2d): boolean {
    const piece: PawnPiece = this._piece as PawnPiece;
    const board: Board = this.board;
    const otherPiece: Piece = board.getPiece(destination.sub(Direction.toBoardVector2d(piece.direction!)));
    return otherPiece !== undefined
      && otherPiece.isSameColor(piece)
      && otherPiece.pieceType === PieceType.PAWN
      && board.canMoveTo(destination)
      && board.getLastMove().piece === otherPiece
      && piece.isOnEnPassantPosition();
  }

  public updateMoves(): void {
    const piece: PawnPiece = this._piece as PawnPiece;
    const board: Board = this.board;
    const direction: BoardVector2d = Direction.toBoardVector2d(piece.direction as Direction);
    const captureDeltas: BoardVector2d[] = [
      Direction.toBoardVector2d(piece.direction!).reverseAxis().add(Direction.toBoardVector2d(piece.direction!)),
      Direction.toBoardVector2d(piece.direction!).reverseAxis().opposite().add(Direction.toBoardVector2d(piece.direction!))
    ]

    this.clearMoves();

    // Advance 1 square
    if (!board.isOutOfBounds(piece.position.add(direction))) {
      this._allMoves.push(piece.position.add(direction));
    }

    if (!board.canMoveTo(piece.position.add(direction), piece)) {
      this._legalMoves.push(piece.position.add(direction));
    }

    // Advance 2 squares

    if (!board.isOutOfBounds(piece.position.add(direction.mul(2)))) {
      this._allMoves.push(piece.position.add(direction.mul(2)));
    }

    if (
      !piece.wasMoved()
      && board.canMoveTo(piece.position.add(direction.mul(2)), piece)
      && this.legalMoves.length > 0
    ) {
      this._legalMoves.push(piece.position.add(direction.mul(2)));
    }

    // Capture

    for (let increment of captureDeltas) {
      let position: BoardVector2d = piece.position.add(increment);
      if (!board.isOutOfBounds(position)) {
        this._allMoves.push(position);
      }
      if (!board.canMoveTo(position, piece)) {
        this._legalMoves.push(position);
      }
      this._capturableMoves.push(position);
    }

    // En Passant

    if (piece.isOnEnPassantPosition()) {
      for (let position of captureDeltas) {
        let tmpPosition: BoardVector2d = piece.position.add(position);
        if (this.isEnPassantLegal(tmpPosition)) {
          this._allMoves.push(tmpPosition);
          this._legalMoves.push(tmpPosition);
        }
      }
    }
  }
}