import { Loader, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

function CartProduct({item,updateProductQuantity,deleteCartProduct}) {
    const [quantity,setQuantity]=useState(1)
    const [isUpdating,setIsUpdating] = useState(false)
    const [isDeleting,setIsDeleting] = useState(false)
    
    async function updateTheQuantity(id,updatedQuantity){
        const formData = new FormData()
        formData.append("quantity",updatedQuantity)
        setIsUpdating(true)
        await updateProductQuantity(id,formData)
        setIsUpdating(false)
    }
    async function deleteTheProduct(id){
        setIsDeleting(true)
        await deleteCartProduct(id)
        setIsDeleting(false)
    }

    useEffect(()=>{
        setQuantity(item.quantity)
    },[])
    return (
        <li className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                              <button
                              onClick={()=>deleteTheProduct(item.productId)} 
                              disabled={isDeleting} className="text-gray-400 bg-transparent hover:text-gray-500">
                                {
                                  isDeleting?
                                  <Loader></Loader>:
                                <Trash2 className="h-5 w-5" />
                                }
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">₹{item.price}</p>
                            <div className="mt-4 flex items-center">
                              {/* increment */}
                              <button
                              disabled={quantity===1 || isUpdating}
                              onClick={()=>{
                                setQuantity(prev=>{
                                        const newQuantity = prev-1
                                        updateTheQuantity(item.productId,newQuantity)
                                        return newQuantity
                                    })
                                //send the product id 
                            }}
                               className="p-1 rounded-md border bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50">-</button>
                              
                              <span className="mx-4 text-gray-600">{quantity}</span>
                              {/* decrement */}
                              <button 
                              disabled={isUpdating}
                              onClick={()=>{
                                setQuantity(prev=>{
                                    const newQuantity = prev+1
                                    updateTheQuantity(item.productId,newQuantity)
                                    return newQuantity
                                })
                              }}
                              className="p-1 rounded-md border bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50">+</button>
                            </div>
                          </div>
                        </li>
    )
}

export default CartProduct
