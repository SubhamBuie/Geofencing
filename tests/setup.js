const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer = null;

before(async function () {
  this.timeout(120000);

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log('Mock database created and connected...');
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('Mock database disonnected and destroyed...');
});
