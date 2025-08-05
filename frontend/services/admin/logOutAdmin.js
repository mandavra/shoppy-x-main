import axios from "axios";

export default async function logOutAdmin() {
    try {
      const data = await axios.post(`http://localhost:3000/api/v1/admin/logOut`,
        {},
        {
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        throw new Error(err)
    }
    
}