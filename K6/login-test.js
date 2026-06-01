import http from 'k6/http';

export const options = {
  vus: 5,
  duration: '1m'
};

export default function () {

  const payload = JSON.stringify({
    dni: '44276570',
    password: '123456'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  http.post(
    'https://nexa-vote-back.onrender.com/api/auth/login',
    payload,
    params
  );

}