import React from "react";
import { Link } from "react-router-dom";
import share from './svg/share.svg';
import endorse from './svg/endorse.svg';
import Initials from "./Initials";
 

const HomeCampaign = ({item}:any, index:any) => {
  const userData:any = window.localStorage.getItem("userData");
  const parsedUserData = JSON.parse(userData);
  const handleClick = (event:any) => {
    event.stopPropagation(); // Prevents the click event from propagating to the parent element
    alert('Hello');
  }

  const getInitials = (fullName: string) => {
    if (fullName) {
      const names = fullName.trim().split(' ');
  
      // Get the first character of the first name and the first character of the last name, if available
      const initials =
        (names[0] ? names[0][0] : '') + (names.length > 1 ? names[names.length - 1][0] : '');
  
      return initials.toUpperCase();
    }
  
    return ''; // Return empty string if fullName is falsy
  };


console.log("camampaign File", item?.campaignFiles[0]?.filePath)

  return (
    <>
      
        <div className="p-4  max-w-lg border-gray-200  border sm:border-0 bg-white rounded-2xl my-5 mx-1 p-3  px-6">
          <Link to={`/ViewCampaign/${item?.campaignId}`} className={""}> 
          <div>
            <div className="flex items-center">
            <div className="relative inline-block  mr-3" >
          {item?.campaignOwnerImage ? (
            <img className="rounded-full border-2 border-white" style={{ boxShadow: '0 0 0 1px #0D236E' }} src={item?.campaignOwnerImage} width={45} height={45} alt="Avatar" />
          ):(
            <div className="flex items-center justify-center h-full w-full bg-blue-100 rounded-full text-customBlue p-2">
            <Initials fullName={item?.campaignOwner} className="text-lg font-medium" />  
            </div>
          )
        }
 
          </div>
              <div>
                <div className="font-semibold text-lg">
                 {item?.campaignOwner}
                </div>
                <div className='text-xs'>
                  <i> {item?.campaignOwnerTitle}</i>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4 min-w-[300px] max-w-[648px]   rounded-lg">
            <h1 className="font-medium">
              {item?.campaignTitle}
            </h1>
            <p className="text-justify">
              {item?.description}
            </p>
          </div>



          <div>
          <div className="my-4">
{item?.campaignFiles?.length > 0 && (
    <div className="">
    <img className="rounded-2xl"  src={item?.campaignFiles[0]?.filePath  }   
        />
          </div>
)}


</div>
          </div>

          </Link>
          <div className='flex mt-4 mb-3 text-sm'>
            <div className='flex mr-5 items-center'>
              <div>
                <img src={share} width={20} height={20} className='mr-1' alt="Share" />
              </div>
              <div>Share</div>
            </div>

            <div className='flex items-center'>
              <div onClick={handleClick}>
                <img src={endorse} width={20} height={20} className='mr-1' alt="Endorse" />
              </div>
              <div>Endorse</div>
            </div>
          </div>
        </div>
      
    </>
  );
}

export default HomeCampaign  ;
