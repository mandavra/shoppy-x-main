import axios from "axios";

export default async function updateCurrencyRateService(rate){
    try {
      const {data} = await axios.patch(`http://localhost:3000/api/v1/currencyRate/update`,
        { currentInr: rate.get("currentInr") }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}