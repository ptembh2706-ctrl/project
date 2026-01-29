// Custom event target for auth changes
const authEventTarget = new EventTarget();

export const isLoggedIn = () => {
  return localStorage.getItem("customerId") !== null;
};

export const getCustomerId = () => {
  return localStorage.getItem("customerId");
};

export const getCustomerName = () => {
  return localStorage.getItem("customerName");
};

export const getCustomerRole = () => {
  return localStorage.getItem("role");
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const login = (data) => {
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  localStorage.setItem("customerId", data.id || data.customerId); // Handle both id formats just in case
  localStorage.setItem("customerName", data.name);
  localStorage.setItem("role", data.role || "CUSTOMER");

  // Dispatch event so listeners know auth state changed
  authEventTarget.dispatchEvent(new Event("authChange"));
};

export const logout = () => {
  localStorage.clear();
  authEventTarget.dispatchEvent(new Event("authChange"));
  window.location.href = "/login";
};

export const subscribeToAuthChanges = (callback) => {
  const handler = () => callback();
  authEventTarget.addEventListener("authChange", handler);
  return () => authEventTarget.removeEventListener("authChange", handler);
};
