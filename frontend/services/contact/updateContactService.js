import axios from "axios";

export default async function updateContactService(formData){
    try {
      const {data} = await axios.patch(`http://localhost:3000/api/v1/contact/`,
        formData,
        {
            headers:{
                "Content-Type":"application/json"
            }
        }
      )
      return data
    } catch (err) {
        console.log(err.response)
    }
}