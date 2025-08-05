import axios from "axios";

export default async function logout() {
    try {
      const data = await axios.post(`http://localhost:3000/api/v1/users/logout`,
        {},
        {withCredentials:true}
      )
      return data
    } catch (err) {
        throw new Error(err)
    }
}