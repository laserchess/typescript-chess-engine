// export function extractSubtype<T>(properties: Record<keyof T, any>) {
//   return function <TActual extends T>(value: TActual) {
//     let result = {} as T;
//     for (const property of Object.keys(properties) as Array<keyof T>) {
//       result[property] = value[property];
//     }

//     return result;
//   }
// }

// export function deepCopy(obj: unknown): Object {

//   // Handle the 3 simple types, and null or undefined
//   if (null == obj || "object" != typeof obj) {
//     return obj;
//   } 

//   // Handle Date
//   if (obj instanceof Date) {
//     const copy: Date = new Date();
//     copy.setTime(obj.getTime());
//     return copy;
//   }

//   // Handle Array
//   if (obj instanceof Array) {
//     const copy: Array<unknown> = [];
//     for (let i = 0, len = obj.length; i < len; i++) {
//       copy[i] = deepCopy(obj[i]);
//     }
//     return copy;
//   }

//   // Handle object
//   if (typeof obj === "object") {
//     const copy: typeof obj = {};
//     for (const property in obj) {
//       if (!(property in obj)) {
//         continue;
//       }
//       copy[property] = deepCopy(obj[property as typeof keyof obj]);
//     }
//     return copy;
//   }

//   throw new Error("Unable to copy obj! Its type isn't supported.");
// }
