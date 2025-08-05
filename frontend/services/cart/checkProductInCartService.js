import axios from "axios"
export default async function checkProductInCartService(id){
    try {
      const data = await axios.get(`http://localhost:3000/api/v1/cart/checkProduct/${id}`,
        {
          withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}