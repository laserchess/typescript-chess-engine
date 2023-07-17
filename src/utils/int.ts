/**
 * Branded type that represents integer. Used
 * mainly to prevent assignment of `number` type,
 * that can be float, to `int`.
 */
export type int = number & { __int__: void };

/**
 * Namespace containing functions connected with
 * {@linkcode int}.
 * @namespace
 */
export namespace Integer {

  /**
   * Function that creates `int` from any number.
   * 
   * @param {number} num - Number to be converted to {@linkcode int}.
   * If it has any decimal part it will be truncated.
   * @returns {int}  Number converted to {@linkcode int}.
   */
  export function create(num: number): int {
    return Math.trunc(num) as int;
  }

  /**
   * Function that parses string and creates {@linkcode int} from it.
   * 
   * @param {string} value - `string` to be parsed.
   * @returns {int} {@linkcode int} ` created from `string`.
   */
  export function toint(value: string): int {
    return Number.parseInt(value) as int;
  };
  
  /**
   * Function that checks if `number` is integer.
   * It is type guard function.
   * 
   * @param {number} num  Number to be checked if it is an integer.
   * @returns {boolean} True if number is integer, false otherwise.
   */
  export function checkIsInt(num: number): num is int {
    return num % 1 === 0;
  }

/**
 * Function asserts that passed `number` is integer.
 * Throws errors if {@linkcode checkIsInt} returns false.
 * 
 * @param {number} num Number to be asserted.
 * @returns {int} The same number but as {@linkcode int}
 */

  export function assertAsInt(num: number): int {
    try {
      if (checkIsInt(num)) {
        return num;
      }
    } catch (err) {
      throw new Error(`Invalid int value (error): ${num}`);
    }

    throw new Error(`Invalid int value: ${num}`);
  };
}
