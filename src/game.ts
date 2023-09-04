import { Board } from "@lc/core";

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

  public move(/* move: MoveOrder */): void {
    // this._board!.move(move, this._currentPlayer);
    this._currentPlayer = Game.getEnemyId(this._currentPlayer);
  }

}