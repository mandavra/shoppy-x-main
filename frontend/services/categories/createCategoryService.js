import axios from "axios";

export default async function createCategoryService(formData){
    try {
      const {data}= await axios.post(`http://localhost:3000/api/v1/categories/create`,formData,
        { 
            headers:{"Content-Type":"multipart/form-data"},
            withCredentials: true 
        }
      )
      return data
    } catch (err) {
        console.log(err)
        return (err.response)
    }
}