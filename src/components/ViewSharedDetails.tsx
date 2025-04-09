"use client"

import { useEffect, useState } from "react"
import CampaignMenu from "./ViewCampaign/CampaignMenu"
import EndorseCampaignModal from "./ViewCampaign/EndorseCampaignModal"
import link from "./svg/link.svg"
import PaymentMethodModal from "./ViewCampaign/PaymentMethodModal"
import Navbar from "./NavBar/Navbar"
import { baseURL } from "./URL"
import InsufficientWalletBalanceModal from "./ViewCampaign/InsufficientWalletBallance"
import SummaryModal from "./ViewCampaign/SummaryModal"
import usePost from "./Hooks/usePost"
import ShareCampaignModal from "./ViewCampaign/ShareCampaignModal"
import { useParams } from "react-router-dom"
import danger from "./svg/danger.svg"
import EndorsementSuccessfulModal from "./ViewCampaign/EndorsementSuccessfulModal"
import Initials from "./Initials"
import ReportCampaign from "./ViewCampaign/ReportCampaign"
import EndorsementFailed from "./ViewCampaign/EndorsementFailed"

const ViewSharedDetails = ({ item }: any) => {
  const { uid } = useParams()
  const [endorseMenu, setEndorseMenu] = useState(false)
  const [reportMenu, setReportMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaignMenuOpen, setCampaignMenuOpen] = useState(false)
  const [showEndorseMenu, setShowEndorseMenu] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showPurchaseUnitsModal, setPurchaseUnitsModal] = useState(false)
  const [paymentMethodModal, setPaymentMethodModal] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [insufficientWalletModal, setInsufficientWalletModal] = useState(false)
  const [endorsementFailed, setEndorsementFailed] = useState(false)
  const [summaryModal, setSummaryModal] = useState(false)
  const [endorsementSuccessfulModal, setEndorsementSuccessfulModal] = useState(false)
  const [shareCampaignModal, setShareCampaignModal] = useState(false)
  const [unitsToPurchase, setUnitsToPurchase] = useState<number>(0)
  const [endorsementNote, setEndorsementNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [allData, setAllData] = useState<any>({})
  const onSuccess = () => {}
  const onError = () => {}
  const openCampaignMenu = () => setCampaignMenuOpen(true)
  const closeCampaignMenu = () => setCampaignMenuOpen(false)
  const openEndorseMenu = () => setEndorseMenu(true)
  const closeEndorseMenu = () => setEndorseMenu(false)
  const openSubscriptionModal = () => setShowSubscriptionModal(true)
  const closeSubscriptionModal = () => setShowSubscriptionModal(false)
  const openPurchaseUnitsModal = () => setPurchaseUnitsModal(true)
  const closePurchaseUnitsModal = () => setPurchaseUnitsModal(false)
  const openPaymentMethodModal = () => setPaymentMethodModal(true)
  const closePaymentMethodModal = () => setPaymentMethodModal(false)
  const openInsufficientWalletModal = () => setInsufficientWalletModal(true)
  const closeInsufficientWalletModal = () => setInsufficientWalletModal(false)
  const opensummarymodal = () => setSummaryModal(true)
  const closeSummaryModal = () => setSummaryModal(false)
  const openEndorsementSuccessfulModal = () => setEndorsementSuccessfulModal(true)
  const openEndorsementFailed = () => setEndorsementFailed(true)
  const closeEndorsementSuccessfulModal = () => {
    setEndorsementSuccessfulModal(false)
    setAllData({})
  }
  const closeEndorseFailed = () => {
    setEndorsementFailed(false)
    setAllData({})
  }
  const openShareCampaignModal = () => setShareCampaignModal(true)
  const closeShareCampaignModal = () => setShareCampaignModal(false)
  const closeReportMenu = () => {
    setReportMenu(false)
  }
  const openReportMenu = () => {
    setReportMenu(true)
  }

  const endorseWithWalletURL = `${baseURL}/Campaign/EndorseCampaignWithWallet`
  const walletURL = `${baseURL}/Wallet/WalletProfile`
  //   const { data: WalletData, refreshApi: refreshWalletData, error: walletError, loading: WalletDataLoading
  //   } = useFetch(walletURL, "GET", onSuccess, onError);

  const campaignURL = `${baseURL}/Campaign/SharedCampaignDetails?CampaignId=${uid}`

  // Replace the useFetch hook with these state variables
  const [campaignData, setCampaignData] = useState<any>()
  const [DataError, setDataError] = useState(null)
  const [DataLoading, setDataLoading] = useState(false)

  // Add this function to fetch campaign data
  const fetchCampaignData = async () => {
    setDataLoading(true)

    try {
      const response = await fetch(campaignURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ campaignId: uid }), // Add any required parameters
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      if (responseData) {
        setCampaignData(responseData.data || responseData)
      }
    } catch (err: any) {
      console.error("Error fetching campaign data:", err)
      setDataError(err)
    } finally {
      setDataLoading(false)
    }
  }

  // Add this useEffect to call the fetch function
  useEffect(() => {
    if (uid) {
      fetchCampaignData()
    }
  }, [uid])

  // Remove this code:
  // const {
  //   data: campaignData,
  //   refreshApi: refresCampaignData,
  //   error: DataError,
  //   loading: DataLoading,
  // } = useFetch(
  //   campaignURL,
  //   "POST",
  //   () => {},
  //   () => {},
  // )

 

  const fetchWalletBalance = async () => {
    setLoading(true)

    try {
      const response = await fetch(walletURL, {
        method: "POST", // Changed from GET to POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify({}), // Add an empty body or any required parameters
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      if (responseData) {
        //toast("Wallet fetched")
        setWalletBalance(responseData.data.walletBalance)
      }
    } catch (err) {
      //  toast.error((err as Error).message);
      console.error("Error posting data:", err)
    } finally {
      setLoading(false)
    }
  }

  const endorseWithWalletData = {
    campaignId: uid,
    numberOfUnits: unitsToPurchase,
    endorsementNote: endorsementNote,
  }

  const { data: ApiFeedback, loading: ApiFeedbackLoading, error, postData } = usePost(endorseWithWalletURL)

  const submitEndorsement = (units: number, note: any) => {
    setUnitsToPurchase(units)
    setEndorsementNote(note)
    setAllData({ ...allData, unitsToPurchase: units, endorsementNote: note })
    console.log("All ENDORSEMENT DATA>>>>>>>>", allData)
    closeEndorseMenu()
    openPaymentMethodModal()
    fetchWalletBalance()
  }

  const submitPaymentMethod = (method: any) => {
    setAllData({ ...allData, paymentMethod: method, walletBalance: walletBalance, campaignId: uid })
    setPaymentMethod(method)
    const preferredPaymentMethod = method
    closePaymentMethodModal()
    console.log(" Prefered PAyment method:", preferredPaymentMethod)
    if (preferredPaymentMethod == "Wallet") {
      if (unitsToPurchase > walletBalance) {
        setInsufficientWalletModal(true)
      } else {
        console.log("opening summary modal")
        opensummarymodal()
      }
    }
  }

  const PayWithWallet = async () => {
    console.log("..........Paying with wallet")
    try {
      await postData(endorseWithWalletData)
    } catch (err) {
      console.error("Error posting data:", err)
      // toast.error("Failed to Endorse. Please try again.");
      openEndorsementFailed()
      return
    }
  }

  useEffect(() => {
    if (ApiFeedback) {
      console.log(ApiFeedback)
      closeSummaryModal()
      openEndorsementSuccessfulModal()
    }
  }, [ApiFeedback])

  useEffect(() => {
    if (error) {
      console.error("Error fetching data:", error)
      openEndorsementFailed()
      closeSummaryModal()
      // toast.error("Failed to endorse. Please try again.");
    }
  }, [error])

  function formatDate(timestamp: string) {
    const dateObj = new Date(timestamp)
    const options: any = { year: "numeric", month: "long", day: "numeric" }
    return dateObj.toLocaleDateString("en-GB", options)
  }

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  function TextComponent() {
    // The string with literal \n characters
    const text = "action is specifically designed to address their feelings.\\nThe Magic is here"

    // Convert literal \n to actual newlines
    const formattedText = text.replace(/\\n/g, "\n")

    return <div style={{ whiteSpace: "pre-line" }}>{formattedText}</div>
  }

  return (
    <>
      <Navbar />

      {DataLoading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-colorBlue"></div>
        </div>
      )}

      {!DataLoading && (!campaignData || DataError) && (
        <div className=" flex justify-center items-center pb-20  px-10 h-screen">
          <div className="text-center p-6 bg-white rounded-lg shadow-md mb-20">
            <h2 className="text-2xl font-bold text-customBlue mb-4">Campaign Not Found</h2>
            <p className="text-gray-600 mb-4">
              The campaign you are looking for might have been removed or is currently unavailable.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => window.history.back()}
                className="bg-customBlue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {campaignData && (
        <>
          <div className="sm:bg-gray-100  bg-white h-screen mt-20">
            <div className="flex flex-col sm:bg-gray-100  bg-white justify-center items-center      ">
              <div className="p-4 max-w-lg border-gray-700 bg-white rounded-lg my-5  mx-0  sm:mx-1  mb-20">
                <div className="my-4">
             
                    <img
                      className="rounded-2xl w-full"
                      src={campaignData?.campaignImage || "/placeholder.svg"}
                      alt="Campaign Media"
                    />
                
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="  inline-block  z-1 mr-3">
                      {campaignData?.campaignOwnerImage ? (
                        <img
                          className="rounded-full border-2 w-10 h-10    border-white"
                          style={{ boxShadow: "0 0 0 1px #0D236E" }}
                          src={campaignData?.campaignOwnerImage || "/placeholder.svg"}
                          alt=""
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-blue-100 rounded-full text-customBlue p-2">
                          <Initials fullName={item?.campaignOwner} className="text-lg font-medium" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{campaignData?.campaignOwner}</div>
                      <div className="text-xs">
                        <i>{campaignData?.campaignOwnerTitle}</i>
                      </div>
                    </div>
                  </div>
                  <div className="p-1 cursor-pointer">
                    <img src={danger || "/placeholder.svg"} alt="Report" onClick={openReportMenu} />
                  </div>
                </div>

                <div className="my-4 campaign-container min-w-[300px] max-w-[648px] ">
                  <h1 className="font-medium">{campaignData?.campaignTitle}</h1>
                  <p className="flex my-2 text-customBlue font-medium text-justify">
                    <img src={link || "/placeholder.svg"} alt="Link" />
                    <a href={campaignData?.campaignUrl}>
                      <span className="px-1">{campaignData?.campaignUrl}</span>{" "}
                    </a>
                  </p>

                  <div className="text-justify my-2 pb-3 description-container">
                    <div style={{ whiteSpace: "pre-line" }}>{campaignData?.description}</div>
                
                  </div>

                        <div className="text-xs text-gray-700 my-2"> 
                  <div >
                    <span > Shared Date: {formatDate(campaignData?.sharedDate)}</span> 
                  </div>
                  <div> 
                    <span> Points Earned: {campaignData.pointEarned}</span>
                  </div>
                </div>

                <div  className="mt-4">
                      <button className="w-full bg-customBlue text-white p-2 rounded-md hover:bg-blue-700 transition-colors" onClick={openEndorseMenu}>
                        Request Points 
                        </button>
                   </div>


                </div>
     
        
              </div>
            </div>
          </div>

          <CampaignMenu isOpen={campaignMenuOpen} onClose={closeCampaignMenu} />

          <ReportCampaign isOpen={reportMenu} onClose={closeReportMenu} campaignId={campaignData?.campaignId} />

          <EndorseCampaignModal isOpen={endorseMenu} onClose={closeEndorseMenu} onSubmit={submitEndorsement} />

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
            details={allData}
            ApiLoading={ApiFeedbackLoading}
          />

          <EndorsementSuccessfulModal
            isOpen={endorsementSuccessfulModal}
            onClose={closeEndorsementSuccessfulModal}
            details={allData}
          />

          <EndorsementFailed isOpen={endorsementFailed} onClose={closeEndorseFailed} details={allData} />

          <ShareCampaignModal isOpen={shareCampaignModal} onClose={closeShareCampaignModal} details={campaignData} />
        </>
      )}

      {/* All existing modals remain the same */}
    </>
  )
}

export default ViewSharedDetails
