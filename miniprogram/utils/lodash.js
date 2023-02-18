export const isString = (value) => {
  return (
    typeof value == "string" ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag)
  );
};

export const isUndefined = (value) => {
  return value === undefined;
};

export const isNull = (value) => {
  return value === null;
};

export const get = (source, path, defaultValue = undefined) => {
    // a[3].b -> a.3.b
    const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
    let result = source
    for (const p of paths) {
      result = Object(result)[p]
      if (result === undefined) {
        return defaultValue
      }
    }
    return result
  }