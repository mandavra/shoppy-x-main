import axios from "axios"
export default async function getAllProductsService(){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/products/getAll`)
      return data
    } catch (err) {
        console.log(err)
    }
}