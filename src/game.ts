import { Board } from "core/Board.js";
import { Rotation } from "geometry/Direction.js";
import { BoardVector2d } from "geometry/Vector2d.js";

export interface MoveOrder {
  origin: BoardVector2d,
  destination: BoardVector2d | null,
  fireLaser: boolean,
  rotation: Rotation | null,
  rangedCapture: boolean,
}



export class Game {
  private _currentPlayer: number;
  private _board?: Board;

  public constructor(){
    this._currentPlayer = 0;
  }

  public set board(board: Board){
    this._board = board;
  }

  public get currentPlayer(): number {
    return this._currentPlayer;
  }

  public static getEnemyId(playerId: number) {
    return (playerId + 1) % 2;
  }

  public move(move: MoveOrder): void {
    this._board!.move(move, this._currentPlayer);
    this._currentPlayer = Game.getEnemyId(this._currentPlayer);
  }

}