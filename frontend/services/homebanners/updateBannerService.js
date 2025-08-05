import axios from "axios";

export default async function updateBannerService(id,formData){
    try {
      const {data}= await axios.patch(`http://localhost:3000/api/v1/banners/${id}`,formData,
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