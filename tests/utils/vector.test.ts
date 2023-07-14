import {describe, expect, test} from '@jest/globals';
import { int,roundToInt } from 'utils/int';
import { Vector2d } from 'utils/vector2d';

describe("Vector2d",() => {
  test("Adding 2 vectors",() =>{
    expect(new Vector2d<int>(1 as int,roundToInt(1.04) as int).add(new Vector2d<int>(2 as int,2 as int))).toStrictEqual(new Vector2d<int>(3 as int,3 as int))
  })
})