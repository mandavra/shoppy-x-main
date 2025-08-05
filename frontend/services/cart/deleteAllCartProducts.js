import axios from "axios"
export default async function deleteAllCartProducts(){
    try {
      const {data} = await axios.patch(`http://localhost:3000/api/v1/cart/deleteCartProducts`,
        {
            headers:{"Content-Type":"application/json"},
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}