import { useState } from "react"

function ReviewDescription({description}) {
    const [isExpanded,setIsExpanded]=useState(false)

    return (
        <>
            {
                description.length<250?
                (description):
                (
                    isExpanded?
                    (<>
                        {description} 
                        <span onClick={()=>{setIsExpanded(false)}}
                            className="text-blue-500 hover:underline hover:cursor-pointer"
                            > Read less</span>
                    </>):
                    (<>
                        {description.slice(0,250)}...
                        <span
                        onClick={()=>setIsExpanded(true)} className="text-blue-500 hover:underline hover:cursor-pointer">
                            Read more
                        </span>
                    </>)
                )
            }
        </>
    )
}

export default ReviewDescription
