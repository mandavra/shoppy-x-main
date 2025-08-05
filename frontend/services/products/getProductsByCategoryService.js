import axios from "axios";

export default async function getProductsByCategoryService(category,searchParams){
    try {
      // console.log("going",category)
      const {data}= await axios.get(`http://localhost:3000/api/v1/products/getByCategory/${category}?${searchParams}`)
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}