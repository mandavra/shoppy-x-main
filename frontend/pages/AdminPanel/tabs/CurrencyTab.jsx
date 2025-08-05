import { useEffect, useState } from "react";
import SmallLoader from "../../../components/SmallLoader";
import getCurrencyRateService from "../../../services/currency/getCurrencyRateService";
import updateCurrencyRateService from "../../../services/currency/updateCurrencyRateService";
import successToastMessage from "../../../utils/successToastMessage";

export default function CurrencyTab() {

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0); // Initial rate
  const [inputRate, setInputRate] = useState(0); // Initial rate

   async function fetchCurrentRate(){
    setIsLoading(true)
    const {data} = await getCurrencyRateService()
    // console.log(data)
    setExchangeRate(data.inrRate)
    setLastUpdated(data.updateAt)
    setInputRate(data.inrRate)
    setIsLoading(false)
   }

   useEffect(()=>{
    fetchCurrentRate()
   },[])
  const handleUpdate = async () => {
    setIsUpdating(true);
    const formData = new FormData()
    formData.append("currentInr",inputRate)
    const {data} = await updateCurrencyRateService(formData)
    setExchangeRate(data.inrRate)
    setIsUpdating(false)
    setIsEditing(false)
    successToastMessage("Rate Updated Successfully!")
  };

  const handleCancel = () => {
    setInputRate(exchangeRate)
    setIsEditing(false);
  };

  function convertDate(timeStamp){
    const date = new Date(timeStamp);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 bg-white shadow-md rounded-2xl sm:px-8 sm:py-10">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-6 text-center border-b pb-2">
        USD to INR Exchange Rate
      </h2>

      {isEditing ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="text-base sm:text-lg font-medium text-gray-700">1 USD =</span>
            <input
              type="number"
              value={inputRate}
              onChange={(e) => setInputRate(Number(e.target.value))}
              className="w-32 sm:w-36 px-4 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         text-right font-medium text-blue-800"
              step="0.1"
              autoFocus
            />
            <span className="text-base sm:text-lg font-medium text-gray-700">INR</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-40 py-2.5 
                         rounded-md transition duration-200 flex items-center 
                         justify-center gap-2 font-semibold"
            >
              {isUpdating ? (
                <>
                  <SmallLoader />
                  Saving...
                </>
              ) : (
                "Update Rate"
              )}
            </button>

            <button
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-full sm:w-40 py-2.5 
                         rounded-md transition duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center space-y-2">
            <p className="text-4xl sm:text-5xl font-extrabold text-blue-600">
              ₹{exchangeRate.toFixed(2)}
            </p>
            <p className="text-sm sm:text-base text-gray-600">Indian Rupees (INR)</p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-40 py-2.5 
                       rounded-md transition duration-200 font-semibold"
          >
            Edit Rate
          </button>
          <p className="text-xs text-gray-500 text-center">
            Last updated: {lastUpdated && convertDate(lastUpdated)}
          </p>
        </div>
      )}
    </div>
  );
}
