export type int = number & { __int__: void };

export function roundToInt(num: number): int {
  return Math.round(num) as int;
}

export function toInt(value: string): int {
  return Number.parseInt(value) as int;
};

export function checkIsInt(num: number): num is int {
  return num % 1 === 0;
}
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