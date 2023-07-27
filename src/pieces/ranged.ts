import { BoardVector2d } from "geometry";
import { Piece } from "./piece.js";

class RangedMovement /** extends PieceMovement */ {
    constructor(ranged: Piece) {

    }

    public iterate_squares(origin: BoardVector2d) {

    }

    public getAllMoves(): BoardVector2d[][] {
        return [];
    }

    public getLegalMoves(): BoardVector2d[][] {
        return [];
    }


}

class RangedPiece extends Piece {

}
