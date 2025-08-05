import axios from "axios";

export default async function getReviewsByProductService(id){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/reviews/getReviewsOfProduct/${id}`)
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}