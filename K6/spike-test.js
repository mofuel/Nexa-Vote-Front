import http from 'k6/http';

export const options = {
  stages: [
    { duration: '5s', target: 50 },
    { duration: '15s', target: 50 },
    { duration: '5s', target: 0 }
  ]
};

export default function () {

  http.get(
    'https://nexa-vote-back.onrender.com/api/votes/candidates'
  );

}