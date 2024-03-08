const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { signup } = require('../controllers/auth');
const UserModel = require('../models/userModel');
chai.use(chaiAsPromised);
const { expect } = chai;
// beforeEach(async () => {
// await UserModel.create({
//   uuid: 'd5584db5-4d08-41fa-9826-47dcdfe07645',
//   fullName: 'John Doe',
//   email: 'john_doe@example.com',
//   password: '123456',
// });
// await UserModel.create({
//   uuid: 'b0ca1c4e-a49d-464d-bb9f-91173476e684',
//   fullName: 'Foo Bar',
//   email: 'foo_bar@example.com',
//   password: '123456',
// });
// });
afterEach(async () => {
  await UserModel.deleteMany({});
});
describe('Auth Controller Functions', () => {
  describe('signup', () => {
    it('should signup successfully', async () => {
      const signupData = {
        firstName: 'Subham',
        lastName: 'Malgope',
        lat: 22.5610068,
        long: 88.4169996,
      };
      const result = await signup(signupData);
      expect(result.status).to.equal(201);
      expect(result.data);
      expect(result.data).to.have.property('firstName').equal('Subham');
    });
  });
});
