
function setUser(user: { [name: string]: string }) {
  localStorage.setItem('user', JSON.stringify(user));
}

function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function getUser() {
  const jsonUser = localStorage.getItem('user');
  return jsonUser ? JSON.parse(jsonUser) : null;
}

function getToken() {
  return localStorage.getItem('token');
}

export async function checkConnection() { // TO DO
  const user = getUser();
  const token = getToken();

  // if (!user || !token)
    return false;

  // const response = await fetch('http://localhost:3000/user/checkconnection', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //     type: user.type,
  //   }),
  // });
  // const responseJson = await response.json();
  
  return true;
}

export async function register(name: string, email: string, password: string) {
  const response = await fetch('http://localhost:3000/user/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
  const json = await response.json();
  if (json.user) {
    setUser(json.user);
    return true;
  }
  return false;
}

export async function asGuest() { // TO DO
  const response = await fetch('http://localhost:3000/user/guest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({}),
  });
  const json = await response.json();
}

export async function login(name: string, email: string, password: string) {
  const response = await fetch('http://localhost:3000/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
  const json = await response.json();
  if (json.user) {
    setUser(json.user);
    return true;
  }
  return false;
}

export async function logout() {
  const user = getUser();
  const token = getToken();

  const response = await fetch('http://localhost:3000/user/logout', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: user?.id,
      name: user?.name,
      type: user?.type,
      status: user?.status,
    }),
  });
  const json = await response.json();
}

export async function deleteUser() {
  const user = getUser();
  const token = getToken();

  const response = await fetch('http://localhost:3000/user/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: user?.id,
      name: user?.name,
      type: user?.type,
      status: user?.status,
    }),
  });
  const json = await response.json();

  if (json.success) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return true;
  }
  return false;
}

export async function verifyTwoFactorCode(code: string) {
  const user = getUser();

  const response = await fetch('http://localhost:3000/user/twofa/verifycode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      type: user?.type,
      code,
    }),
  });
  const json = await response.json();
  if (json.token) {
    setToken(json.token);
    return true;
  }
  return false;
}