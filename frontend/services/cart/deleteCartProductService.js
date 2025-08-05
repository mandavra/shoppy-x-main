import axios from "axios"
export default async function deleteCartProductService(id){
    try {
      const {data} = await axios.delete(`http://localhost:3000/api/v1/cart/${id}`,
        {
          withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}