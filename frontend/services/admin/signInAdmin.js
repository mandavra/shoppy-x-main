import axios from "axios";

export default async function signInAdmin(formData){
    try {
      const data = await axios.post(`http://localhost:3000/api/v1/admin/signIn`,
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