import { CheckManager } from "core/check_manager.js";
import { PromotionManager } from "core/promotion_manager.js";
import { Tile } from "core/tile.js";
import { BoardVector2d } from "geometry";
import { Piece } from "pieces";
import { KingPiece } from "pieces/particular_pieces/king.js";
import { LasgunPiece } from "pieces/particular_pieces/lasgun.js";


export class Board {
  private readonly width: number;
  private readonly height: number;
  private readonly tiles: Map<BoardVector2d, Tile>;
  private readonly kings: Array<KingPiece | undefined>;
  private readonly lasguns: Array<LasgunPiece | undefined>;

  private promotionManager: PromotionManager;
  private checkManager: CheckManager;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Map<BoardVector2d, Tile>();

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let place: BoardVector2d = new BoardVector2d(i, j);
        this.tiles.set(place, new Tile(place.copy()));
      }
    }

    this.kings = [];
    this.lasguns = [];
    // this.promotionManager
    // this.checkManager
  }

  public isOutOfBounds(destination: BoardVector2d): boolean {
    return destination.x < 0 || destination.x >= this.width || destination.y < 0 || destination.y >= this.height;
  }

  public getTile(positon: BoardVector2d): Tile | undefined {
    return this.tiles.get(positon);
  }

  public isPieceAt(positon: BoardVector2d): boolean {
    const tile: Tile | undefined = this.tiles.get(positon);
    if (tile === undefined) {
      return false;
    }
    return tile.pieceOnTile !== undefined;
  }

  public addPiece(piece: Piece) {

  }
  
}