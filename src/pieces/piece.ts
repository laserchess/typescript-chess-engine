import { BoardVector2d } from "geometry";

export enum PieceType {
  KING = 0,
  QUEEN = 1,
  PAWN = 2,
  BISHOP = 3,
  ROOK = 4,
  KNIGHT = 5,
  MIRROR = 6,
  LASGUN = 7
}

export interface PieceOpitons {
  pieceType: PieceType,
  movement: PieceMovement
}

export abstract class Piece {

  public readonly initialPosition: BoardVector2d;
  public readonly playerId: number;
  public readonly pieceType: PieceType;
  public defendsKingsFrom: Piece[];
  protected readonly movement: PieceMovement;
  protected readonly board: Board;
  protected _position: BoardVector2d;
  protected moveCounter: number;


  public constructor(position: BoardVector2d, playerId: number, board: Board, options: PieceOpitons) {
    this.initialPosition = position;
    this._position = position;
    this.playerId = playerId;
    this.moveCounter = 0;
    this.board = board;
    this.pieceType = options.pieceType;
    this.movement = options.movement;
    this.defendsKingsFrom = [];
  }

  public get position(): BoardVector2d {
    return this._position;
  }

  public equals(other: any): boolean {
    if (other! instanceof Piece) {
      return false;
    }
    return this.initialPosition === other.initialPosition
      && this._position === other.position
      && this.playerId === other.playerId
      && this.moveCounter === other.playerId
      && this.movement === other.movement
      && this.pieceType === other.pieceType
  }

  public toString(): string {
    switch (this.pieceType) {
      case PieceType.KING:
        return "K";
      case PieceType.QUEEN:
        return "Q";
      case PieceType.PAWN:
        return "";
      case PieceType.BISHOP:
        return "B";
      case PieceType.ROOK:
        return "R";
      case PieceType.KNIGHT:
        return "N";
      case PieceType.MIRROR:
        return "M";
      case PieceType.LASGUN:
        return "L";
      default:
        throw new Error("Field pieceType is undefined.");
    }
  }

  public wasMoved(): boolean {
    return this.moveCounter > 0;
  }

  public isSameColor(other: Piece | number): boolean {
    if (other instanceof Piece) {
      return this.playerId === other.playerId;
    }
    return this.playerId === other;
  }

  public move(destination: BoardVector2d) {
    let origin: BoardVector2d = this._position.copy();
    this._position = destination;
    this.moveCounter += 1;
    this.board.notifyPositionChange(origin, destination);
  }

  public getAllMoves(): BoardVector2d[][] {
    return this.movement.getAllMoves();
  }

  public getLegalMoves(): BoardVector2d[][] {
    return this.movement.getLegalMoves();
  }

  public getCapturableMoves(): BoardVector2d[][] {
    return this.movement.getCapturableMoves();
  }
}

export abstract class PieceMovement {
  protected board: Board;
  protected _piece?: Piece;

  public constructor(board: Board) {
    this.board = board;
  }

  public set piece(piece: Piece) {
    if (this._piece === undefined) {
      this._piece = piece;
    }
  }

  public abstract getAllMoves(): BoardVector2d[][];

  public abstract getLegalMoves(): BoardVector2d[][];

  public abstract getCapturableMoves(): BoardVector2d[][];
}