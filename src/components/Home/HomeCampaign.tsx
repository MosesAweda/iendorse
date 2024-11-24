import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import share from '../svg/share.svg';
import endorse from '../svg/endorse.svg';
import Initials from "../Initials";
import EndorseCampaignModal from "../ViewCampaign/EndorseCampaignModal";
import PaymentMethodModal from "../ViewCampaign/PaymentMethodModal";
import InsufficientWalletBalanceModal from "../ViewCampaign/InsufficientWalletBallance";
import SummaryModal from "../ViewCampaign/SummaryModal";
import EndorsementSuccessfulModal from "../ViewCampaign/EndorsementSuccessfulModal";
import ShareCampaignModal from "../ViewCampaign/ShareCampaignModal";
import { baseURL } from "../URL";
import useFetch from "../Hooks/useFetch";
import usePost from "../Hooks/usePost";
import {toast} from "react-toastify";
import { isAuthenticated } from '../auth';
import SignInFirst from "./SignInFirst";
import { deflate } from "zlib";

const HomeCampaign = ({item}:any, index:any) => {
  const userData:any = window.localStorage.getItem("userData");
  const parsedUserData = JSON.parse(userData);
  const [endorseMenu, setEndorseMenu] = useState(false);
  const[signInFirstModal, setSignInFirstModal] = useState(false);
  const [unitsToPurchase, setUnitsToPurchase] = useState<number>(0);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
 const [endorsementNote, setEndorsementNote] = useState('');  
 const [paymentMethod, setPaymentMethod] = useState("");
 const [allData, setAllData] = useState<any>({});
 const [insufficientWalletModal, setInsufficientWalletModal] = useState(false);
 const [summaryModal, setSummaryModal] = useState(false);
 const [endorsementSuccessfulModal, setEndorsementSuccessfulModal] = useState(false);
 const [shareCampaignModal, setShareCampaignModal] = useState(false);
 const isUserAuthenticated = isAuthenticated();

  const openEndorseMenu = () => {
    if(isUserAuthenticated){
  setEndorseMenu(true);
  }else{
    setSignInFirstModal(true);
  }
    document.body.style.overflow = 'hidden'; 
  }


  const closeEndorseMenu = () => {
    setEndorseMenu(false);
    document.body.style.overflow = 'auto'; 
  }
  const onSuccess = () => {}
  const onError = () => {}
  const openSignInPrompt = () => setSignInFirstModal(true)
  const closeSignInPrompt = () => {setSignInFirstModal(false); document.body.style.overflow = 'auto'}
  const openPaymentMethodModal = () => setPaymentMethodModal(true);
  const closePaymentMethodModal = () => setPaymentMethodModal(false);
  const openInsufficientWalletModal = () => setInsufficientWalletModal(true);
  const closeInsufficientWalletModal = () => setInsufficientWalletModal(false);
  const opensummarymodal = () => setSummaryModal(true);
  const closeSummaryModal = () => setSummaryModal(false);
  const openShareCampaignModal = () => setShareCampaignModal(true);
  const closeShareCampaignModal = () =>   setShareCampaignModal(false);

  const openEndorsementSuccessfulModal = () => setEndorsementSuccessfulModal(true);
  const closeEndorsementSuccessfulModal = () => {setEndorsementSuccessfulModal(false); setAllData({})};
 
  const endorseWithWalletURL = `${baseURL}/Campaign/EndorseCampaignWithWallet`
  const walletBalance = parsedUserData?.walletUnits;


  

  const { data:ApiFeedback, loading: ApiFeedbackLoading, error, postData} = usePost(endorseWithWalletURL);

  const endorseWithWalletData = {
    campaignId: item.campaignId,
    numberOfUnits: unitsToPurchase,
    endorsementNote: endorsementNote
  }
  const PayWithWallet = async () => {
    console.log("..........Paying with wallet");
    try {
      await postData(endorseWithWalletData);
    } catch (err) {
      console.error("Error posting data:", err);
    //  toast.error("Failed to Endorse. Please try again.");
      return;
    }
  };

  const submitEndorsement= (units:number, note: any) => {
    setUnitsToPurchase(units)
    setEndorsementNote(note)
    setAllData({...allData, unitsToPurchase: units, endorsementNote: note});
   // console.log("All ENDORSEMENT DATA>>>>>>>>", allData)
     closeEndorseMenu();
     openPaymentMethodModal();
  }


  const submitPaymentMethod = (method: any) => {
    setAllData({ ...allData, paymentMethod: method, walletBalance: walletBalance, campaignId: item.campaignId });
    setPaymentMethod(method)
    let preferredPaymentMethod = method;
    closePaymentMethodModal();
    console.log(" Prefered PAyment method:", preferredPaymentMethod)
    if (preferredPaymentMethod == "Wallet") {
      if (unitsToPurchase > walletBalance) {
        setInsufficientWalletModal(true);
      } else {
       // console.log("opening summary modal")
        opensummarymodal()
      }
    }
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


  useEffect(() => {
    if (ApiFeedback) {
      console.log(ApiFeedback);
         closeSummaryModal()
    openEndorsementSuccessfulModal();
 
    }
  }, [ApiFeedback]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to endorse. Please try again.");
    }
  }, [error]);
  
//console.log("cammpaign File", item?.campaignFiles[0]?.filePath)
console.log("home campagin", item)
  return (
    <>
      
        <div className="p-4  max-w-lg border-gray-200  border sm:border-0 bg-white rounded-2xl my-5 mx-1 p-3  px-6">
          <Link to={`/ViewCampaign/${item?.campaignId}`} className={""}> 
          <div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center">
            <div className="  inline-block  z-1 mr-3 " >
          {item?.campaignOwnerImage ? (
            <img className="rounded-full border-2 border-white" style={{ boxShadow: '0 0 0 1px #0D236E' }}
             src={item?.campaignOwnerImage} width={45} height={45} alt="Avatar" />
          ):(
            <div className="flex items-center justify-center h-full w-full bg-blue-100 rounded-full text-customBlue p-2">
            <Initials fullName={item?.campaignOwner} className="text-lg font-medium" />  
            </div>
          )
        }
          </div>


          
              <div>
                <div className="font-semibold text-lg w-[200px] leading-tight">
                 {item?.campaignOwner}
                </div>
                <div className='text-xs'>
                  <i> {item?.campaignOwnerTitle}</i>
                </div>
              </div>
              </div>

              
              <div>
            <button className="bg-green-100 text-green-600 rounded-lg px-4 py-2 text-xs font-medium">
            {item?.campaignUnit}  Points Left 
            </button>
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
            <div className='flex mr-5 items-center cursor-pointer'  onClick={()=> openShareCampaignModal()}>
            <div >
                <img src={share} width={20} height={20} className='mr-1' alt="share" />
              </div>
              <div>Share</div>
            </div>

            <div className='flex items-center cursor-pointer' onClick={() => openEndorseMenu()}>
              <div>
                <img src={endorse} width={20} height={20} className='mr-1' alt="Endorse" />
              </div>
              <div>Endorse</div>
            </div>
          </div>
          </div>
      

      <EndorseCampaignModal
        isOpen={endorseMenu}
        onClose={closeEndorseMenu}
        onSubmit={submitEndorsement}
      />
     
     <PaymentMethodModal
        isOpen={paymentMethodModal}
        onClose={closePaymentMethodModal}
        onSubmit={submitPaymentMethod}
      />

    <InsufficientWalletBalanceModal
        isOpen={insufficientWalletModal}
        onClose={closeInsufficientWalletModal}
        details={allData}
      />

       <SummaryModal
        isOpen={summaryModal}
        onClose={closeSummaryModal}
        onSubmit={PayWithWallet}
        details ={allData}
        ApiLoading={ApiFeedbackLoading}
      />

        <EndorsementSuccessfulModal
          isOpen={endorsementSuccessfulModal}
        onClose={closeEndorsementSuccessfulModal}
        details ={allData}
      />


      <ShareCampaignModal
        isOpen={shareCampaignModal}
        onClose={closeShareCampaignModal}
        details ={item}
      />


      <SignInFirst
        isOpen={signInFirstModal}
        onClose={closeSignInPrompt}
          />
    </>
  );
}

export default HomeCampaign  ;
