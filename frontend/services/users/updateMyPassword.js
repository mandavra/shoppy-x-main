import axios from "axios";

export default async function updateMyPassword(formData){
    try {
      const data = await axios.patch(`http://localhost:3000/api/v1/users/updateMyPassword`,
        formData,
        {
          headers:{"Content-Type":"application/json"},
          withCredentials:true
        }
      )
      console.log(data)
      return data
      
    } catch (err) {
        console.log(err)
        return err.response.data
    }
    
}