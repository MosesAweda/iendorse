import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import { baseURL } from '../URL';
import usePost from '../Hooks/usePost';
import useFetch from '../Hooks/useFetch';
import incoming from '../svg/incoming.svg'
import { toast } from "react-toastify";
import { Backdrop, CircularProgress } from "@mui/material";
import RedeemPoints from './RedeemPoints';
import BankDetails from './BankDetails';
import SummaryModal from './SummaryModal';
import EnterPassword from './EnterPassword';
 

const   Earnings = () => {
  
    const [accountId, setAccountId] = useState<any>(null);
    const [apiResponse, setApiResponse] = useState<any>();
    const [allData, setAllData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [redeemPointsModal, setRedeemPointsModal] = useState(false);
    const [bankDetails, setBankDetails] = useState<any>(null);
    const [fundingSuccessModal, setFundingSuccessModal] = useState(false);
    const [points, setPoints] = useState<any>(null);
    const [enterPasswordModal, setEnterPasswordModal] = useState(false);
    const [summaryModal, setSummaryModal] = useState(false);
    const [bankDetailsModal, setBankDetailsModal] = useState(false);
    const onSuccess = () => {};
    const onError = () => {};
    const openBankDetailsModal = () => setBankDetailsModal(true);
    const closeBankDetailsModal = () => setBankDetailsModal(false);
    const openRedeemPointsModal = () => setRedeemPointsModal(true);
    const closeRedeemPointsModal = () => setRedeemPointsModal(false);
    const openFundingSuccess = () => setFundingSuccessModal(true);
    const closeFundingSuccess = () => setFundingSuccessModal(false);
    const openSummaryModal = () => setSummaryModal(true);
    const closeSummaryModal = () => setSummaryModal(false);
    const openEnterPasswordModal = () => setEnterPasswordModal(true);
    const closeEnterPasswordModal = () => setEnterPasswordModal(false);
    const navigate = useNavigate();
 
    const pointsUrl = `${baseURL}/Wallet/PointsProfile`;
    const { data: pointsData, refreshApi: refreshPointsData, error: pointsError, loading: pointsDataLoading } = useFetch(pointsUrl, "GET", onSuccess, onError);
    
    const pointsBalance = pointsData?.totalPointBalance;
    const transactions = pointsData?.pointsTransactions;
 

    useEffect(() => {
        let userDataString = window.localStorage.getItem("userData");

        if (userDataString) {
            let userData = JSON.parse(userDataString);
            const accountId = userData.id;
            setAccountId(accountId);
        } else {
            console.log("No userData found in localStorage");
        }
    }, []); 

    const handlePoints = (x: any) => {
        setPoints(x);
        setAllData({ ...allData, points: x, pointsBalance: pointsBalance, accountId: accountId });
        
        closeRedeemPointsModal();
        openBankDetailsModal();
    }

    const handleBankDetails = () => {
        closeBankDetailsModal();
        console.log("allData", allData);
        openSummaryModal()
    }


    const handleSummary = () =>{
          RedeemEarnedPoints()
        
    }

    const URL = `${baseURL}/Wallet/ReedeemPoint`;

    const RedeemEarnedPoints = async () => {
        setLoading(true);
    
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                },
                body: JSON.stringify({ accountId : accountId,
                                     redeemedPoints: points ,
                                     campaignId : 20   }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const responseData = await response.json();
    
            // Set the API response in state
            setApiResponse(responseData.data);
    
            if (responseData) {
                // Open the authorization URL in a new tab
             toast.success("Points Redeemed Successfully")
             console.log(responseData);
            } 
        } catch (err) {
            console.error((err as Error).message);
            toast.error("Something went wrong");
          
        } finally {
            setLoading(false);
            closeSummaryModal();
            
            
        }
    };
    


   
   

    function formatDate(timestamp: string) {
        const dateObj = new Date(timestamp);
        const options: any = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true // For 12-hour format with AM/PM, set to false for 24-hour format
        };
        return dateObj.toLocaleString('en-GB', options);
      }


    return (
        <>
            <div className='bg-gray-100 h-screen '> 
            <Navbar />
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>
           
            <div className={`flex bg-gray-100 justify-center `}>
                <div className=" mt-10  ">
                <div className={`p-4 w-full md:max-w-md border-gray-700 bg-white rounded-lg my-2 bg-cover  bg-center overflow-hidden ${pointsDataLoading && 'animate-pulse'}`} 
                style={{ backgroundImage: 'url(https://res.cloudinary.com/dgso4wgqt/image/upload/v1733390900/frame2_zxp52a.png)' }}>
                          
                 <div className="mt-3  pl-2 pr-40">
                        <h1 className="text-sm text-white pr-36" >
                        Points Ballance
                        </h1>
                    </div>
                        <div className="mt-2 pl-2 pr-10">
                            <h1 className="text-3xl font-bold text-white">
                            {pointsBalance}
                            </h1>
                            </div>  
                            <div className="mt-5 pl-2  ">
                            <button 
                                className="px-10 py-2  bg-white hover:bg-gray-100 text-customBlue rounded-md  "
                                onClick={ () => setRedeemPointsModal(true)}
                                >
                                  Redeem Points
                            </button>
                            </div>  
                        </div>
                      {/* <div className='font-medium text-lg'> Today</div> */}
               {transactions  && transactions.map((item: any) => (
                <div className=" w-full md:max-w-md p-4 max-w-md border-gray-700 bg-white rounded-lg my-2">
                <div className="flex items-center ">
                    <div className="flex">
                        <div className="mr-4   rounded-full  mx-1">
                            <img src={incoming}   width={50}   height={50}  alt="notification" className="" />
                        </div>
                        
                    </div>
                   
                </div>
                <div className="mt-2  pr-16">
                    <h1 className="font-medium">
                   {item.title}
                    </h1>
                    <div className="mt-2 text-sm">
                   {item.description}
                    </div>

                    <div className="mt-2 text-sm">
                      Balance : <span className='font-medium'> {item?.pointBalance}</span>
                    </div>

                    <div>
                        <p className="text-xs mt-10">
                            {formatDate(item?.dateRecieved)}
                        </p>
                    </div>

                </div>
            </div>
                   
               ))}
                       
                      
                </div>
            </div>
            </div>
      
                <RedeemPoints
                    isOpen={redeemPointsModal}
                    onClose={closeRedeemPointsModal}
                    onSubmit={handlePoints}
                />

                <BankDetails 
                    isOpen={bankDetailsModal}
                    onClose={closeBankDetailsModal}
                    // onSubmit={handleBankDetails}
                    onProceed={handleBankDetails}
                    details ={allData}
                />

                <SummaryModal 
                    isOpen={summaryModal}
                    onClose={closeSummaryModal}
                    onSubmit={handleSummary}
                    details={allData}
                />

{/* 
                <EnterPassword 
                isOpen={enterPasswordModal}
                onClose={closeEnterPasswordModal}
                onSubmit={handlePasswordSubmit}
                />   */}

        </>


    );
};
export default Earnings;
