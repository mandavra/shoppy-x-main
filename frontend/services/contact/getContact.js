import axios from "axios"
export default async function getContact(){
    try {
      const {data}=await axios.get(`http://localhost:3000/api/v1/contact`)
      return data
    } catch (err) {
        console.log(err)
    }
}