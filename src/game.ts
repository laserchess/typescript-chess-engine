
export class Game {
  public static getEnemyId(playerId: number) {
    return (playerId + 1) % 2;
  }
}