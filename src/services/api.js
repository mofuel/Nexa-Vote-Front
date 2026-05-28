import API_URL from "../config/api";



// ─── INTERCEPTOR ────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = sessionStorage.getItem("token") || sessionStorage.getItem("admin_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (response.status === 401) {
    sessionStorage.clear();
    window.dispatchEvent(new Event("auth:logout"));
    return { success: false, error: "Sesión expirada" };
  }
  return response.json();
}

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



export async function getCurrentUser() {          
  return apiFetch("/auth/me");
}

export async function validateMultifactor(data) { 
  return apiFetch("/validation/multifactor", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCandidates() {
  const response = await fetch(`${API_URL}/api/votes/candidates`);
  return await response.json();
}

export async function castVote(candidateId) {     // ← sin token
  return apiFetch("/api/votes/cast", {
    method: "POST",
    body: JSON.stringify({ candidate_id: candidateId }),
  });
}

export async function getReport() {               // ← sin token
  return apiFetch("/reports/summary");
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



// MFA
export async function validateDNI(dniScanned) {
  return apiFetch("/api/mfa/validate-dni", {
    method: "POST",
    body: JSON.stringify({ dni_scanned: dniScanned }),
  });
}


export async function validateFace(descriptor) {
  return apiFetch("/api/mfa/validate-face", {
    method: "POST",
    body: JSON.stringify({ descriptor }),
  });
}


export async function webauthnAuthOptions() {
  return apiFetch("/webauthn/auth/options", { method: "POST" });
}


export async function webauthnAuthVerify(payload) {
  return apiFetch("/webauthn/auth/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


// Registro

export async function scanIdentity(dni, fullName) {
  const response = await fetch(`${API_URL}/register/identity/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dni, full_name: fullName }),
  });
  return response.json();
}


export async function getVoter(id) {
  const res = await fetch(`${API_URL}/register/voter/${id}`);
  return res.json();
}


export async function updateIdentity(id, formData) {
  const res = await fetch(`${API_URL}/register/identity/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return res.json();
}


export async function registerFace(voterId, descriptor) {
  return apiFetch("/register/face", {
    method: "POST",
    body: JSON.stringify({ voter_id: voterId, descriptor }),
  });
}


export async function webauthnRegisterOptions(voterId) {
  return apiFetch("/webauthn/register/options", {
    method: "POST",
    body: JSON.stringify({ voter_id: voterId }),
  });
}


export async function webauthnRegisterVerify(payload) {
  return apiFetch("/webauthn/register/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export async function getRegistrationSummary(id) {
  return apiFetch(`/register/summary/${id}`);
}


export async function completeRegistration(id) {
  return apiFetch(`/register/complete/${id}`, {
    method: "PUT",
  });
}

export async function getAuditLogs() {
  return apiFetch("/api/admin/audit-logs");
}