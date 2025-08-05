import axios from "axios"
export default async function updateProductService(id,formData){
    try {
      const {data} = await axios.patch(`http://localhost:3000/api/v1/products/${id}`,
        formData,
        { 
          headers:{"Content-Type":"multipart/form-data"},
          withCredentials: true
      }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}