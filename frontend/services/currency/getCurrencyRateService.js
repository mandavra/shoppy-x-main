import axios from "axios";

export default async function getCurrencyRateService(){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/currencyRate/getRate`)
      return data
    } catch (err) {
        console.log(err)
    }
}