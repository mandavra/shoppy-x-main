import axios from "axios";

export default async function createNewBanner(formData){
    try {
      const {data}= await axios.post(`http://localhost:3000/api/v1/banners/create`,formData,
        { 
            headers:{"Content-Type":"multipart/form-data"},
            withCredentials: true 
        }
      )
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}