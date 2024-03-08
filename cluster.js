const cluster = require('cluster');
const os = require('os');
const app = require('./app');
const config = require('./config');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const server = app.listen(config.PORT, () => {
    console.log(
      `Worker ${cluster.worker.id} running on port ${config.PORT}...`
    );
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
      process.exit(0);
    });
  });
}
