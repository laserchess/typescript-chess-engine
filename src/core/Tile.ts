import { BoardVector2d } from "@lc/geometry";
import { Piece } from "@lc/pieces";
import { Syntax } from "@lc/utils";

export const enum MovesPredictionsType {
  Legal = 1 << 1,
  Illegal = 1 << 2
}

export class Tile {

  private _coordinates: BoardVector2d;
  private inMovesLegalOf: [Set<Piece>, Set<Piece>];
  private inMovesIllegalOf: [Set<Piece>, Set<Piece>];
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
    for (let i = 0; i < 1; i++) {
      this.inMovesIllegalOf[i].clear();
      this.inMovesLegalOf[i].clear();
    }
  }

  public addPieceMovesToTile(piece: Piece, movePredictionsType: MovesPredictionsType): void {
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Illegal)) {
      this.inMovesIllegalOf[piece.playerId].add(piece);
    }
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Legal)) {
      this.inMovesLegalOf[piece.playerId].add(piece);
    }
  }

  public removePieceMovesFromTile(piece: Piece, movePredictionsType: MovesPredictionsType): void {
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Illegal)) {
      this.inMovesIllegalOf[piece.playerId].delete(piece);
    }
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Legal)) {
      this.inMovesLegalOf[piece.playerId].delete(piece);
    }
  }

  public checkIfPieceMovesInTile(piece: Piece, movePredictionsType: MovesPredictionsType): boolean {
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Illegal)) {
      return this.inMovesIllegalOf[piece.playerId].has(piece);
    }
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Legal)) {
      return this.inMovesLegalOf[piece.playerId].has(piece);
    }
    return false;
  }

  public isPieceMovesEmpty(playerId: number, movePredictionsType: MovesPredictionsType): boolean {
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Illegal)) {
      return this.inMovesIllegalOf[playerId].size === 0;
    }
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Legal)) {
      return this.inMovesLegalOf[playerId].size === 0;
    }
    return true;
  }

  public getPieceMovesOfTile(playerId: number, movePredictionsType: MovesPredictionsType) {
    let piecesSet: Set<Piece> = new Set<Piece>;
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Illegal)) {
      piecesSet = new Set(this.inMovesIllegalOf[playerId]);
    }
    if (Syntax.inAlternative(movePredictionsType, MovesPredictionsType.Legal)) {
      piecesSet = new Set([...this.inMovesIllegalOf[playerId], ...this.inMovesLegalOf[playerId]]);
    }
    return piecesSet;
  }
}