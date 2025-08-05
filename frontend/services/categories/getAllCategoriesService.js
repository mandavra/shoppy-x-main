import axios from "axios";

export default async function getAllCategoriesService(){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/categories/getAll`)
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}