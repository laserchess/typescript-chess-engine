import { BoardVector2d } from "geometry";

export enum PieceType {
  KING    = 0,
  QUEEN   = 1,
  PAWN    = 2,
  BISHOP  = 3,
  ROOK    = 4,
  KNIGHT  = 5,
  MIRROR  = 6,
  LASGUN  = 7
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


  public constructor(position: BoardVector2d, playerId: number, board: Board, options: PieceOpitons){
    this.initialPosition = position;
    this._position = position;
    this.playerId = playerId;
    this.moveCounter = 0;
    this.board = board;
    this.pieceType = options.pieceType;
    this.movement = options.movement;
    this.defendsKingsFrom = [];
  }

  get position(): BoardVector2d{
    return this._position;
  }

  public equals(other: any): boolean {
    if (other !instanceof Piece){
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
    switch(this.pieceType){
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

  public isSameColor(other: Piece|number): boolean {
    if (other instanceof Piece){
      return this.playerId === other.playerId;
    }
    return this.playerId === other;
  }
  
  public move(destination: BoardVector2d){
    let origin: BoardVector2d = this._position.copy();
    this._position = destination;
    this.moveCounter += 1;
    this.board.notifyPositionChange(origin, destination);
  }
}

export abstract class PieceMovement {
  private board: Board;

  public constructor(board: Board) {
    this.board = board;
  }

  public abstract getAllMoves(position: BoardVector2d): BoardVector2d[][];

  public abstract getLegalMoves(position: BoardVector2d): BoardVector2d[][];

  public abstract getCapturableMoves(position: BoardVector2d): BoardVector2d[][]; 
}