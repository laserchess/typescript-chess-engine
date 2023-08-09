import { BoardVector2d } from "geometry";

export enum PieceType {
  KING = "K",
  QUEEN = "Q",
  PAWN = "",
  BISHOP = "B",
  ROOK = "R",
  KNIGHT = "N",
  MIRROR = "M",
  LASGUN = "L"
}

export interface PieceOpitons {
  pieceType: PieceType,
  movement: PieceMovement
}

export abstract class Piece {

  public readonly initialPosition: BoardVector2d;
  public readonly playerId: number;
  public readonly pieceType: PieceType;
  public readonly movement: PieceMovement;
  public defendsKingsFrom: Piece[][];
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
    return this.pieceType.valueOf();
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
    const origin: BoardVector2d = this._position.copy();
    this._position = destination;
    this.moveCounter += 1;
    this.board.notifyPositionChange(origin, destination);
  }
}

export abstract class PieceMovement {
  protected board: Board;
  protected _piece?: Piece;
  protected readonly _allMoves: BoardVector2d[];
  protected readonly _legalMoves: BoardVector2d[];
  protected readonly _capturableMoves: BoardVector2d[];

  public constructor(board: Board) {
    this.board = board;
    this._allMoves = [];
    this._legalMoves = [];
    this._capturableMoves = [];
  }

  public set piece(piece: Piece) {
    if (this._piece === undefined) {
      this._piece = piece;
    }
  }

  protected clearMoves(): void {
    this._allMoves.length = 0;
    this._legalMoves.length = 0;
    this._capturableMoves.length = 0;
  }

  public abstract updateMoves(): void;


  public get allMoves(): BoardVector2d[] {
    return this._allMoves;
  }

  public get legalMoves(): BoardVector2d[] {
    return this._legalMoves;
  }

  public get capturableMoves(): BoardVector2d[] {
    return this._capturableMoves;
  }
}