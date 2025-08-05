import axios from "axios";

export default async function signUpAdmin(formData) {
    try {
      const data = await axios.post(`http://localhost:3000/api/v1/admin/signUp`,
        formData,
        {
            headers:{"Content-Type":"application/json"},
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        throw new Error(err)
    }
    
}