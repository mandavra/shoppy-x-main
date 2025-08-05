import axios from "axios";

export default async function getProductById(productId){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/products/${productId}`)
      return data
    } catch (err) {
        console.log(err.response.data)
        return (err.response)
    }
}