import { BoardVector2d } from "geometry";
import { Piece } from "pieces";

export const enum MovesPredictionsType {
  All        = 1 << 0,
  Legal      = 1 << 1,
  Capturable = 1 << 2
}

const enum OperationType {
  Add,
  Delete,
  Has
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
        [MovesPredictionsType.All, this.inMovesAllOf],
        [MovesPredictionsType.Legal, this.inMovesLegalOf],
        [MovesPredictionsType.Capturable, this.inMovesCapturableOf],
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
          case OperationType.Add:
            set.add(piece);
          break;
          case OperationType.Delete:
            returnValue = returnValue && set.delete(piece);
          break;
          case OperationType.Has:
            returnValue = returnValue && set.has(piece);
          break;
        }
      }
    }
    return returnValue;
  }
  
  public addPieceMovesToTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {
    return this.fulfilSetsOperations(piece, movePredictionsType, OperationType.Add);
  }

  public removePieceMovesFromTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {
    return this.fulfilSetsOperations(piece, movePredictionsType, OperationType.Delete);
  }

  public checkIfPieceMovesInTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {
    return this.fulfilSetsOperations(piece, movePredictionsType, OperationType.Has);
  }

  public isPieceMovesEmpty(playerId: number, movePredictionsType: MovesPredictionsType): boolean{
    return this.setHashMap.get(movePredictionsType)![playerId].size === 0; 
  }
}