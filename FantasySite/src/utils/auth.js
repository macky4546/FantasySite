// Minimal helper for Azure Static Web Apps built-in authentication

export function login(provider = 'github') {
  const redirect = encodeURIComponent(window.location.pathname || '/');
  // some providers use different id strings in Azure; adjust as needed
  window.location.href = `/.auth/login/${provider}?post_login_redirect_uri=${redirect}`;
}

export function logout() {
  const redirect = encodeURIComponent('/');
  window.location.href = `/.auth/logout?post_logout_redirect_uri=${redirect}`;
}

export async function getUser() {
  const res = await fetch('/.auth/me', { credentials: 'include' });
  if (!res.ok) throw new Error('not authenticated');
  const data = await res.json();
  // Azure returns an array of identities; userDetails contains a friendly name
  if (Array.isArray(data) && data.length > 0) return data[0];
  // Some stacks return {clientPrincipal: ...}
  if (data.clientPrincipal) return data.clientPrincipal;
  return null;
}
