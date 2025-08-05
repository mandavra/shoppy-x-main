import axios from "axios"
export default async function getCartProductsService(){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/cart/getAll`,{
        withCredentials:true
      }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}