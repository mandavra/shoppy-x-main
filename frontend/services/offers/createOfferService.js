import axios from "axios"
export default async function createOfferService(formData){
    try {
      const {data} = await axios.post(`http://localhost:3000/api/v1/offers/create`,
        formData,
        { 
          headers:{"Content-Type":"multipart/form-data"},
          withCredentials:true
      }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}