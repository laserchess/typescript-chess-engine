import { CheckManager } from "core/CheckManager.js";
import { PromotionManager } from "core/PromotionManager.js";
import { Tile } from "core/tile.js";
import { BoardVector2d } from "geometry";
import { Piece, PieceType } from "pieces";
import { KingPiece } from "pieces/particular_pieces/King.js";
import { LasgunPiece } from "pieces/particular_pieces/Laser.js";

interface CanMoveToOptios {
  capture: boolean;
  requiredCapture: boolean
}

export class Board {
  private readonly width: number;
  private readonly height: number;
  private readonly tiles: Map<BoardVector2d, Tile>;
  private readonly piecesOfType: Map<PieceType, Piece[][]>;
  private readonly kingsProtectors: [Piece[], Piece[]];

  private promotionManager: PromotionManager;
  private checkManager: CheckManager;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Map<BoardVector2d, Tile>();
    this.piecesOfType = new Map<PieceType, Piece[][]>();
    this.kingsProtectors = [[], []];

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let place: BoardVector2d = new BoardVector2d(i, j);
        this.tiles.set(place, new Tile(place.copy()));
      }
    }

    for (let item in PieceType){
      let pieceType: PieceType = PieceType[item as keyof typeof PieceType];
      this.piecesOfType.set(pieceType, []);
    }

    // this.promotionManager
    // this.checkManager
  }

  public getPiecesOfPlayer(playerId: number): Piece[] {
    let playerPieces: Piece[] = [];
    for (let type in PieceType) {
      let pieceType: PieceType = PieceType[type as keyof typeof PieceType];
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

  public getTile(positon: BoardVector2d): Tile | undefined {
    return this.tiles.get(positon);
  }

  public getTileOfPiece(piece: Piece): Tile {
    const tile: Tile | undefined = this.tiles.get(piece.position)
    if (tile === undefined) {
      throw new Error("There is no tile with coordinates of passed piece.");
    }
    return tile;
  } 

  public isPieceAt(positon: BoardVector2d): boolean {
    const tile: Tile | undefined = this.tiles.get(positon);
    if (tile === undefined) {
      return false;
    }
    return tile.pieceOnTile !== undefined;
  }

  public addPieces(pieces: Piece[]): void {
    for (let piece of pieces) {
      this.addPiece(piece);
    }
  }

  public addPiece(piece: Piece): void {
    if (this.isPieceAt(piece.position)) {
      throw new Error("There is already piece at this position.");
    }

    const tile: Tile | undefined = this.tiles.get(piece.position);
    if (tile === undefined) {
      throw new Error("There is no such tile, that has position of piece.");
    }

    tile.pieceOnTile = piece;
    
    const pieceTypeArray: Piece[][] = this.piecesOfType.get(piece.pieceType)!;
    pieceTypeArray.length = Math.max(pieceTypeArray.length, piece.playerId + 1);
    pieceTypeArray[piece.playerId].push(piece);
  }

  public removePiece(piece: Piece): void {
    const tile: Tile | undefined = this.tiles.get(piece.position);
    if (tile === undefined) {
      return;
    }
    if (tile.pieceOnTile === piece) {
      tile.pieceOnTile = undefined;
    }
  }

  public canMoveTo(destination: BoardVector2d, piece: Piece,{capture, requiredCapture}: CanMoveToOptios): boolean {
    const captureBool: boolean = capture;
    const requiredCaptureBool: boolean = captureBool;
    const playerId: number = piece.playerId;
    // TODO
  }

  public getPiecesOfType(playerId: number, pieceType: PieceType): Piece[] {
    return this.piecesOfType.get(pieceType)![playerId];
  }

  public notifyPositionChange(origin: BoardVector2d, destination: BoardVector2d) {

  }

  public notifyRangedCapture(origin: BoardVector2d, destination: BoardVector2d) {

  }
  
}