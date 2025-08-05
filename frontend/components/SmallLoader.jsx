import { RefreshCw } from "lucide-react"

function SmallLoader({customMessage}) {
    return (
        <div className="flex justify-center items-center mt-4">
          <RefreshCw className="animate-spin h-6 w-6 text-indigo-600" />
          <span className="ml-2 text-gray-500 text-sm">{customMessage}</span>
        </div>
    )
}

export default SmallLoader
