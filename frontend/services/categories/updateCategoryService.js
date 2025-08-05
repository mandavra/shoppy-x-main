import axios from "axios";

export default async function updateCategoryService(id,formData){
    try {
      const {data}= await axios.patch(`http://localhost:3000/api/v1/categories/${id}`,formData,
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