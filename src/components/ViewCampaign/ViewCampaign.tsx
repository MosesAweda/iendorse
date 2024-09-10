import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CampaignMenu from "./CampaignMenu";
import EndorseCampaignModal from "./EndorseCampaignModal";
import link from '../svg/link.svg';
import threeDots from '../svg/threeDots.svg';
import SubscriptionModal from "./SubscriptionModal";
import PurchaseUnitsModal from "./PurchaseUnitsModal";
import PaymentMethodModal from "./PaymentMethodModal";
import useFetch from "../Hooks/useFetch";
import Navbar from '../NavBar/Navbar';
import { baseURL } from "../URL";
import InsufficientWalletBalanceModal from "./InsufficientWalletBallance";
import SummaryModal from "./SummaryModal";
import usePost from "../Hooks/usePost";
import PromotionSuccessfulModal from "./EndorsementSuccessfulModal";
import ShareCampaignModal from "./ShareCampaignModal";
import { useParams } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import share from '../svg/share.svg';
import endorse from '../svg/endorse.svg';
import copy from '../svg/copy.svg';
import danger from '../svg/danger.svg';
import x from '../svg/x.svg';
import tiktok from '../svg/tiktok.svg';
import facebook from '../svg/facebook.svg';
import instagram from '../svg/instagram.svg';
import close from '../svg/close.svg';
import EndorsementSuccessfulModal from "./EndorsementSuccessfulModal";
  

interface ApiResponse {
  data: any;
  loading: boolean;
  error: Error | null;
  postData: (body: any) => Promise<void>;
}


const ViewCampaign = ({ item }: any) => {
  const { uid } = useParams();
  const [endorseMenu, setEndorseMenu] = useState(false);
  const [reportMenu, setReportMenu] = useState(false)
  const closeReportMenu = () => {
    setReportMenu(false);
  };
  const openReportMenu = () => {
    setReportMenu(true);
  };
  const [campaignMenuOpen, setCampaignMenuOpen] = useState(false);
  const [showEndorseMenu, setShowEndorseMenu ]= useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPurchaseUnitsModal, setPurchaseUnitsModal] = useState(false);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [insufficientWalletModal, setInsufficientWalletModal] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);
  const [endorsementSuccessfulModal, setEndorsementSuccessfulModal] = useState(false);
  const [shareCampaignModal, setShareCampaignModal] = useState(false);
  const [unitsToPurchase, setUnitsToPurchase] = useState<number>(0);
  const [endorsementNote, setEndorsementNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [allData, setAllData] = useState<any>({});
  const onSuccess = () => {}
  const onError = () => {}
  const openCampaignMenu = () => setCampaignMenuOpen(true);
  const closeCampaignMenu = () => setCampaignMenuOpen(false);
  const openEndorseMenu = () => setEndorseMenu(true);
  const closeEndorseMenu = () => setEndorseMenu(false);
  const openSubscriptionModal = () => setShowSubscriptionModal(true);
  const closeSubscriptionModal = () => setShowSubscriptionModal(false);
  const openPurchaseUnitsModal = () => setPurchaseUnitsModal(true);
  const closePurchaseUnitsModal = () => setPurchaseUnitsModal(false);
  const openPaymentMethodModal = () => setPaymentMethodModal(true);
  const closePaymentMethodModal = () => setPaymentMethodModal(false);
  const openInsufficientWalletModal = () => setInsufficientWalletModal(true);
  const closeInsufficientWalletModal = () => setInsufficientWalletModal(false);
  const opensummarymodal = () => setSummaryModal(true);
  const closeSummaryModal = () => setSummaryModal(false);
  const openEndorsementSuccessfulModal = () => setEndorsementSuccessfulModal(true);
  const closeEndorsementSuccessfulModal = () => {setEndorsementSuccessfulModal(false); setAllData({})};
  const openShareCampaignModal = () => setShareCampaignModal(true);
  const closeShareCampaignModal = () =>   setShareCampaignModal(false);

const endorseWithWalletURL = `${baseURL}/Campaign/EndorseCampaignWithWallet`
const walletURL = `${baseURL}/Wallet/WalletProfile`
  const { data: WalletData, refreshApi: refreshWalletData, error: walletError, loading: WalletDataLoading
  } = useFetch(walletURL, "GET", onSuccess, onError);

  const campaignURL = `${baseURL}/Campaign/CampaignDetails?CampaignId=${uid}`
  const { data: campaignData, refreshApi: refresCampaignData, error: DataError, loading: DataLoading
  } = useFetch(campaignURL, "GET", onSuccess, onError);

  console.log("camoampaign File", campaignData?.campaignFiles[0]?.filePath)

 const walletBalance = WalletData?.walletBalance;


const endorseWithWalletData = {
  campaignId: uid,
  numberOfUnits: unitsToPurchase,
  endorsementNote: endorsementNote
}

 const { data:ApiFeedback, loading: ApiFeedbackLoading, error, postData} = usePost(endorseWithWalletURL);


  const submitEndorsement= (units:number, note: any) => {
    setUnitsToPurchase(units)
    setEndorsementNote(note)
    setAllData({...allData, unitsToPurchase: units, endorsementNote: note});
    console.log("All ENDORSEMENT DATA>>>>>>>>", allData)
    closeEndorseMenu();
    openPaymentMethodModal();
  }

  const submitPaymentMethod = (method: any) => {
    setAllData({ ...allData, paymentMethod: method, walletBalance: walletBalance, campaignId: uid });
    setPaymentMethod(method)
    let preferredPaymentMethod = method;
    closePaymentMethodModal();
    console.log(" Prefered PAyment method:", preferredPaymentMethod)
    if (preferredPaymentMethod == "Wallet") {
      if (unitsToPurchase > walletBalance) {
        setInsufficientWalletModal(true);
      } else {
        console.log("opening summary modal")
        opensummarymodal()
      }
    }
  }

 


  const PayWithWallet = async () => {
    console.log("..........Paying with wallet");
    try {
      await postData(endorseWithWalletData);
    } catch (err) {
      console.error("Error posting data:", err);
      toast.error("Failed to Endorse. Please try again.");
      return;
    }
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
  return (
    <>
    <Navbar />

  {

      DataLoading && (
        <>
        <div className="sm:bg-gray-100 bg-white h-screen">
  <div className="flex flex-col sm:bg-gray-100 bg-white justify-center items-center">
    <div className="p-4 max-w-2xl border-gray-700 bg-white rounded-lg my-5 mx-0 sm:mx-1 mb-20 animate-pulse">
      <div className="my-4">
        <div className="h-40 bg-gray-300 rounded-2xl"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex">
          <div className="mr-4 rounded-full mx-1">
            <div className="w-11 h-11 bg-gray-300 rounded-full"></div>
          </div>
          <div>
            <div className="w-32 h-5 bg-gray-300 rounded"></div>
            <div className="w-20 h-3 bg-gray-300 rounded mt-2"></div>
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      </div>
      <div className="my-4 campaign-container min-w-[300px] max-w-[768px]">
        <div className="w-48 h-6 bg-gray-300 rounded mb-4"></div>
        <div className="flex my-2 items-center">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="w-32 h-4 bg-gray-300 rounded ml-2"></div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-300 rounded"></div>
          <div className="w-full h-4 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="w-24 h-3 bg-gray-300 rounded mt-4"></div>
      </div>
      <div className="flex mt-4 text-sm justify-between mb-3">
        <div className="flex mr-5 items-center w-full">
          <div className="p-3 w-full h-10 bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex items-center w-full">
          <div className="p-3 w-full h-10 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
</div>

        </>
      )
    
  } 

{ campaignData && (

    <>
<div className="sm:bg-gray-100  bg-white h-screen">
    <div className="flex flex-col sm:bg-gray-100  bg-white justify-center items-center      ">
        
   <div className="p-4 max-w-lg border-gray-700 bg-white rounded-lg my-5  mx-0  sm:mx-1  mb-20">
   <div className="my-4">

    {campaignData?.campaignFiles?.length > 0 && (
        <div className="">
        <img className="rounded-2xl"  src={campaignData?.campaignFiles[0]?.filePath  }   
            />
              </div>
    )}
  

</div>

        <div className="flex items-center justify-between">
          <div className="flex">
            <div className="mr-4   rounded-full mx-1">
              <img src="/images/Avatar.png" width={45} height={45} alt="Avatar" />
            </div>
            <div>
              <div className="font-semibold text-lg">{item?.campaignOwner}</div>
              <div className="text-xs">
                <i>{item?.campaignOwnerTitle}</i>
              </div>
            </div>
          </div>
          <div className="p-1 cursor-pointer">
            <img src={danger} alt="Report" onClick={openReportMenu} />
          </div>
        </div>

        <div className="my-4 campaign-container min-w-[300px] max-w-[648px] ">
  <h1 className="font-medium">{campaignData?.campaignTitle}</h1>
  <p className="flex my-2 text-customBlue font-medium text-justify">
    <img src={link} alt="Link" />
    <span className="px-1">www.powertothepeople.com</span>
  </p>

  <div className="text-justify my-2 pb-3  description-container">
    {campaignData?.description}
    <p className="text-justify text-xs py-2">18 June, 2024</p>
  </div>
</  div>


        <div className="flex mt-4 text-sm justify-between mb-3">
          <div className="flex mr-5 items-center w-full">
            <button className="p-3 bg-customBlue text-white text-xs rounded-md w-full" onClick={openShareCampaignModal}>
              Share Campaign
            </button>
          </div>
          <div className="flex items-center w-full">
            <button className="p-3 bg-customBlue   text-xs  text-white rounded-md w-full" onClick={openEndorseMenu} >Endorse Campaign</button>
          </div>
        </div>
      </div>


    </div>
    </div>
    </>
)}



    {/* Endorese Campaign 2*/}
  

 

  { /* Report   */} 
    <div className={`fixed inset-0 transition-opacity ${reportMenu ? 'flex' : 'hidden'} items-center justify-center `}>
    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
    <span
            className="absolute top-5   z-50  bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={closeReportMenu}
          >
           <img    src={close} alt="x"  width={40} height={40}/>
          </span>

    <div className="relative p-4 w-full max-w-lg mx-1  max-h-full">
{/* Modal content */}
<div className="relative bg-white rounded-lg shadow">
  
    {/* Report Campaign */}
  <div className="p-4 md:p-5">
    <h1 className="font-medium text-center py-4"> Report Campaign</h1>
    <form className="space-y-8" action="#">
      <div>

        <select
          
          name="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >

            <option disabled> Complaint</option>
            <option> Option 1</option>
            <option> Option 2</option>

          </select>
      </div>


      <div className="mb-10">  
    <textarea
       
      name="email"
      id="email"
      rows={6}
      className=" resize-none mb-12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      placeholder="Description"
     
    />
  </div>
     
      <button
        type="submit"
        className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
        "
      >
     Report
      </button>
 
    </form>
  </div>
</div>
</div>

          
    </div>





    <CampaignMenu 
        isOpen={campaignMenuOpen} 
        onClose={closeCampaignMenu} 
      />

 

<EndorseCampaignModal
        isOpen={endorseMenu}
        onClose={closeEndorseMenu}
        onSubmit={submitEndorsement}
      />


{/* <ReportCampaignModal
        isOpen={ReportCampaignModal}
        onClose={closeReportCampaignModal}
        onSubmit={submitReport}
      /> */}

{/* 
    <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={closeSubscriptionModal}
        onSubmit={handleSubPlanSelect}
      /> */}

    {/* <PurchaseUnitsModal
        isOpen={showPurchaseUnitsModal}
        onClose={closePurchaseUnitsModal}
        onSubmit={submitUnitsToPurchase}
      /> */}

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
        details ={allData}
      />








  </>
  );
};

export default ViewCampaign;