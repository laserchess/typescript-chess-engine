import {
  CheckManager,
  PromotionManager,
  Tile,
  Move,
  MoveOrder,
  MoveType
} from "@lc/core";
import { BoardVector2d, Direction, DirectionUtils, Rotation, Symmetry } from "@lc/geometry";
import { Pawn, Piece, PieceType } from "@lc/pieces";
import { IllegalMoveError, Syntax } from "@lc/utils";
import { Lasgun } from "@lc/core";
import { Mirror } from "pieces/Mirror.js";


export const enum CaptureOptions {
  NoCapture = 0,
  OptionalCapture = 1,
  RequiredCapture = 2
}

export class Board {
  public readonly width: number;
  public readonly height: number;
  private readonly tiles: Map<BoardVector2d, Tile>;
  private readonly piecesOfType: Map<PieceType, [Set<Piece>,Set<Piece>]>;
  private readonly kingsProtectors: [Set<Piece>, Set<Piece>];
  private readonly movesHistory: [Move[], Move[]];
  private readonly lasguns!: [Lasgun, Lasgun];
  private _lastMove: Move | null;

  private promotionManager?: PromotionManager;
  private checkManager?: CheckManager;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Map<BoardVector2d, Tile>();
    this.piecesOfType = new Map<PieceType, [Set<Piece>,Set<Piece>]>();
    this.kingsProtectors = [new Set<Piece>, new Set<Piece>];
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
      this.piecesOfType.set(pieceType, [new Set<Piece>,new Set<Piece>]);
    }


    // this.promotionManager
    // this.checkManager
  }

  public updateAllTiles() {
    for (let tile of this.tiles) {
      tile[1].clearAllPredictions();
    }
  }

  public getPiecesOfPlayer(playerId: number): Set<Piece> {
    let playerPieces: Set<Piece> = new Set<Piece>;
    for (const type in PieceType) {
      const pieceType: PieceType = PieceType[type as keyof typeof PieceType];
      playerPieces = new Set([...playerPieces,...this.piecesOfType.get(pieceType)![playerId]])
    }
    return playerPieces;
  }
  
  public getKingProtectors(playerId: number): Set<Piece> {
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
    
    const pieceTypeSets: [Set<Piece>, Set<Piece>] = this.piecesOfType.get(piece.type)!;

    pieceTypeSets[piece.playerId].add(piece);
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

  public canRotate(rotation: Rotation, piece: Piece): boolean {
    return true;
  }

  public canRangeCapture(destination: BoardVector2d, piece: Piece): boolean {
    return this.canMoveTo(destination, piece, CaptureOptions.RequiredCapture);
  }

  public canMoveTo(destination: BoardVector2d, piece: Piece, capture: CaptureOptions): boolean {

    // Check, if position after moving is in bounds of board.

    if (this.isOutOfBounds(destination)) {
      return false;
    }

    // TODO Laser fields 

    // TODO Checks

    const destinationPiece: Piece | null = this.getTile(destination)!.pieceOnTile;


    if (destinationPiece === null){
      return capture !== CaptureOptions.RequiredCapture;
    }

    else if(!piece.isSameColor(destinationPiece)) {
      return capture !== CaptureOptions.NoCapture; 
    }

    return false;
  }

  public getPiecesOfType(playerId: number, pieceType: PieceType): Set<Piece> {
    return this.piecesOfType.get(pieceType)![playerId];
  }

  private getSpecificMove(move: MoveOrder, playerId: number): Partial<Move> {
    let pieceToMove: Piece | null = this.getTile(move.origin).pieceOnTile;

    if (pieceToMove === null) {
      throw new IllegalMoveError("There is no piece on origin postion.");
    }
    
    if (move.destination !== null && move.rotation !== null) {
      throw new IllegalMoveError("Unable to roatate and move piece at once.");
    }

    if (move.rotation === null && move.destination === null) {
      throw new IllegalMoveError("Piece have to either rotate or move.");
    }

    if (move.destination !== null && move.rotation !== null) {
      throw new IllegalMoveError("Unable to roatate and move piece at once.");
    }

    if (move.rangedCapture === true && move.rotation !== null) {
      throw new IllegalMoveError("Piece cannot rotate and range capture a piece in one move.");
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
    if (pieceToMove.type !== PieceType.KNIGHT && move.rangedCapture === true) {
      throw new IllegalMoveError("Only knight can capture without moving.");
    }

    if (pieceToMove.type !== PieceType.MIRROR && move.rotation !== null) {
      throw new IllegalMoveError("Only mirror can rotate.");
    }
    
    if (move.rangedCapture === true) {
      for (let predictedMove of pieceToMove.movement.legalMoves) {
        if ((predictedMove.moveType! & MoveType.RangedCapture) === MoveType.RangedCapture && move.destination === predictedMove.destination) {
          return predictedMove;
        }
      }
    }

    if (move.rotation !== null) {
      for (let predictedMove of pieceToMove.movement.legalMoves) {
        if (move.rotation === predictedMove.rotation) {
          return predictedMove;
        }
      }
    }

    if (move.destination !== null) {
      for (let predictedMove of pieceToMove.movement.legalMoves) {
        if (move.destination === predictedMove.destination) {
          return predictedMove;
        }
      }
    }

    throw new IllegalMoveError("Unable to perform such move.");
  }

  private buildMove(piece: Piece, pieceMove: Partial<Move>, moveOrder: MoveOrder, promotedTo?: PieceType): Move {
    const ultimateMove: Move = {
      destination: pieceMove.destination ?? null,
      moveType: pieceMove.moveType!,
      rotation: pieceMove.rotation ?? null,
      origin: piece.position,
      piece: piece,
      promotedTo: promotedTo ?? null,
      captured: null,
      laserFields: [new Set<BoardVector2d>, new Set<BoardVector2d>],
      laserCaptures: new Set<BoardVector2d>
    }

    if (Syntax.inAlternative(ultimateMove.moveType,MoveType.EnPassant)) {
      const directionVector: BoardVector2d = DirectionUtils.toBoardVector2d((piece as Pawn).direction!).opposite();
      const enemyPositon: BoardVector2d = ultimateMove.destination!.add(directionVector);
      const enemyPiece: Piece = this.getPiece(enemyPositon)!;
      ultimateMove.captured = enemyPiece;
    }

    else if (Syntax.inAlternative(ultimateMove.moveType,MoveType.Capture)) {
      const enemyPiece: Piece = this.getPiece(ultimateMove.destination!)!;
      ultimateMove.captured = enemyPiece;
    }
    
    else if (Syntax.inAlternative(ultimateMove.moveType,MoveType.RangedCapture)) {
      const enemyPiece: Piece = this.getPiece(ultimateMove.destination!)!;
      ultimateMove.captured = enemyPiece;
    }

    if (moveOrder.fireLaser === true) {
      ultimateMove.moveType |= MoveType.LaserFired
    }
    //TODO Laser Fields, Laser Captures
    //TODO CheckManager
    return ultimateMove;
  }

  public fulfillMove(move: Move) {
    const typesOfMove: MoveType = move.moveType;


    move.piece.move(move);
    this._lastMove = move;
    this.movesHistory[move.piece.playerId].push(move);

    if (Syntax.inAlternative(typesOfMove, MoveType.RangedCapture) || Syntax.inAlternative(typesOfMove, MoveType.Capture)) {
      const captured: Piece = move.captured!;
      this.getPiecesOfType(captured.playerId, captured.type).delete(captured);
      this.getTile(captured.position).pieceOnTile = null;
    }

    if (Syntax.inAlternative(typesOfMove, MoveType.Move)) {
      const pieceToMove: Piece = move.piece;
      this.getTile(pieceToMove.position).pieceOnTile = null;
      this.getTile(move.destination!).pieceOnTile = pieceToMove;
    }

    if (Syntax.inAlternative(typesOfMove, MoveType.Rotation)) {
      (this.getTile(move.origin).pieceOnTile! as Mirror).turn(move.rotation!);
    }
    //TODO Laser Fields and other Move Types
  }

  public move(move: MoveOrder, playerId: number, promotionTo?: PieceType): void {
    const moveFromPiece: Partial<Move> = this.getSpecificMove(move, playerId);

    if (Syntax.inAlternative(moveFromPiece.moveType!, MoveType.Promotion) && promotionTo === undefined) {
      // Return some data, that would tell gui, that selected move is legal,
      // and it needs to send PieceType in promotionTo.
    }

    const pieceToMove: Piece  = this.getTile(move.origin).pieceOnTile!;
    const moveToAnalyze: Move = this.buildMove(pieceToMove, moveFromPiece, move);

    this.fulfillMove(moveToAnalyze);
  }


  public get lastMove(): Move | null {
    return this._lastMove;
  }

  public isCheckAt(/* position: BoardVector2d, playerId: number */): boolean {
    return false;
  }

}