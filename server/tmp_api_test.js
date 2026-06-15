import fetch from 'node-fetch';
import FormData from 'form-data';
import { readFile } from 'fs/promises';

async function main() {
  try {
    let r = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser2@example.com', password: 'Password123' }),
    });
    let j = await r.json();
    console.log('register', j);

    r = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser2@example.com', password: 'Password123' }),
    });
    const loginJson = await r.json();
    console.log('login', loginJson);

    const token = loginJson.data?.token || loginJson.token;
    if (!token) {
      console.error('no token');
      return;
    }

    const buf = await readFile('dummy.pdf');
    const formData = new FormData();
    formData.append('resume', buf, 'dummy.pdf');

    r = await fetch('http://localhost:5000/api/resume/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const uploadJson = await r.json();
    console.log('upload', uploadJson);
  } catch (error) {
    console.error('err', error);
  }
}

main();