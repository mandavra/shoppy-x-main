import axios from "axios";

export default async function updateMyDetails(formData){
    try {
      const {data}= await axios.patch(`http://localhost:3000/api/v1/users/updateMe`,
        formData,
        { 
            headers: { "Content-Type": "application/json" },
            withCredentials: true 
          }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}