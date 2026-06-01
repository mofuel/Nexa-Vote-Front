import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 50 },
    { duration: '20s', target: 0 }
  ]
};

export default function () {

  const res = http.get(
    'https://nexa-vote-back.onrender.com/api/votes/candidates'
  );

  check(res, {
    'status 200': (r) => r.status === 200
  });

  sleep(1);
}