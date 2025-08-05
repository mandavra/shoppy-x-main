import axios from "axios";

export default async function checkAdminLogin() {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/admin/checkAuth", {
      withCredentials: true,
    });
    return response.data; // ✅ best to return `data` directly
  } catch (err) {
    console.error("checkAdminLogin failed:", err.message); // optional for debugging
    throw new Error(err.message);
  }
}
