import { Direction, DirectionUtils } from "@lc/geometry";
import { Integer } from "@lc/utils";
import { Board } from "@lc/core";

/**
 * Enum that represents possible symmetry transformation
 * types for class {@linkcode Vector2d} and its subclasses.
 * 
 * @enum {number}
 */
export const enum Symmetry {
  Origin = 0,
  XAxis = 1,
  YAxis = 2,
  None = 3
}

/**
 * Class `Vector2d` represents any 2-dimensional vector
 * with floating point coordinates. Objects created with
 * `Vector2d` class and its subclasses are meant to be immutable.
 */
export class Vector2d {
  /**
   * Represents first coordinate of `Vector2d` object and 
   * its subclasses.
   */
  public readonly x: number;

  /**
   * Represents second coordinate of `Vector2d` object and 
   * its subclasses.
   */
  public readonly y: number;
  public l = Vector2d

  /**
   * Basic constructor that allows to create new `Vector2d` object.
   * @param {number} x - Any number to be first coordinate.
   * @param {number} y - Any number to be second coordinate.
   */
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Method creates and returns new `Vector2d` object. It is used by every
   * method that creates new vector and is meant to be
   * overriden in subclass to return subclass's object. 
   * It has to be done in order to ensure that subclass
   * will return its instance and not superclass instance.
   * 
   * @summary Method creates new `Vector2d` object. Should be overriden by
   * subclass to return its instance.
   * @param {number} x - `number` that is ment to be first coordinate.
   * @param {number} y - `number` that is ment to be second coordinate.
   * @returns {Vector2d}  New `Vector2d` object created with given coordinates.
   */
  protected createVector(x: number, y: number): Vector2d {
    return new Vector2d(x, y);
  }


  /**
   * Method returns `string` representation that consists of two numbers
   * separated by comma and space, for example "2, 3".
   * 
   * @returns {string} `string` representation of vector
   */
  public toString() {
    return this.x + ", " + this.y;
  }

  /**
   * Method returns tuple that represents `Vector2d` object
   * , first element of tuple if first coordinate, second element
   * is second coordinate.
   * @returns {[number, number]} Tuple representation of `Vector2d`
   */
  public toTuple(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Method creates new `Vector2d` object from tuple.
   * first element of tuple if first coordinate, second element
   * is second coordinate.
   * @param {[number, number]} coordinates Tuple of numbers to be used for coordinates.
   * @returns New `Vector2d` object created from `coordinates`.
   */
  public static fromTuple(coordinates: [number, number]): Vector2d {
    return new Vector2d(coordinates[0], coordinates[1]);
  }

  /**
   * Method checks if two objects are equal.
   * 
   * @param {unknown} other - any object to be compared with calling object.
   * @returns {boolean} true if calling object is the same type and its
   * fields have the same value, otherwise false.
   */
  public equals(other: unknown): boolean {
    if (!(other instanceof Vector2d)) {
      return false;
    }
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Method performs adding operation of two `Vector2d` objects.
   * @param {Vector2d} other - `Vector2d` object to be added to calling object of `Vector2d`.
   * @returns {Vector2d}  New `Vector2d` object created by addition of two `Vector2d` objects.
   */
  public add(other: Vector2d): typeof this {
    return this.createVector(this.x + other.x, this.y + other.y) as typeof this;
  }

  /**
   * Method performs substracting operation of two `Vector2d` objects.
   * @param {Vector2d} other - `Vector2d` object to be substracted from calling object of `Vector2d`.
   * @returns {Vector2d}  New `Vector2d` object created by substraction of two `Vector2d` objects.
   */
  public sub(other: Vector2d): typeof this {
    return this.createVector(this.x - other.x, this.y - other.y) as typeof this;
  }

  /**
   * Method performs multiplying operation of two `Vector2d` objects,
   * or one `Vector2d` object and `number` scalar. By multiplication of two
   * `Vector2d` objects, we mean that first coordinate of new `Vector2d` object
   * is equal to multiplication of first coordinates of calling object and passed 
   * `Vector2d` object. Second coordinate is equal to multiplication of second coordinates
   * of calling object and passed `Vector2d` object. Muliplying vectors
   * by scalars is discussed {@link https://en.wikipedia.org/wiki/Scalar_multiplication here}.
   * 
   * @summary Method multiplies two `Vector2d` objects or one `Vector2d` object and one number. 
   * @param {Vector2d | number} other - `Vector2d` object to be multiplied by calling object,
   * or `number` to be multiplied by calling object.
   * @returns {Vector2d} - New `Vector2d` object created by substraction of two `Vector2d` objects, or `Vector2d`
   * object and `number`. 
   */
  public mul(other: Vector2d | number): typeof this {
    if (other instanceof Vector2d) {
      return this.createVector(this.x * other.x, this.y * other.y) as typeof this;
    }
    return this.createVector(this.x * other, this.y * other) as typeof this;
  }
  /**
   * Method performs dividing operation of two `Vector2d` objects,
   * or one `Vector2d` object and `number` scalar. By division of two
   * `Vector2d` objects, we mean that first coordinate of new `Vector2d` object
   * is equal to division of first coordinates of calling object and passed 
   * `Vector2d` object. Second coordinate is equal to division of second coordinates
   * of calling object and passed `Vector2d` object. Dividing vectors by scalars is discused
   * {@link https://en.wikipedia.org/wiki/Scalar_multiplication here}.
   * This method throws Error if at least one coordinate of `other` is 0, or
   * `other` is equal to 0. 
   * 
   * @summary Method divides two `Vector2d` objects or one `Vector2d` object and one number. 
   * @param {Vector2d | number} other - `Vector2d` object to be divider of calling object,
   * or `number` to be divider of calling object.
   * @returns {Vector2d} - New `Vector2d` object created by division of two `Vector2d` objects, or `Vector2d`
   * object and `number`.
   */
  public div(other: Vector2d | number): typeof this {
    if (other instanceof Vector2d) {
      if (other.x == 0) {
        throw new Error("First (x) coordinate of divider vector is equal to 0.");
      }
      if (other.y == 0) {
        throw new Error("Second (y) coordinate of divider vector is equal to 0.");
      }
      return this.createVector(this.x / other.x, this.y / other.y) as typeof this;
    }
    if (other === 0) {
      throw new Error("Divider is equal to 0");
    }
    return this.createVector(this.x / other, this.y / other) as typeof this;
  }
  /**
   * Method returns `Vector2d` object opposite to calling object.
   * Multiplying `Vector2d` object by `-1` (by using {@linkcode Vector2d.mul}) we can obtain the same effect.
   * 
   * @returns  New `Vector2d` object created by negating calling object coordinates.
   */
  public opposite(): typeof this {
    return this.createVector(-this.x, -this.y) as typeof this;
  }

  /**
   * Method creates and returns copy of calling object.
   * 
   * @returns  New `Vector2d` object that is copy of calling object.
   */
  public copy(): typeof this {
    return this.createVector(this.x, this.y) as typeof this;
  }

  /**
   * Method creates new, transformed by certain {@linkcode Symmetry}
   * enum, `Vector2d` object based on calling object.
   * Bellow effect of every {@linkcode Symmetry} value is described:
   * - {@linkcode Symmetry.Origin} - effect is the same as {@linkcode Vector2d.opposite}.
   * - {@linkcode Symmetry.XAxis} - negate second coordinate.
   * - {@linkcode Symmetry.YAxis} - negate first coordinate.
   * - {@linkcode Symmetry.None}   - effect is the same as {@linkcode Vector2d.copy}
   * @summary Method returns new trasformed, acorrding to `symmetry`, `Vector2d`.
   * @param {Symmetry} symmetry - {@linkcode Symmetry} enum to be used to create new object.
   * @returns 
   */
  public applySymmetry(symmetry: Symmetry): typeof this {
    switch (symmetry) {
      case Symmetry.Origin:
        return this.opposite();
      case Symmetry.XAxis:
        return this.createVector(this.x, -this.y) as typeof this;
      case Symmetry.YAxis:
        return this.createVector(-this.x, this.y) as typeof this;
      case Symmetry.None:
        return this.copy();
    }
  }

  /**
   * Method creates new `Vector2d` object with swapped coordinates.
   * 
   * @returns New `Vector2d` object with swapped coordinates.
   */
  public reverseAxis(): typeof this {
    return this.createVector(this.y, this.x) as typeof this;
  }

  /**
   * Method returns length of `Vector2d` object.
   * 
   * @returns `Number` that represents length of vector.
   */
  public getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Method creates new `Vector2d` object that is 
   * {@link https://en.wikipedia.org/wiki/Unit_vector unit vector} 
   * of calling object.
   * 
   * @returns `Vector2d` object that is {@link https://en.wikipedia.org/wiki/Unit_vector unit vector}.
   */
  public createUnitVector(): typeof this {
    return this.div(this.getLength());
  }



}



/**
 * Class `IntVector2d`, derived from {@linkcode Vector2d}, represents any 2-dimensional vector
 * with integer coordinates. Objects created with
 * `IntVector2d` class and its subclasses are meant to be immutable.
 */
export class IntVector2d extends Vector2d {
  /**
   * Basic constructor that allows to create new `IntVector2d` object.
   * If floats are passed as parameters in this constructor,
   * then theirs decimal part will be truncated. This constructor
   * makes sure that every new `IntVector2d` object and its subclasses' objects
   * have integer coordinates.
   * @param {number} x - Integer to be first coordinate.
   * @param {number} y - Integer to be second coordinate.
   */
  public constructor(x: number, y: number) {
    super(Integer.create(x), Integer.create(y))
  }

  /**
   * Method creates and returns new `IntVector2d` object. It is used by every
   * method that creates new vector and is meant to be
   * overriden in subclass to return subclass's object. 
   * It has to be done in order to ensure that subclass
   * will return its instance and not superclass instance.
   * 
   * @param {number} x - `number` that is ment to be first coordinate.
   * @param {number} y - `number` that is ment to be second coordinate.
   * @returns {IntVector2d}  New `IntVector2d` object created with given coordinates.
   */
  protected createVector(x: number, y: number): IntVector2d {
    return new IntVector2d(x, y);
  }

  /**
   * Method creates and returns copy of calling object.
   * 
   * @returns  New `IntVector2d` object that is copy of calling object.
   */
  public copy(): typeof this {
    return this.createVector(this.x, this.y) as typeof this
  }

  /**
 * Method creates new `IntVector2d` object from tuple.
 * first element of tuple if first coordinate, second element
 * is second coordinate.
 * @param {[number, number]} coordinates Tuple of numbers to be used for coordinates.
 * @returns New `IntVector2d` object created from `coordinates`.
 */
  public static fromTuple(coordinates: [number, number]): IntVector2d {
    return new IntVector2d(coordinates[0], coordinates[1]);
  }

  /**
   * Method checks if two objects are equal.
   * 
   * @param {unknown} other - any object to be compared with calling object.
   * @returns {boolean}  true if calling object is the same type and its
   * fields have the same value, otherwise false.
   */
  public equals(other: unknown): boolean {
    if (!(other instanceof IntVector2d)) {
      return false;
    }
    return this.x == other.x && this.y == other.y;
  }

  /**
 * Method creates new `IntVector2d` object that is 
 * {@link https://en.wikipedia.org/wiki/Unit_vector unit vector} 
 * of calling object. This method differs from {@link Vector2d.createUnitVector},
 * as it creates new `IntVector2d` with one coordinate equal to 0, and one equal
 * to -1 or 1. In most cases, new object have certain coordinate equal to 1 or -1, if this
 * coordinate had greater absolute value than other coordinate of calling object.
 * If absolute values of both coordinates of calling object are equal, then
 * `prioritizeAxisY` decides which coordinate is more important(, by default
 * more important is x axis).
 * 
 * @summary Method creates new `IntVector2d` object that is 
 * {@link https://en.wikipedia.org/wiki/Unit_vector unit vector} 
 * of calling object.
 * @param {boolean} prioritizeAxisY - bool value that decides which axis should be considered
 * as more important, when absolute value of coordinates is equal.
 * @returns `IntVector2d` object that is {@link https://en.wikipedia.org/wiki/Unit_vector unit vector}.
 */
  public createUnitVector(prioritizeAxisY?: boolean): typeof this {
    if (Math.abs(this.x) === Math.abs(this.y)) {
      if (prioritizeAxisY !== undefined || prioritizeAxisY === true) {
        return this.createVector(0, Math.sign(this.y)) as typeof this;
      }
      return this.createVector(Math.sign(this.x), 0) as typeof this;
    }
    if (Math.abs(this.x) > Math.abs(this.y)) {
      return this.createVector(Math.sign(this.x), 0) as typeof this;
    }
    return this.createVector(0, Math.sign(this.y)) as typeof this;
  }
}

/**
 * Class `BoardVector2d`, derived from {@linkcode IntVector2d}, represents any 2-dimensional vector
 * with integer coordinates. It is designed to be used for representing coordinates of chess board tiles,
 * as it contans several usefull methods.
 * Objects created with`BoardVector2d` class and its subclasses are meant to be immutable.
 */
export class BoardVector2d extends IntVector2d {
  /**
   * Method creates and returns new `BoardVector2d` object. It is used by every
   * method that creates new vector is meant to be
   * overriden in subclass to return subclass's object. 
   * It has to be done in order to ensure that subclass
   * will return its instance not superclass instance.
   * 
   * @param {number} x - `number` that is ment to be first coordinate.
   * @param {number} y - `number` that is ment to be second coordinate.
   * @returns {IntVector2d}  New `BoardVector2d` object created with given coordinates.
   */
  protected createVector(x: number, y: number): BoardVector2d {
    return new BoardVector2d(x, y);
  }

  /**
   * Method creates new `BoardVector2d` object from any class, that derives from 
   * {@linkcode Vector2d}, object. 
   * 
   * @param {Vector2d} vector - Any {@linkcode Vector2d} or its subclass object to create new `BoardVector2d` object on its basis. 
   * @returns {BoardVector2d}  New `BoardVector2d` created from `vector`.
   */
  public static fromVector2d(vector: Vector2d): BoardVector2d {
    return new BoardVector2d(vector.x, vector.y);
  }

  /**
   * Method creates new `BoardVector2d` object from two-character `string`.
   * First characted should be a letter of ASCII table, with code greater or
   * equal to 97 ("a"). Second character should be any digit, excluding 0.
   * If we consider only classic chess range of first character should be in
   * interval ["a", "h"] and second should be integer in [1, 8].
   * First character is translated to first coordinate in such way 
   * that "a" -> 0, "b" -> 1 ... and so on. Second character is translated to second
   * coordinate by substracting -1 from it after parsing it to `number`.
   * Reverse process is performed by {@linkcode BoardVector2d.toString}.
   * This method returns `Error` if `vectorString` length is not equal to 2.
   * 
   * @summary Method creates new `BoardVector2d` from two-character string.
   * @param {string} vectorString - Any {@linkcode Vector2d} or its subclass object to create new `BoardVector2d` object on its basis. 
   * @returns {BoardVector2d}  New `BoardVector2d` created from `vector`.
   */
  public static fromString(vectorString: string): BoardVector2d {
    if (vectorString.length != 2) {
      throw new Error("Vector string is invalid [fromString()]");
    }
    return new BoardVector2d(vectorString.charCodeAt(0) - 97, vectorString.charCodeAt(1) - 1);
  }

  /**
   * Method creates one-character `string` from first coordinate in such way that
   * 0 -> "a", 1 -> "b"... and so on. 
   * 
   * @returns {string}  One-character `string` that represents first coordinate of `BoardVector2d`.
   */
  public xToString(): string {
    return String.fromCharCode(this.x + 97);
  }

  /**
   * Method creates one-character `string` from second coordinate by adding
   * 1 to it. 
   * 
   * @returns {string}  One-character `string` that represents second coordinate of `BoardVector2d`.
   */
  public yToString(): string {
    return (this.y + 1).toString();
  }

  /**
   * Method returns `string` representation that consists of two characters.
   * First one is a letter and second one is a digit. Reverse proces is performed 
   * by {@linkcode BoardVector2d.fromString}.
   * 
   * @returns {string}  `string` representation of vector
   */
  public toString(): string {
    return this.xToString() + this.yToString();
  }

  /**
   * Method checks if two objects are equal.
   * 
   * @param {unknown} other - any object to be compared with calling object.
   * @returns {boolean}  true if calling object is the same type and its
   * fields have the same value, otherwise false.
   */
  public equals(other: unknown): boolean {
    if (!(other instanceof BoardVector2d)) {
      return false;
    }
    return this.x == other.x && this.y == other.y;
  }

  /**
   * Method creates and returns copy of calling object.
   * 
   * @returns  New `BoardVector2d` object that is copy of calling object.
   */
  public copy(): typeof this {
    return this.createVector(this.x, this.y) as typeof this;
  }

  /**
   * Method creates new `BoardVector2d` object from tuple.
   * first element of tuple if first coordinate, second element
   * is second coordinate.
   * @param {[number, number]} coordinates Tuple of numbers to be used for coordinates.
   * @returns New `BoardVector2d` object created from `coordinates`.
   */
  public static fromTuple(coordinates: [number, number]): BoardVector2d {
    return new BoardVector2d(coordinates[0], coordinates[1]);
  }

  /**
   * Method creates array of `BoardVector2d` objects. First element of this array is copy of calling
   * object. Following objects are created by adding multiples of `increment` values to calling object.
   * 
   * @param {[number, number]} increment Tuple consisting of two integers that inform about direction
   * in which new `BoardVector2d` should be propagated.
   * @param board Instance of `Board` which sets up boundaries for moving.
   * @returns Array of `BoardVector2d` created from calling object with direction given by `increment`.
   */
  public getDirectedMoveFromTuple(increment: [number, number], board: Board): BoardVector2d[] {
    const x: number = increment[0];
    const y: number = increment[1];
    if (x === 0 && y === 0) {
      throw new Error("Increment tuple must be different than (0, 0)");
    }

    const xCoordinates: number[] = [];
    const yCoordinates: number[] = [];
    if (x !== 0) {
      for (let i = this.x; x > 0 ? i < board.width : i > -1; i += x) {
        xCoordinates.push(i);
      }
    }
    if (y !== 0) {
      for (let i = this.y; y > 0 ? i < board.width : i > -1; i += y) {
        yCoordinates.push(i);
      }
    }
    if (x === 0) {
      for (let i = 0; i < yCoordinates.length; i++) {
        xCoordinates.push(this.x);
      }
    }
    if (y === 0) {
      for (let i = 0; i < xCoordinates.length; i++) {
        yCoordinates.push(this.y);
      }
    }

    const moves: BoardVector2d[] = [];
    const length: number = Math.min(xCoordinates.length, yCoordinates.length);
    for (let i = 0; i < length; i++) {
      moves.push(new BoardVector2d(xCoordinates[i], yCoordinates[i]));
    }

    return moves;
  }
  /**
   * Method works the same as {@link BoardVector2d.getDirectedMoveFromTuple}, but accepts `Direction`
   * enum instead of tuple of `numbers`.
   * @param {Direction} direction `Direction` enum that indicates direction in which new `BoardVector2d` 
   * should be propagated.
   * @param {Board} board Instance of `Board` which sets up boundaries for moving.
   * @returns 
   */
  public getSqares(direction: Direction, board: Board): BoardVector2d[] {
    return this.getDirectedMoveFromTuple(DirectionUtils.toTuple(direction), board);
  }
}
