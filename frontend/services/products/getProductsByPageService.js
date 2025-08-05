import axios from "axios";

export default async function getProductsByPageService(page){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/products/getLimitedProducts?page=${page}`)
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}