import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CampaignMenu from "./CampaignMenu";
import PromoteModal from "./PromoteModal";
import link from '../svg/link.svg';
import threeDots from '../svg/threeDots.svg';
import SubscriptionModal from "./SubscriptionModal";
import PurchaseUnitsModal from "./PurchaseUnitsModal";
import PaymentMethodModal from "./PaymentMethodModal";
import useFetch from "../Hooks/useFetch";
import { baseURL } from "../URL";
import InsufficientWalletBalanceModal from "./InsufficientWalletBallance";
import SummaryModal from "./SummaryModal";
import usePost from "../Hooks/usePost";
import PromotionSuccessfulModal from "./PromotionSuccessfulModal";
import ShareCampaignModal from "../ViewCampaign/ShareCampaignModal";
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import ConfirmSubscription from "./ConfirmSubscription";




interface ApiResponse {
  data: any;
  loading: boolean;
  error: Error | null;
  postData: (body: any) => Promise<void>;
}

interface CarouselProps {
  children: React.ReactNode[];
  showArrows?: boolean;
  showIndicators?: boolean;
}

const FeedCampaign = ({ item }: any) => {
  const [campaignMenuOpen, setCampaignMenuOpen] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const[confirmSubModal, setConfirmSubModal] = useState(false) 
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPurchaseUnitsModal, setPurchaseUnitsModal] = useState(false);
  const [paymentMethodModal, setPaymentMethodModal] = useState(false);
  const [insufficientWalletModal, setInsufficientWalletModal] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);
  const [promotionSuccessfulModal, setPromotionSuccessfulModal] = useState(false);
  const [shareCampaignModal, setShareCampaignModal] = useState(false);
  const [promotionType, setPromotionType] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [unitsToPurchase, setUnitsToPurchase] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [allData, setAllData] = useState<any>({});
  const onSuccess = () => {}
  const onError = () => {}
  const openCampaignMenu = () => { setCampaignMenuOpen(true);  document.body.style.overflow = 'hidden'; };
  const closeCampaignMenu = () => {setCampaignMenuOpen(false); document.body.style.overflow = 'auto'; };
  const openPromoteModal = () => {setShowPromoteModal(true); document.body.style.overflow = 'hidden'; };
  const closePromoteModal = () => {setShowPromoteModal(false); document.body.style.overflow = 'auto'; };
  const openSubscriptionModal = () => { setShowSubscriptionModal(true);  };
  const closeSubscriptionModal = () =>{  setShowSubscriptionModal(false)  };
  const openPurchaseUnitsModal = () => { setPurchaseUnitsModal(true); document.body.style.overflow = 'hidden'; };
  const closePurchaseUnitsModal = () => {setPurchaseUnitsModal(false); document.body.style.overflow = 'auto'; };
  const openPaymentMethodModal = () => setPaymentMethodModal(true);
  const closePaymentMethodModal = () => setPaymentMethodModal(false);
  const openInsufficientWalletModal = () => setInsufficientWalletModal(true);
  const closeInsufficientWalletModal = () => setInsufficientWalletModal(false);
  const opensummarymodal = () => setSummaryModal(true);
  const closeSummaryModal = () => setSummaryModal(false);
  const openConfirmSubscription = () => setConfirmSubModal(true);
  const closeConfirmSubscription = () => {setConfirmSubModal(false); setAllData({})};
  const openPromotionSuccessfulModal = () => setPromotionSuccessfulModal(true);
  const closePromotionSuccessfulModal = () => {setPromotionSuccessfulModal(false); setAllData({})};
  const openShareCampaignModal = () => setShareCampaignModal(true);
  const closeShareCampaignModal = () =>   setShareCampaignModal(false);
   const [isExpanded, setIsExpanded] = useState(false);
    const toggleReadMore = () => setIsExpanded(!isExpanded);
    const maxLength = 100; 

const campaignId = item.campaignId;
const walletURL = `${baseURL}/Wallet/WalletProfile`
  const { data: WalletData, refreshApi: refreshWalletData, error: walletError, loading: WalletDataLoading
  } = useFetch(walletURL, "GET", onSuccess, onError);
 const walletBalance = WalletData?.walletBalance;


const endorseWithWalletURL = `${baseURL}/Campaign/EndorseCampaignWithWallet`

const endorseWithWalletData = {
  campaignId: campaignId,
  numberOfUnits: unitsToPurchase,
  endorsementNote: "I hereby Endorse "
}
 const { data:ApiFeedback, loading: ApiFeedbackLoading, error, postData} = usePost(endorseWithWalletURL);


  const handleSelectPromotionType = (type: string) => {
    setPromotionType(type);   
    
  }

  const submitPromotionType = (promotionType: string) => {
    if(promotionType === "PurchaseUnits"){
      openPurchaseUnitsModal();
    } else if(promotionType === "Subscription"){
      openSubscriptionModal();
    }
    setAllData({...allData, promotionType: promotionType});
    closePromoteModal()
}

  const handleSubPlanSelect = (type: string) => {
    setSubscriptionPlan(type);  
    setAllData({...allData, subscriptionPlan: type});
   closeSubscriptionModal();
   //toast.success("Subscription Plan Selected");
   //openPaymentMethodModal();
   openConfirmSubscription();
  }

  const submitUnitsToPurchase = (units:number) => {
    setUnitsToPurchase(units)
    setAllData({...allData, unitsToPurchase: units});
    closePurchaseUnitsModal();
    openPaymentMethodModal();
  }

  const submitPaymentMethod = (method: any) => {
    setAllData({ ...allData, paymentMethod: method, walletBalance: walletBalance, campaignId: campaignId });
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
      toast.error("Failed to promote. Please try again.");
      return;
    }
  };

  useEffect(() => {
    if (ApiFeedback) {
      console.log(ApiFeedback);
         closeSummaryModal()
    openPromotionSuccessfulModal();
 
    }
    
  }, [ApiFeedback]);
  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to promote. Please try again.");
    }
  }, [error]);

  function formatDate(timestamp:string) {
    const dateObj = new Date(timestamp);
    const options:any = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-GB', options);
  }
  return (
    <>
      <div className="p-4 w-full  max-w-xl sm:border-gray-200 sm:border  bg-white rounded-2xl my-5 px-6">
      <div className="flex items-center justify-between mb-3" >
          <div>
            <button className="bg-green-100 text-green-600 rounded-lg px-4 py-2 text-xs font-medium">
            {item?.campaignUnit}  Points Left 
            </button>
          </div>
          <div onClick={openCampaignMenu} className="cursor-pointer">
            <img src={threeDots} />
          </div>
        </div>

        <Carousel 
  indicators={item?.campaignFiles.length > 1} // Display indicators only if more than one file
>
  {item?.campaignFiles.map((file: any, index: any) => (
    <div 
      key={index} 
      className="flex items-center justify-center bg-black w-full h-[300px] rounded-lg"
    >
      {file.filePath.endsWith('.mp4') ? (
        <video 
          className="w-full max-h-full object-cover" 
          muted 
          playsInline
        >
          <source src={file.filePath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img 
          src={file.filePath} 
          alt={`Campaign ${index}`} 
          className="w-full max-h-full object-cover" 
        />
      )}
    </div>
  ))}
        </Carousel>

<div>
<div className="my-4">
        <h1 className="font-medium text-lg truncate">{item?.campaignTitle}</h1>
        <div className="mt-2">
          <p className="text-justify text-sm">
            {isExpanded ? item?.description : `${item?.description.slice(0, maxLength)}...`}
          </p>
          {item?.description?.length > maxLength && (
            <button
              onClick={toggleReadMore}
              className="text-customBlue font-medium mt-2"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
</div>

 
 



  
<div className="flex justify-between mt-10 mb-3 text-sm gap-x-2">
  {[
    { label: "Share Campaign", onClick: openShareCampaignModal },
    { label: "Promote Campaign", onClick: openPromoteModal },
  ].map((button, index) => (
    <div key={index} className="flex items-center w-full">
      <button
        className="w-full p-2 bg-customBlue text-white rounded-md truncate"
        onClick={button.onClick}
        style={{ minWidth: "120px" }}
      >
        <span className="text-xs">{button.label}</span>
      </button>
    </div>
  ))}
</div>


       
      </div>

      <CampaignMenu 
        isOpen={campaignMenuOpen} 
        onClose={closeCampaignMenu} 
        details={item}
      />

      <PromoteModal
        isOpen={showPromoteModal}
        onClose={closePromoteModal}
        onSubmit={submitPromotionType}
      />

    <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={closeSubscriptionModal}
        onSubmit={handleSubPlanSelect}
      />

    <PurchaseUnitsModal
        isOpen={showPurchaseUnitsModal}
        onClose={closePurchaseUnitsModal}
        onSubmit={submitUnitsToPurchase}
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


    <PromotionSuccessfulModal
            isOpen={promotionSuccessfulModal}
            onClose={closePromotionSuccessfulModal}
            details ={allData}
          />



    <ConfirmSubscription
            isOpen={confirmSubModal}
            onClose={closeConfirmSubscription}
            details ={allData}
          />


      <ShareCampaignModal
              isOpen={shareCampaignModal}
              onClose={closeShareCampaignModal}
              details ={item}
            />


    </>
  );
};

export default FeedCampaign;