import fetch from 'node-fetch';

const SERVER = 'http://localhost:5000/api';

async function main() {
  try {
    const registerRes = await fetch(`${SERVER}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'testuser3@example.com', password: 'Password123' }),
    });
    const registerJson = await registerRes.json();
    console.log('register:', registerJson);

    const loginRes = await fetch(`${SERVER}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser3@example.com', password: 'Password123' }),
    });
    const loginJson = await loginRes.json();
    console.log('login:', loginJson);
    const token = loginJson.data?.token || loginJson.token;

    const startRes = await fetch(`${SERVER}/interview/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: 'Frontend Developer', resumeText: 'Experienced React developer.', totalQuestions: 5 }),
    });
    const startJson = await startRes.json();
    console.log('start interview status', startRes.status);
    console.log('start interview body', startJson);
  } catch (error) {
    console.error('ERROR', error);
  }
}

main();
