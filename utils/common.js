const isArray = (value) => Array.isArray(value);

const isObject = (value) =>
  typeof value === 'object' && !Array.isArray(value) && value !== null
    ? true
    : false;

const isEmptyArray = (value) => {
  let isValueArray = isArray(value);
  if (isValueArray && value.length === 0) {
    return true;
  }
  return false;
};

const isEmptyObject = (value) => {
  const isValueObject = isObject(value);

  if (isValueObject && Object.keys(value).length === 0) {
    return true;
  }
  return false;
};

module.exports = { isArray, isEmptyArray, isObject, isEmptyObject };
