const UserModel = require('../models/userModel');
const { validate } = require('../utils/validator');
const { isEmptyArray } = require('../utils/common');
const { v4: uuidv4 } = require('uuid');

const signup = async (reqBody) => {
  try {
    const validationArray = validate(reqBody, [
      'firstName',
      'lastName',
      'lat',
      'long',
    ]);
    if (!isEmptyArray(validationArray)) {
      return {
        status: 400,
        data: {
          error: `'${validationArray.toString()}' field(s) required`,
        },
      };
    }
    const { firstName, lastName, lat, long } = reqBody;
    if (
      isNaN(lat) ||
      isNaN(long) ||
      lat < -90 ||
      lat > 90 ||
      long < -180 ||
      long > 180
    ) {
      return {
        status: 400,
        data: {
          error: 'Invalid latitude or longitude values',
        },
      };
    }
    const user = await UserModel.findOne(
      { firstName },
      { uuid: 1, _id: 1 }
    ).lean();
    if (user) {
      return {
        status: 400,
        data: { error: 'User exists' },
      };
    }
    const result = await UserModel.create({
      uuid: uuidv4(),
      firstName,
      lastName,
      lat,
      long,
      location: {
        type: 'Point',
        coordinates: [long, lat],
      },
    });
    if (result) {
      return {
        status: 201,
        data: {
          message: 'User registered successfully',
          uuid: result.uuid,
          firstName: result.firstName,
          lastName: result.lastName,
        },
      };
    }
    return { status: 400, data: { error: 'Something went wrong' } };
  } catch (err) {
    console.log(err.stack);
    return { status: 500, data: { error: err.toString() } };
  }
};
const findGeoUsers = async (reqQuery) => {
  const validationArray = validate(reqQuery, ['lat', 'long', 'radius']);
  if (!isEmptyArray(validationArray)) {
    return {
      status: 400,
      data: {
        error: `'${validationArray.toString()}' field(s) required`,
      },
    };
  }
  const { lat, long, uuid } = reqQuery;
  const radius = parseFloat(reqQuery.radius);
  if (
    isNaN(lat) ||
    isNaN(long) ||
    lat < -90 ||
    lat > 90 ||
    long < -180 ||
    long > 180
  ) {
    return {
      status: 400,
      data: {
        error: 'Invalid latitude or longitude values',
      },
    };
  }
  try {
    const geoQuery = {
      location: {
        $geoWithin: {
          $centerSphere: [[long, lat], radius / 6371000], // earth radius
        },
      },
    };
    if (uuid) {
      geoQuery.uuid = uuid;
    }
    const usersWithinRadius = await UserModel.find(geoQuery, {
      uuid: 1,
      firstName: 1,
      lastName: 1,
      lat: 1,
      long: 1,
    });
    return {
      status: 200,
      data: usersWithinRadius,
    };
  } catch (err) {
    console.log(err.stack);
    return { status: 500, data: { error: err.toString() } };
  }
};
module.exports = { signup, findGeoUsers };
