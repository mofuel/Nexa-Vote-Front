import API_URL from "../config/api";

export async function loginVoter(dni, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dni, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data.error || "Error en login"
    };
  }

  return data;
}



export async function getCurrentUser(token) {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const response = await fetch(`${API_URL}/api/votes/candidates`);
  return await response.json();
}

export async function castVote(token, candidateId) {
  const response = await fetch(`${API_URL}/api/votes/cast`, {
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



export async function loginAdmin(email, password) {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password
    }),
  });

  return await response.json();
}




export async function getVoteResults() {
  const response = await fetch(`${API_URL}/api/votes/results`);
  return await response.json();
}

export async function getTotalVotes() {
  const response = await fetch(`${API_URL}/api/votes/total`);
  return await response.json();
}

export async function getTurnout() {
  const response = await fetch(`${API_URL}/api/votes/turnout`);
  return await response.json();
}

