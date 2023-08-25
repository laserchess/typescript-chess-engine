// export function extractSubtype<T>(properties: Record<keyof T, any>) {
//   return function <TActual extends T>(value: TActual) {
//     let result = {} as T;
//     for (const property of Object.keys(properties) as Array<keyof T>) {
//       result[property] = value[property];
//     }

//     return result;
//   }
// }
export function deepCopy(obj: object): object {
  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof Array) {
    const arrayCopy: unknown[] = [];
    for (let i = 0; i < obj.length; i++) {
      arrayCopy[i] = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i];
    }
    return arrayCopy;
  }

  const objectCopy: Record<string, unknown> = {};
  for (const property in obj) {
    const objectProperty = property as keyof typeof obj;
    objectCopy[property] = typeof obj[objectProperty] === "object" ? deepCopy(obj) : obj[objectProperty];
  }
  return objectCopy;
}
