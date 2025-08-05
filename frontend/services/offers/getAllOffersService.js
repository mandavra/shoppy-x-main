import axios from "axios"
export default async function createAllOffersService(){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/offers/getAll`)
      return data
    } catch (err) {
        console.log(err)
        return err.response.data
    }
}