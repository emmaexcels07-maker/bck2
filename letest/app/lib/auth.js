const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function saveToken(token) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.error("Failed to save token:", err);
    }
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (err) {
    console.error("Failed to get token:", err);
    return null;
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error("Failed to remove token:", err);
    }
  }
}

export function saveUser(user) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Failed to get user:", err);
    return null;
  }
}

export function logout() {
  removeToken();
}
