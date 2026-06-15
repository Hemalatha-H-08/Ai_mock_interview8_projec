import { startInterview } from './src/services/interview.service.js';

startInterview('test-user', 'frontend developer', 'Experienced developer with React and Node.js', 'Test User', 5)
  .then((result) => {
    console.log('RESULT', result);
  })
  .catch((err) => {
    console.error('ERROR', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  });
