export const isString = (value) => {
  return (
    typeof value == "string"
  );
};

export const isUndefined = (value) => {
  return value === undefined;
};

export const isNull = (value) => {
  return value === null;
};

export const get = (source, path, defaultValue = undefined) => {
    console.log({
        source, path, defaultValue,
    })
    // a[3].b -> a.3.b
    // const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
    const paths = path
    let result = source
    for (const p of paths) {
      result = Object(result)[p]
      if (result === undefined) {
        return defaultValue
      }
    }
    return result
  }