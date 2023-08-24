import { Board, MoveType, CaptureOptions, Move } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { Piece, PieceOptions, PieceType } from "@lc/pieces";
import { CloseRangeMovement } from "@lc/piece-movements";
import { ObjectsUtilities } from "utils/ObjectUtilities.js";



export class King extends Piece {
  private _kingRook?: Piece;
  private _queenRook?: Piece;

  public constructor(position: BoardVector2d, playerId: number, board: Board) {
    const options: PieceOptions =
    {
      pieceType: PieceType.KING,
      movement: new KingMovement(board)
    }
    super(position, playerId, board, options);
    this.movement.piece = this;
  }

  public set kingRook(rook: Piece) {
    this._kingRook = this.kingRook;
  }

  public set queenRook(rook: Piece) {
    this._queenRook = this.kingRook;
  }

  public get kingRook(): Piece {
    return this._kingRook!;
  }

  public get queenRook(): Piece {
    return this._queenRook!;
  }
  
}

export class KingMovement extends CloseRangeMovement {

  public isCastlingLegal(castling: MoveType): boolean {
    let potentialRook: Piece;
    const piece: King = this.piece as King;
    if (castling === MoveType.KingSideCastling) {
      potentialRook = piece.kingRook;
    }
    else if (castling === MoveType.QueenSideCastling) {
      potentialRook = piece.queenRook;
    }
    else {
      return false;
    }
    
    if (
      potentialRook.pieceType === PieceType.ROOK
      && !potentialRook.wasMoved()
      && !this.piece.wasMoved()
    ) {
      const fromKingUnitVector: BoardVector2d = this.piece.position.sub(potentialRook.position).createUnitVector();
      let currentPosition: BoardVector2d = this.piece.position;

      for (let i = 0; i < 2; i++) {
        if (this.board.isCheckAt(currentPosition, this.piece.playerId)) {
          return false;
        }
        currentPosition = currentPosition.add(fromKingUnitVector);
      }

      currentPosition = this.piece.position;
      while (currentPosition !== potentialRook.position) {
        if (!this.board.canMoveTo(currentPosition, this.piece, CaptureOptions.NoCapture)) {
          return false;
        }
        currentPosition = currentPosition.add(fromKingUnitVector);
      }
      return true
    }
    return false;
  }

  protected updateMovesWrapped(): void {
    super.updateMoves();
    if (this.isCastlingLegal(MoveType.KingSideCastling)) {
      let move: Partial<Move> = {
        destination: this.piece.position.add(new BoardVector2d(2, 0)) as BoardVector2d,
        moveType: MoveType.Move & MoveType.KingSideCastling
      }
      this.legalMoves.push(move)
      this.allMoves.push(ObjectsUtilities.objectDeepcopy(move));
    }
    else if (this.isCastlingLegal(MoveType.QueenSideCastling)) {
      let move: Partial<Move> = {
        destination: this.piece.position.add(new BoardVector2d(-2, 0)) as BoardVector2d,
        moveType: MoveType.Move & MoveType.KingSideCastling
      }
      this.legalMoves.push(move)
      this.allMoves.push(ObjectsUtilities.objectDeepcopy(move));
    }
  }
}



