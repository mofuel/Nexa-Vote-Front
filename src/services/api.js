const API_URL = "http://127.0.0.1:5000/api";

export async function loginVoter(dni, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dni, password }),
  });

  return await response.json();
}

export async function registerVoter(formData) {
  const response = await fetch(`${API_URL}/voters/register`, {
    method: "POST",
    body: formData,
  });

  return await response.json();
}

export async function validateMultifactor(token, data) {
  const response = await fetch(`${API_URL}/validation/multifactor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function getCandidates() {
  const response = await fetch(`${API_URL}/votes/candidates`);
  return await response.json();
}

export async function castVote(token, candidateId) {
  const response = await fetch(`${API_URL}/votes/cast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      candidate_id: candidateId,
    }),
  });

  return await response.json();
}

export async function getReport(token) {
  const response = await fetch(`${API_URL}/reports/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}