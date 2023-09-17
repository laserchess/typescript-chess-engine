
/**
 * Module containing functions connected that facilates
 * simulation of numbers of integer type.
 */

import { Board } from "core/Board.js";
import { BoardVector2d } from "geometry/Vector2d.js";
import { King } from "pieces/King.js";

/**
 * Function that creates `number` from any number.
 * 
 * @param {number} num - Number to be transformed to integer.
 * If it has any decimal part it will be truncated.
 * @returns {number}  Number transformed to `number`.
 */
export function create(num: number): number {
  return Math.trunc(num);
}

/**
 * Function that parses string and creates `number` from it.
 * 
 * @param {string} value - `string` to be parsed.
 * @returns {number}  `number` created from `string`.
 */
export function toInt(value: string): number {
  return Number.parseInt(value);
}

/**
 * Function that checks if `number` is integer.
 * It is type guard function.
 * 
 * @param {number} num  Number to be checked if it is an integer.
 * @returns {boolean} True if number is integer, false otherwise.
 */
export function checkIsInt(num: number): boolean {
  return num % 1 === 0;
}
