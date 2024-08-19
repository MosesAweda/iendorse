import React from "react";


const SkeletonCampaign = () => {
    return (
       <>
       
       <div className="p-4 max-w-lg border-gray-200 border sm:border-0 bg-white rounded-2xl my-5 mx-1 p-3 px-6 animate-pulse">
    <div>
      <div className="flex items-center">
        <div className="mr-4 bg-gray-300 rounded-full mx-1" style={{ width: '45px', height: '45px' }}></div>
        <div>
          <div className="bg-gray-300 h-4 w-32 mb-2 rounded"></div>
          <div className="bg-gray-300 h-3 w-24 rounded"></div>
        </div>
      </div>
    </div>

    <div className="my-4 min-w-[300px] max-w-[648px] rounded-lg">
      <div className="bg-gray-300 h-6 w-48 mb-2 rounded"></div>
      <div className="bg-gray-300 h-4 w-full rounded"></div>
      <div className="bg-gray-300 h-4 w-full rounded mt-1"></div>
      <div className="bg-gray-300 h-4 w-3/4 rounded mt-1"></div>
    </div>

    <div className="my-4">
      <div className="bg-gray-300 h-40 rounded-2xl"></div>
    </div>

    <div className='flex mt-4 mb-3 text-sm'>
      <div className='flex mr-5 items-center'>
        <div className="bg-gray-300 h-5 w-5 rounded-full mr-1"></div>
        <div className="bg-gray-300 h-4 w-12 rounded"></div>
      </div>
      <div className='flex items-center'>
        <div className="bg-gray-300 h-5 w-5 rounded-full mr-1"></div>
        <div className="bg-gray-300 h-4 w-12 rounded"></div>
      </div>
    </div>
  </div>
       </>
    )

}
export default SkeletonCampaign