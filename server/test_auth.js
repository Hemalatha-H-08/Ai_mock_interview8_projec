import axios from 'axios';

(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'testuser2@example.com',
      password: 'secret123',
    });
    console.log('OK', res.status, res.data);
  } catch (e) {
    console.error('ERR status', e.response ? e.response.status : 'none');
    console.error('ERR data', e.response ? e.response.data : e.message);
  }
})();
