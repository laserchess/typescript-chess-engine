import { Int } from "./int.js";

enum Symmetry{
    ORIGIN = 0,
    X_AXIS = 1,
    Y_AXIS = 2
}


export class Vector2d<Type extends number | Int>{
    protected x: Type;
    protected y: Type;

    public constructor(x: Type, y: Type){
        this.x = x;
        this.y = y;
    }

    public getX(){
        return this.x;
    }

    public getY(){
        return this.y;
    }

    public toString(){
        return this.x+", "+this.y;
    }

    public equals(other: unknown): boolean{
        if(!(other instanceof Vector2d)){
            return false;
        }
        return this.x == other.x && this.y == other.y;
    }

    public add(other: Vector2d<Type>): Vector2d<Type>{
        return new Vector2d<Type>((this.x + other.x) as Type, (this.y + other.y) as Type);

    }

    public sub(other: Vector2d<Type>): Vector2d<Type>{
        return new Vector2d<Type>((this.x - other.x) as Type, (this.y - other.y) as Type);
    }

    public mul(other: Vector2d<Type> | number): Vector2d<Type>{
        if(other instanceof Vector2d){
            return new Vector2d<Type>((this.x * other.x) as Type, (this.y * other.y) as Type);
        }
        return new Vector2d<Type>((this.x * other) as Type, (this.y * other) as Type);
    }

    public div(other: Vector2d<Type> | number): Vector2d<Type>{
        if(other instanceof Vector2d){
            return new Vector2d<Type>((this.x / other.x) as Type, (this.y / other.y) as Type);
        }
        return new Vector2d<Type>((this.x / other) as Type, (this.y / other) as Type);
    }

    public opposite(): Vector2d<Type>{
        return new Vector2d<Type>(-this.x as Type, -this.y as Type);
    }

    public reverseAxis(): Vector2d<Type>{
        return new Vector2d<Type>(this.y, this.x)
    }

    public copy(): Vector2d<Type>{
        return new Vector2d<Type>(this.x, this.y)
    }

    public pivotSymmetry(symmetry: Symmetry): Vector2d<Type>{
        switch(symmetry){
            case Symmetry.ORIGIN:
                return this.opposite();
            case Symmetry.X_AXIS:
                return new Vector2d<Type>(this.x, -this.y as Type);
            case Symmetry.Y_AXIS:
                return new Vector2d<Type>(-this.y as Type, this.x);
        }
    }
}

export class BoardVector2d extends Vector2d<Int>{

    public static fromVector2d(vector: Vector2d<Int>): BoardVector2d{
        return new BoardVector2d(vector.getX(), vector.getY());
    }

    public static fromString(vectorString: string): BoardVector2d{
        if(vectorString.length != 2){
            throw new Error("Vector string is invalid [fromString()]");
        }
        return new BoardVector2d((vectorString.charCodeAt(0)-97) as Int,(vectorString.charCodeAt(1)-1) as Int);
    }

    public xToString(): string{
        return String.fromCharCode(this.x + 97);
    }

    public yToString(): string{
        return (this.y + 1).toString();
    }

    public toString(): string {
        return this.xToString() + this.yToString();    
    }

    public equals(other: unknown): boolean{
        if(!(other instanceof BoardVector2d)){
            return false;
        }
        return this.x == other.x && this.y == other.y;
    }

    public add(other: BoardVector2d): BoardVector2d{
        return new BoardVector2d((this.x + other.x) as Int, (this.y + other.y) as Int);

    }

    public sub(other: BoardVector2d): BoardVector2d{
        return new BoardVector2d((this.x - other.x) as Int, (this.y - other.y) as Int);
    }

    public mul(other: BoardVector2d | number): BoardVector2d{
        if(other instanceof Vector2d){
            return new BoardVector2d((this.x * other.x) as Int, (this.y * other.y) as Int);
        }
        return new BoardVector2d((this.x * other) as Int, (this.y * other) as Int);
    }

    public div(other: BoardVector2d | number): BoardVector2d{
        if(other instanceof Vector2d){
            return new BoardVector2d((this.x / other.x) as Int, (this.y / other.y) as Int);
        }
        return new BoardVector2d((this.x / other) as Int, (this.y / other) as Int);
    }

    public opposite(): BoardVector2d{
        return new BoardVector2d(-this.x as Int, -this.y as Int);
    }

    public reverseAxis(): BoardVector2d{
        return new BoardVector2d(this.y, this.x)
    }

    public copy(): BoardVector2d{
        return new BoardVector2d(this.x, this.y)
    }

    public pivotSymmetry(symmetry: Symmetry): BoardVector2d{
        switch(symmetry){
            case Symmetry.ORIGIN:
                return this.opposite();
            case Symmetry.X_AXIS:
                return new BoardVector2d(this.x, -this.y as Int);
            case Symmetry.Y_AXIS:
                return new BoardVector2d(-this.y as Int, this.x);
        }
    }
}