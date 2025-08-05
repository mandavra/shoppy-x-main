import axios from "axios"
export default async function getAllFeaturedProductsService(){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/products/getAllFeaturedProducts`)
      return data
    } catch (err) {
        console.log(err)
    }
}