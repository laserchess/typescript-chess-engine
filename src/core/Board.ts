import {
  CheckManager,
  PromotionManager,
  Move,
  MoveType,
  Player
} from "@lc/core";
import { BoardVector2d, DirectionUtils, Rotation, Symmetry } from "@lc/geometry";
import { Pawn, Piece, PieceType } from "@lc/pieces";
import { IllegalMoveError, Syntax } from "@lc/utils";
import { Lasgun } from "@lc/core";
import { MoveCommand } from "@lc/core";
import { Map as ValueMap, Set as ValueSet } from "immutable";


export const enum CaptureOptions {
  NoCapture = 0,
  OptionalCapture = 1,
  RequiredCapture = 2
}

export class Board {
  public readonly width: number;
  public readonly height: number;
  private readonly tiles: Map<String, Piece>;
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
    this.tiles = new Map<String, Piece>();
    this.piecesOfType = new Map<PieceType, [Set<Piece>,Set<Piece>]>();
    this.kingsProtectors = [new Set<Piece>, new Set<Piece>];
    this.movesHistory = [[], []];
    this._lastMove = null;

    for (const item in PieceType){
      const pieceType: PieceType = PieceType[item as keyof typeof PieceType];
      this.piecesOfType.set(pieceType, [new Set<Piece>,new Set<Piece>]);
    }


    // this.promotionManager
    // this.checkManager
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

  public changePosition(newPosition: BoardVector2d, piece: Piece) {
    this.removePiece(piece);
    this.tiles.set(newPosition.toString(), piece);
    piece.position = newPosition;
  }

  public getPiece(position: BoardVector2d): Piece | null {
    return this.tiles.get(position.toString()) ?? null;
  }

  public isPieceAt(positon: BoardVector2d): boolean {
    return this.getPiece(positon) !== null;
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
    this.tiles.set(piece.position.toString(), piece);
    this.piecesOfType.get(piece.type)![piece.playerId].add(piece);
  }

  public removePiece(piece: Piece): void {
    this.tiles.delete(piece.position.toString());
    this.piecesOfType.get(piece.type)![piece.playerId].delete(piece);
    for (const protectors of this.kingsProtectors) {
      protectors.delete(piece);
    }
  }

  public shiftPiece(origin: BoardVector2d, destination: BoardVector2d) {
    const piece: Piece | null = this.getPiece(origin);
    if (piece === null) {
      throw new Error("Unable to shift piece. There is no piece on origin.");
    }
    if (this.getPiece(destination) !== null) {
      throw new Error("Unable to shift piece. There is already piece on destination.");
    }
    piece.position = destination;
    this.tiles.delete(origin.toString());
    this.tiles.set(destination.toString(), piece);
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

    const destinationPiece: Piece | null = this.getPiece(destination);


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

  private isMoveCommandLegal(move: MoveCommand, playerId: Player): boolean {
    const pieceToMove: Piece | null = this.getPiece(move.origin);
    return !(
    pieceToMove === null ||
    (move.destination !== null && move.rotation !== null) ||
    (move.rotation === null && move.destination === null) ||
    (move.destination !== null && move.rotation !== null) ||
    (move.rangedCapture === true && move.rotation !== null) ||
    (move.fireLaser === true && !this.lasguns[playerId].isLoaded()) ||
    !pieceToMove.isSameColor(playerId) ||
    (pieceToMove.type !== PieceType.KNIGHT && move.rangedCapture === true) ||
    (pieceToMove.type !== PieceType.MIRROR && move.rotation !== null)
    )  
  }

  private getSpecificMove(move: MoveCommand, playerId: number): Partial<Move> {
    if (!this.isMoveCommandLegal(move, playerId)) {
      throw new IllegalMoveError(`This MoveCommand is illegal with playerId equal to ${playerId}`);
    }

    const pieceToMove: Piece = this.getPiece(move.origin)!;

    if (move.rangedCapture === true) {
      for (const predictedMove of pieceToMove.movement.legalMoves) {
        if (Syntax.inAlternative(predictedMove.moveType!, MoveType.RangedCapture) && move.destination === predictedMove.destination) {
          return predictedMove;
        }
      }
    }

    if (move.rotation !== null) {
      for (const predictedMove of pieceToMove.movement.legalMoves) {
        if (move.rotation === predictedMove.rotation) {
          return predictedMove;
        }
      }
    }

    if (move.destination !== null) {
      for (const predictedMove of pieceToMove.movement.legalMoves) {
        if (move.destination === predictedMove.destination) {
          return predictedMove;
        }
      }
    }

    throw new IllegalMoveError("Unable to perform such move.");
  }

  private buildMove(piece: Piece, pieceMove: Partial<Move>, moveOrder: MoveCommand, promotedTo?: PieceType): Move {
    const ultimateMove: Move = {
      destination: pieceMove.destination ?? null,
      moveType: pieceMove.moveType!,
      rotation: pieceMove.rotation ?? null,
      origin: piece.position,
      piece: piece,
      promotedTo: promotedTo ?? null,
      captured: null,
      laserFields: [new Set<String>, new Set<String>],
      laserCaptures: new Set<String>
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
    // Laser Fields, Laser Captures, and Check Manager flags should be set here
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
      this.removePiece(captured);
    }

    if (Syntax.inAlternative(typesOfMove, MoveType.Move)) {
      const pieceToMove: Piece = move.piece;
      this.shiftPiece(move.origin, move.destination!);
    }
    //TODO Laser Fields and other Move Types
  }

  public move(move: MoveCommand, playerId: number, promotionTo?: PieceType): void {
    const moveFromPiece: Partial<Move> = this.getSpecificMove(move, playerId);

    if (Syntax.inAlternative(moveFromPiece.moveType!, MoveType.Promotion) && promotionTo === undefined) {
      // Return some data, that would tell gui, that selected move is legal,
      // but it needs to send PieceType in promotionTo.
    }

    const pieceToMove: Piece  = this.getPiece(move.origin)!;
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