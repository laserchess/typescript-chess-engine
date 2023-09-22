import { Board, MoveCommand } from "@lc/core";

export class Game {
  private _currentPlayer: number;
  private _board?: Board;

  public constructor() {
    this._currentPlayer = 0;
  }

  public set board(board: Board) {
    this._board = board;
  }

  public get board(): Board {
    if (this._board === undefined) {
      throw new Error("Board is undefined.");
    }
    return this._board;
  }

  public get currentPlayer(): number {
    return this._currentPlayer;
  }

  public static getEnemyId(playerId: number) {
    return (playerId + 1) % 2;
  }

  public move(move: MoveCommand): void {
    this.board.move(move, this._currentPlayer);
    this._currentPlayer = Game.getEnemyId(this._currentPlayer);
  }

}