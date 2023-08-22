

export namespace ObjectsUtilities {

  // export function extractSubtype<T>(properties: Record<keyof T, any>) {
  //   return function <TActual extends T>(value: TActual) {
  //     let result = {} as T;
  //     for (const property of Object.keys(properties) as Array<keyof T>) {
  //       result[property] = value[property];
  //     }

  //     return result;
  //   }
  // }

  export function objectDeepcopy(object: Object): Object {

    // Handle the 3 simple types, and null or undefined
    if (null == object || "object" != typeof object) {
      return object;
    } 

    // Handle Date
    if (object instanceof Date) {
      let copy: Date = new Date();
      copy.setTime(object.getTime());
      return copy;
    }

    // Handle Array
    if (object instanceof Array) {
      let copy: Array<any> = [];
      for (var i = 0, len = object.length; i < len; i++) {
        copy[i] = objectDeepcopy(object[i]);
      }
      return copy;
    }

    // Handle Object
    if (object instanceof Object) {
      let copy: Object = {};
      for (var attr in object) {
        let attrCasted: keyof Object = attr as keyof Object;
        if (object.hasOwnProperty(attr)) {
          copy[attrCasted] = objectDeepcopy(object[attrCasted]) as any;
        }
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

}

