// Custom event target for auth changes
const authEventTarget = new EventTarget();

export const isLoggedIn = () => {
  return sessionStorage.getItem("customerId") !== null;
};

export const getCustomerId = () => {
  return sessionStorage.getItem("customerId");
};

export const getCustomerName = () => {
  return sessionStorage.getItem("customerName");
};

export const getCustomerRole = () => {
  return sessionStorage.getItem("role");
};

export const getAuthToken = () => {
  return sessionStorage.getItem("token");
};

export const login = (data) => {
  if (data.token) {
    sessionStorage.setItem("token", data.token);
  }
  sessionStorage.setItem("customerId", data.id || data.customerId); // Handle both id formats just in case
  sessionStorage.setItem("customerName", data.name);
  sessionStorage.setItem("role", data.role || "CUSTOMER");

  // Dispatch event so listeners know auth state changed
  authEventTarget.dispatchEvent(new Event("authChange"));
};

export const logout = () => {
  sessionStorage.clear();
  authEventTarget.dispatchEvent(new Event("authChange"));
  window.location.href = "/login";
};

export const subscribeToAuthChanges = (callback) => {
  const handler = () => callback();
  authEventTarget.addEventListener("authChange", handler);
  return () => authEventTarget.removeEventListener("authChange", handler);
};
