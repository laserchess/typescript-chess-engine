import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";

export enum MovesPredictionsType {
  All        = 1 << 0,
  Legal      = 1 << 1,
  Capturable = 1 << 2
}

export class Tile {
  
  private _coordinates: BoardVector2d;
  private inMovesAllOf: Set<Piece>[];
  private inMovesLegalOf: Set<Piece>[];
  private inMovesCapturableOf: Set<Piece>[];
  private setHashMap: Map<MovesPredictionsType, Set<Piece>[]>;
  public pieceOnTile: Piece | null;
  
  public constructor(coordinates: BoardVector2d) {
    this._coordinates = coordinates;
    this.inMovesAllOf = [new Set<Piece>(), new Set<Piece>()];
    this.inMovesLegalOf = [new Set<Piece>(), new Set<Piece>()];
    this.inMovesCapturableOf = [new Set<Piece>(), new Set<Piece>()];
    this.setHashMap = new Map<MovesPredictionsType, Set<Piece>[]>(
      [
        [MovesPredictionsType.All, this.inMovesAllOf],
        [MovesPredictionsType.Legal, this.inMovesLegalOf],
        [MovesPredictionsType.Capturable, this.inMovesCapturableOf],
    ]
    )
    this.pieceOnTile = null;
  }

  public get coordinates(): BoardVector2d {
    return this._coordinates;
  }
  
  public clearAllPredictions(): void {
    for(let sets of this.setHashMap) {
      sets[1][0].clear();
      sets[1][1].clear();
    }
  }

  public addPieceMovesToTile(piece: Piece, movePredictionsType: MovesPredictionsType): void {
    for (const item in MovesPredictionsType){
      const movesEnumValue: MovesPredictionsType = MovesPredictionsType[item as keyof typeof MovesPredictionsType]
      if ((movePredictionsType & movesEnumValue) === movesEnumValue) {
        this.setHashMap.get(movesEnumValue)![piece.playerId].add(piece);
      }
    }
  }

  public removePieceMovesFromTile(piece: Piece, movePredictionsType: MovesPredictionsType): void {
    for (const item in MovesPredictionsType){
      const movesEnumValue: MovesPredictionsType = MovesPredictionsType[item as keyof typeof MovesPredictionsType]
      if ((movePredictionsType & movesEnumValue) === movesEnumValue) {
        this.setHashMap.get(movesEnumValue)![piece.playerId].delete(piece);
      }
    }
    this.checkIfPieceMovesInTile(piece, MovesPredictionsType.All | MovesPredictionsType.Capturable)
  }

  public checkIfPieceMovesInTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {
    for (const item in MovesPredictionsType){
      const movesEnumValue: MovesPredictionsType = MovesPredictionsType[item as keyof typeof MovesPredictionsType]
      if ((movePredictionsType & movesEnumValue) === movesEnumValue) {
        return this.setHashMap.get(movesEnumValue)![piece.playerId].has(piece);
      }
    }
    return false;
  }

  public isPieceMovesEmpty(playerId: number, movePredictionsType: MovesPredictionsType): boolean{
    return this.setHashMap.get(movePredictionsType)![playerId].size === 0; 
  }

  public getPieceMovesOfTile(playerId: number, movePredictionsType: MovesPredictionsType) {
    let piecesSet: Set<Piece> = new Set<Piece>;
    for (const item in MovesPredictionsType){
      const movesEnumValue: MovesPredictionsType = MovesPredictionsType[item as keyof typeof MovesPredictionsType]
      if ((movePredictionsType & movesEnumValue) === movesEnumValue) {
        piecesSet = new Set([...piecesSet, ...this.setHashMap.get(movesEnumValue)![playerId]])
      }
    }
    return piecesSet;
  }
}