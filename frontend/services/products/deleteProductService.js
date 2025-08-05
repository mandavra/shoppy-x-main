import axios from "axios"
export default async function deleteProductService(id){
    try {
      const {data} = await axios.delete(`http://localhost:3000/api/v1/products/${id}`
        
      )
      return data
    } catch (err) {
        console.log(err)
    }
}