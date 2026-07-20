import API from "./api";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await API.post("/auth/register", {
      name,
      email,
      password,
      role: "USER",
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });
    return res.data; // { token, role, name }
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Login failed");
  }
};
