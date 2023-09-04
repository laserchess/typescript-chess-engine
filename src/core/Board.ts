import {
  CheckManager,
  PromotionManager,
  Tile,
  Move,
  MoveOrder
} from "@lc/core";
import { BoardVector2d, Rotation } from "@lc/geometry";
import { Piece, PieceType } from "@lc/pieces";
<<<<<<< HEAD
import { Lasgun } from "core/Lasgun.js";
import { MoveOrder } from "game.js";
import { IllegalMoveError } from "utils/error.js";
=======
import { IllegalMoveError } from "@lc/utils";
>>>>>>> ce3418d779863c4f753b114c41dc43e9e0d8da6a


export const enum CaptureOptions {
  NoCapture = 0,
  OptionalCapture = 1,
  RequiredCapture = 2
}

export class Board {
  public readonly width: number;
  public readonly height: number;
  private readonly tiles: Map<BoardVector2d, Tile>;
  private readonly piecesOfType: Map<PieceType, Piece[][]>;
  private readonly kingsProtectors: [Piece[], Piece[]];
  private readonly movesHistory: [Move[], Move[]];
  private readonly lasguns!: [Lasgun, Lasgun];
  private _lastMove: Move | null;

  private promotionManager?: PromotionManager;
  private checkManager?: CheckManager;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Map<BoardVector2d, Tile>();
    this.piecesOfType = new Map<PieceType, Piece[][]>();
    this.kingsProtectors = [[], []];
    this.movesHistory = [[], []];
    this._lastMove = null;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const place: BoardVector2d = new BoardVector2d(i, j);
        this.tiles.set(place, new Tile(place.copy()));
      }
    }

    for (const item in PieceType){
      const pieceType: PieceType = PieceType[item as keyof typeof PieceType];
      this.piecesOfType.set(pieceType, []);
    }


    // this.promotionManager
    // this.checkManager
  }

  public getPiecesOfPlayer(playerId: number): Piece[] {
    let playerPieces: Piece[] = [];
    for (const type in PieceType) {
      const pieceType: PieceType = PieceType[type as keyof typeof PieceType];
      playerPieces = playerPieces.concat(this.piecesOfType.get(pieceType)![playerId]);
    }
    return playerPieces;
  }
  
  public getKingProtectors(playerId: number): Piece[] {
    return this.kingsProtectors[playerId];
  }
  public isOutOfBounds(destination: BoardVector2d): boolean {
    return destination.x < 0 || destination.x >= this.width || destination.y < 0 || destination.y >= this.height;
  }

  public getTile(position: BoardVector2d): Tile {
    const tile: Tile | undefined = this.tiles.get(position);
    if (tile === undefined) {
      throw new Error("There is no tile with coordinates of passed piece.");
    }
    return tile;
  }

  public getPiece(position: BoardVector2d): Piece | null {
    return this.getTile(position).pieceOnTile;
  }

  public getTileOfPiece(piece: Piece): Tile {
    return this.getTile(piece.position);
  } 

  public isPieceAt(positon: BoardVector2d): boolean {
    const tile: Tile | undefined = this.tiles.get(positon);
    if (tile === undefined) {
      return false;
    }
    return tile.pieceOnTile !== undefined;
  }

  public addPieces(pieces: Piece[]): void {
    for (const piece of pieces) {
      this.addPiece(piece);
    }
  }

  public addPiece(piece: Piece): void {
    if (this.isPieceAt(piece.position)) {
      throw new Error("There is already piece at this position.");
    }

    const tile: Tile  = this.getTile(piece.position);
    tile.pieceOnTile = piece;
    
    const pieceTypeArray: Piece[][] = this.piecesOfType.get(piece.type)!;
    pieceTypeArray.length = Math.max(pieceTypeArray.length, piece.playerId + 1);
    pieceTypeArray[piece.playerId].push(piece);
  }

  public removePiece(piece: Piece): void {
    const tile: Tile | undefined = this.tiles.get(piece.position);
    if (tile === undefined) {
      return;
    }
    if (tile.pieceOnTile === piece) {
      tile.pieceOnTile = null;
    }
  }

  public canMoveTo(destination: BoardVector2d, piece: Piece, capture: CaptureOptions): boolean {
    // const playerId: number = piece.playerId;

    // Check, if position after moving is in bounds of board.

    if (this.isOutOfBounds(destination)) {
      return false;
    }

    // TODO Laser fields 

    // TODO Checks

    const destinationPiece: Piece | null = this.getTile(destination)!.pieceOnTile;

    if (destinationPiece === null){
      if (capture === CaptureOptions.RequiredCapture) {
        return false;
      }
      return true;
    }
    else if(!piece.isSameColor(destinationPiece)) {
      if (capture === CaptureOptions.NoCapture) {
        return false;
      }
      return true;
    }
    return false;
  }


  public getPiecesOfType(playerId: number, pieceType: PieceType): Piece[] {
    return this.piecesOfType.get(pieceType)![playerId];
  }

  private getSpecificMove(move: MoveOrder, playerId: number): Partial<Move> {
    let pieceToMove: Piece | null = this.getTile(move.origin).pieceOnTile;
    
    if (move.destination !== null && move.rotation !== null) {
      throw new IllegalMoveError("Unable to roatate and move piece at once.");
    }

    if (move.rotation === null && move.destination === null) {
      throw new IllegalMoveError("Piece have to either rotate or move.");
    }

    if (move.destination === null && move.rotation === null) {
      throw new IllegalMoveError("Unable to roatate and move piece at once.");
    }


    if (move.fireLaser === true && !this.lasguns[playerId].isLoaded()) {
      throw new IllegalMoveError("Lasgun is not loaded yet.");
    }

    if (pieceToMove === null) {
      throw new IllegalMoveError("There is no piece that has this position.");
    }

    if (!pieceToMove.isSameColor(playerId)) {
      throw new IllegalMoveError("Piece standing on origin position is enemy's piece.");
    }

    if (pieceToMove.pieceType !== PieceType.KNIGHT && move.rangedCapture === true) {
      throw new IllegalMoveError("Only knight can capture without moving.");
    }

    if (pieceToMove.pieceType !== PieceType.MIRROR && move.rotation !== null) {
      throw new IllegalMoveError("Only mirror can rotate.");
    }

    if (move.rotation !== null) {
      for (let predictedMove of pieceToMove.movement.legalMoves) {
        if (move.rotation === predictedMove.rotation) {
          predictedMove.piece = pieceToMove;
          return predictedMove;
        }
      }
    }

    if (move.destination !== null) {
      for (let predictedMove of pieceToMove.movement.legalMoves) {
        if (move.destination === predictedMove.destination) {
          predictedMove.piece = pieceToMove;
          return predictedMove;
        }
      }
    }
  }

  public move(move: MoveOrder, playerId: number): void {
    let moves: Partial<Move>[];
    let pieceToMove: Piece | null = this.getTile(move.origin).pieceOnTile;
    this.validateBasicMoveProperties(move, playerId);
    


  }

  public notifyPositionChange(/* origin: BoardVector2d, destination: BoardVector2d */) {

  }

  public notifyRangedCapture(/* origin: BoardVector2d, destination: BoardVector2d */) {

  }

  public get lastMove(): Move | null {
    return this._lastMove;
  }

  public isCheckAt(/* position: BoardVector2d, playerId: number */): boolean {
    return false;
  }
  
}