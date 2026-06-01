import http from 'k6/http';

export const options = {
  vus: 2,
  duration: '30s'
};

export default function () {

  const random = Math.floor(Math.random() * 1000000);

  const payload = JSON.stringify({
    dni: `7${random}`,
    full_name: `Usuario ${random}`,
    birth_date: '2000-01-01',
    email: `test${random}@gmail.com`,
    password: 'Password123'
  });

  http.post(
    'https://nexa-vote-back.onrender.com/register/identity',
    payload,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}