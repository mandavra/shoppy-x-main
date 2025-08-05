import axios from "axios";

export default async function deleteCategoryService(id){
    try {
      const {data}= await axios.delete(`http://localhost:3000/api/v1/categories/${id}`)
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}