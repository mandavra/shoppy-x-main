import axios from "axios";

export default async function login(formData) {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/v1/users/signIn`,
      formData,
      { 
        headers: { "Content-Type": "application/json" },
        withCredentials: true 
      }
    );
    return response.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Login failed");
  }
}
