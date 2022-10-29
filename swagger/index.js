const swaggerAutogen = require('swagger-autogen')();
const { join } = require('path');

const outputFile = join(__dirname, 'output.json');
const endpointsFiles = [join(__dirname, '..', 'app.js')];
const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(({ success }) => {
  console.log(`Generated: ${success}`);
});
