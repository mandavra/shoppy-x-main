import axios from "axios"

export default async function signUp(formData){
    try {
      const data = await axios.post(`http://localhost:3000/api/v1/users/signUp`,
        formData,
        {
            headers:{"Content-Type":"application/json"},
            withCredentials:true
        }
      )
      return data

    } catch (err) {
        console.log(err)
        return (err.response.data)
    }
}