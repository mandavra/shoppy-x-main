import axios from "axios";

export default async function getCategoriesForHomePage(){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/categories/getSome`)
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}