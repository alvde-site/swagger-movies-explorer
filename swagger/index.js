import { join } from 'path';
import swaggerAutogen from 'swagger-autogen';

const outputFile = join(__dirname, 'output.json');
const endpointsFiles = [join(__dirname, '../routes/index.js')];
const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

swaggerAutogen(/* options */)(outputFile, endpointsFiles, doc).then(({ success }) => {
  console.log(`Generated: ${success}`);
});
