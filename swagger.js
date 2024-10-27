const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Orders API',
    description: 'Orders API',
  },
  host: 'cse-341-project2-fr5n.onrender.com',
  schemes: ['https', 'http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);