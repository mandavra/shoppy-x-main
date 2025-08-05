import axios from "axios"
export default async function checkIfAbleToReviewService(id){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/reviews/checkReviewed/${id}`, 
        { 
          withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err)
        return err.response
    }
}