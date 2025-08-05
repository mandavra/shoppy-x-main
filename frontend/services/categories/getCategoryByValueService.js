import axios from "axios";

export default async function getCategoryByValueService(category){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/categories/getName/${category}`)
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}