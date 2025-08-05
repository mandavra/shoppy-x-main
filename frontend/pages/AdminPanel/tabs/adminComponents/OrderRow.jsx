import { Edit2 } from "lucide-react"
import getStatusDate from "../../../../utils/getStatusDate.js"

function OrderRow({order,handleEditClick,getStatusColor}) {
    
    return (
        <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.finalPrice}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusDate(order)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs capitalize font-semibold ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button
          onClick={() => handleEditClick(order)}
          className="text-indigo-600 hover:text-indigo-900 transition-colors"
        >
          <Edit2 className="h-5 w-5" />
        </button>
      </td>
    </tr>
    )
}


export default OrderRow
