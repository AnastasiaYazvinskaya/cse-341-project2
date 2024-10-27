const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Orders API',
    description: 'Orders API',
  },
  host: 'localhost:3001',
  schemes: ['http', 'https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);