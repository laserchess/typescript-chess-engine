import { Integer } from "utils";

/**
 * Enum that represents possible symmetry transformation
 * types for class {@linkcode Vector2d} and its subclasses.
 * 
 * @enum {number}
 */
export enum Symmetry {
  ORIGIN = 0,
  X_AXIS = 1,
  Y_AXIS = 2,
  Y_EQ_X = 3
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
   * @summary Method creates new `Vector2d` object. Shoudl be overriden by
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
    return this.x == other.x && this.y == other.y;
  }

  /**
   * Method performs adding operation of two `Vector2d` objects.
   * @param {Vector2d} other - `Vector2d` object to be added to calling object of `Vector2d`.
   * @returns {Vector2d}  New `Vector2d` object created by addition of two `Vector2d` objects.
   */
  public add(other: Vector2d): Vector2d {
    return this.createVector(this.x + other.x, this.y + other.y);
  }

  /**
   * Method performs substracting operation of two `Vector2d` objects.
   * @param {Vector2d} other - `Vector2d` object to be substracted from calling object of `Vector2d`.
   * @returns {Vector2d}  New `Vector2d` object created by substraction of two `Vector2d` objects.
   */
  public sub(other: Vector2d): Vector2d {
    return this.createVector(this.x - other.x, this.y - other.y);
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
  public mul(other: Vector2d | number): Vector2d {
    if (other instanceof Vector2d) {
      return this.createVector(this.x * other.x, this.y * other.y);
    }
    return this.createVector(this.x * other, this.y * other);
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
  public div(other: Vector2d | number): Vector2d {
    if (other instanceof Vector2d) {
      if (other.x == 0) {
        throw new Error("First (x) coordinate of divider vector is equal to 0.");
      }
      if (other.y == 0) {
        throw new Error("Second (y) coordinate of divider vector is equal to 0.");
      }
      return this.createVector(this.x / other.x, this.y / other.y);
    }
    if (other === 0) {
      throw new Error("Divider is equal to 0");
    }
    return this.createVector(this.x / other, this.y / other);
  }
  /**
   * Method returns `Vector2d` object opposite to calling object.
   * Multiplying `Vector2d` object by `-1` (by using {@linkcode Vector2d.mul}) we can obtain the same effect.
   * 
   * @returns  New `Vector2d` object created by negating calling object coordinates.
   */
  public opposite(): Vector2d {
    return this.createVector(-this.x, -this.y);
  }

  /**
   * Method creates and returns copy of calling object.
   * 
   * @returns  New `Vector2d` object that is copy of calling object.
   */
  public copy(): Vector2d {
    return this.createVector(this.x, this.y);
  }

  /**
   * Method creates new, transformed by certain {@linkcode Symmetry}
   * enum, `Vector2d` object based on calling object.
   * Bellow effect of every {@linkcode Symmetry} value is described:
   * - {@linkcode Symmetry.ORIGIN} - effect is the same as {@linkcode Vector2d.opposite}.
   * - {@linkcode Symmetry.X_AXIS} - negate second coordinate.
   * - {@linkcode Symmetry.Y_AXIS} - negate first coordinate.
   * - {@linkcode Symmetry.Y_EQ_X} - swap coordinates.
   * 
   * @summary Method returns new trasformed, acorrding to `symmetry`, `Vector2d`.
   * @param {Symmetry} symmetry - {@linkcode Symmetry} enum to be used to create new object.
   * @returns 
   */
  public applySymmetry(symmetry: Symmetry): Vector2d {
    switch (symmetry) {
      case Symmetry.ORIGIN:
        return this.opposite();
      case Symmetry.X_AXIS:
        return this.createVector(this.x, -this.y);
      case Symmetry.Y_AXIS:
        return this.createVector(-this.x, this.y);
      case Symmetry.Y_EQ_X:
        return this.createVector(this.y, this.x);
    }
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
  public copy(): IntVector2d {
    return new IntVector2d(this.x, this.y)
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
  public copy(): BoardVector2d {
    return new BoardVector2d(this.x, this.y)
  }
}