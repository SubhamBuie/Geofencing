const { isEmptyArray, isEmptyObject } = require('../utils/common');
const _ = require('lodash');

const validate = (reqBody, requiredFields) => {
  if (!isEmptyObject(reqBody) && !isEmptyArray(requiredFields)) {
    const elementsNotIn = _.difference(requiredFields, Object.keys(reqBody));
    return elementsNotIn;
  }
};

module.exports = { validate };
