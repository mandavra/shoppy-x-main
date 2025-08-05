import axios from "axios";

export default async function updateReviewService(id,formData){
    try {
      const {data}= await axios.patch(`http://localhost:3000/api/v1/reviews/${id}`,
        formData,
        {
            headers:{"Content-Type":"application/json"},
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}