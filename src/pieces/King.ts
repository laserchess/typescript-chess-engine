import { MoveType, CaptureOptions, Move } from "@lc/core";
import { BoardVector2d } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";
import { CloseRangeMovement } from "@lc/piece-movements";



export class King extends Piece {
  private _kingRook?: Piece;
  private _queenRook?: Piece;

  protected override initType(): void {
    this._type = PieceType.KING;
    this._movement  = new KingMovement(this, this.board);
  }

  public set kingRook(rook: Piece | undefined) {
    this._kingRook = this.kingRook;
  }

  public set queenRook(rook: Piece | undefined) {
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
    
    if (potentialRook === undefined) {
      return false;
    }
    
    if (
      potentialRook.type === PieceType.ROOK
      && !potentialRook.wasMoved()
      && !this.piece.wasMoved()
    ) {
      const fromKingUnitVector: BoardVector2d = this.piece.position.sub(potentialRook.position).createUnitVector();
      let currentPosition: BoardVector2d = this.piece.position;

      for (let i = 0; i < 2; i++) {
        // if (this.board.isCheckAt(currentPosition, this.piece.playerId)) {
        //   return false;
        // }
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

 public updateMoves(): void {
    super.updateMoves();
    let move: Partial<Move> = {
      destination: this.piece.position.add(new BoardVector2d(2, 0)) as BoardVector2d,
      moveType: MoveType.Move | MoveType.KingSideCastling
    }
    if (this.isCastlingLegal(MoveType.KingSideCastling)) {
      this.legalMoves.push(move);
    }
    else {
      this.illegalMoves.push(move);
    }

    move = {
      destination: this.piece.position.add(new BoardVector2d(-2, 0)) as BoardVector2d,
      moveType: MoveType.Move & MoveType.QueenSideCastling
    }

    if (this.isCastlingLegal(MoveType.QueenSideCastling)) {
      this.legalMoves.push(move);
    }
    else {
      this.illegalMoves.push(move);
    }
  }
}



