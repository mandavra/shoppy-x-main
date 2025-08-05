import axios from "axios";

export default async function checkLogin(){
    try {
      const data = await axios.get(`http://localhost:3000/api/v1/users/checkAuth`,
        {withCredentials:true}
      )
      return data
    } catch (err) {
        console.log(err)
        return {status:"failed", message:"Not Logged in"}
    }
}