import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";
import { Syntax } from "@lc/utils";

export const enum MovesPredictionsType {
  Legal      = 1 << 1,
  Illegal    = 1 << 2
}

export class Tile {
  
  private _coordinates: BoardVector2d;
  private inMovesLegalOf: Set<Piece>[];
  private inMovesIllegalOf: Set<Piece>[];
  public pieceOnTile: Piece | null;
  
  public constructor(coordinates: BoardVector2d) {
    this._coordinates = coordinates;
    this.inMovesLegalOf = [new Set<Piece>(), new Set<Piece>()];
    this.inMovesIllegalOf = [new Set<Piece>(), new Set<Piece>()];
    this.pieceOnTile = null;
  }

  public get coordinates(): BoardVector2d {
    return this._coordinates;
  }
  
  public clearAllPredictions(): void {
    for (let i=0;i<1;i++) {
      this.inMovesIllegalOf[i].clear();
      this.inMovesLegalOf[i].clear();
    }
  }

  public addPieceMovesToTile(piece: Piece, movePredictionsType: MovesPredictionsType): void {
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Illegal)) {
      
    }
  }

  public removePieceMovesFromTile(piece: Piece, movePredictionsType: MovesPredictionsType): void {

  }

  public checkIfPieceMovesInTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {

  }

  public isPieceMovesEmpty(playerId: number, movePredictionsType: MovesPredictionsType): boolean{
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