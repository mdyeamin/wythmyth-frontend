export const storage = {
  getToken: () => (typeof window !== "undefined" ? localStorage.getItem("token") : null),
  setToken: (token: string) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
  },
  removeToken: () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
  },
};
