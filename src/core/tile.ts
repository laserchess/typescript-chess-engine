import { BoardVector2d } from "geometry";
import { Piece } from "pieces";

export const enum MovesPredictionsType {
  ALL = 1 << 0,
  LEGAL = 1 << 1,
  CAPTURABLE  = 1 << 2
}

const enum OperationType {
  ADD,
  DELETE,
  HAS
}

export class Tile {
  
  private _coordinates: BoardVector2d;
  private inMovesAllOf: Set<Piece>[];
  private inMovesLegalOf: Set<Piece>[];
  private inMovesCapturableOf: Set<Piece>[];
  private setHashMap: Map<MovesPredictionsType, Set<Piece>[]>;
  public pieceOnTile?: Piece;
  
  public constructor(coordinates: BoardVector2d) {
    this._coordinates = coordinates;
    this.inMovesAllOf = [new Set<Piece>(), new Set<Piece>()];
    this.inMovesLegalOf = [new Set<Piece>(), new Set<Piece>()];
    this.inMovesCapturableOf = [new Set<Piece>(), new Set<Piece>()];
    this.setHashMap = new Map<MovesPredictionsType, Set<Piece>[]>(
      [
        [MovesPredictionsType.ALL, this.inMovesAllOf],
        [MovesPredictionsType.LEGAL, this.inMovesLegalOf],
        [MovesPredictionsType.CAPTURABLE, this.inMovesCapturableOf],
    ]
    )
  }

  public get coordinates(): BoardVector2d {
    return this._coordinates;
  }
  
  private fulfilSetsOperations(piece: Piece, movePredictionsType: MovesPredictionsType, operation: OperationType): boolean {
    let returnValue: boolean = true;
    for (let item in MovesPredictionsType){
      let movesEnumValue: MovesPredictionsType = MovesPredictionsType[item as keyof typeof MovesPredictionsType]
      if ((movePredictionsType & movesEnumValue) === movesEnumValue) {
        let set: Set<Piece> = this.setHashMap.get(movesEnumValue)![piece.playerId]
        switch(operation){
          case OperationType.ADD:
            set.add(piece);
          break;
          case OperationType.DELETE:
            returnValue = returnValue && set.delete(piece);
          break;
          case OperationType.HAS:
            returnValue = returnValue && set.has(piece);
          break;
        }
      }
    }
    return returnValue;
  }
  
  public addPieceMovesToTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {
    return this.fulfilSetsOperations(piece, movePredictionsType, OperationType.ADD);
  }

  public removePieceMovesFromTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {
    return this.fulfilSetsOperations(piece, movePredictionsType, OperationType.DELETE);
  }

  public checkIfPieceMovesInTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {
    return this.fulfilSetsOperations(piece, movePredictionsType, OperationType.HAS);
  }

  public isPieceMovesEmpty(playerId: number, movePredictionsType: MovesPredictionsType): boolean{
    return this.setHashMap.get(movePredictionsType)![playerId].size === 0; 
  }
}