export type int = number & { __int__: void };

export namespace Integer {
  export function create(num: number): int {
    return Math.floor(num) as int;
  }

  export function toint(value: string): int {
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
}
