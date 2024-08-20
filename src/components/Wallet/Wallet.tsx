import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import { baseURL } from '../URL';
import usePost from '../Hooks/usePost';
import useFetch from '../Hooks/useFetch';
import incoming from '../svg/incoming.svg'
import FundWallet from './FundWallet';
import PaymentMethodModal from './PaymentMethod';
import { toast } from "react-toastify";
import { Backdrop, CircularProgress } from "@mui/material";
import FundingSuccessful from './FundingSuccessful';

const Wallet = () => {
  
    const [accountId, setAccountId] = useState<any>(null);
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [fundWalletModal, setFundWalletModal] = useState(false);
    const [fundingSuccessModal, setFundingSuccessModal] = useState(false);
    const [units, setUnits] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<any>(null);
    const [paymentMethodModal, setPaymentMethodModal] = useState(false);
    const [allData, setAllData] = useState<any>(null);
    const onSuccess = () => {};
    const onError = () => {};
    const openPaymentMethodModal = () => setPaymentMethodModal(true);
    const closePaymentMethodModal = () => setPaymentMethodModal(false);
    const openFundWalletModal = () => setFundWalletModal(true);
    const closeFundWalletModal = () => setFundWalletModal(false);
    const openFundingSuccess = () => setFundingSuccessModal(true);
    const closeFundingSuccess = () => setFundingSuccessModal(false);
 
    const walletURL = `${baseURL}/Wallet/WalletProfile`;
    const { data: WalletData, refreshApi: refreshWalletData, error: walletError, loading: WalletDataLoading } = useFetch(walletURL, "GET", onSuccess, onError);
    const walletBalance = WalletData?.walletBalance;

    useEffect(() => {
        let userDataString = window.localStorage.getItem("userData");

        if (userDataString) {
            let userData = JSON.parse(userDataString);
            const accountId = userData.id;
            setAccountId(accountId);
            console.log("Account ID", accountId);

        } else {
            console.log("No userData found in localStorage");
        }
    }, []); 

    const handleUnitsAmount = (x: any) => {
        setUnits(x);
        closeFundWalletModal();
        openPaymentMethodModal();
    }

    const submitPaymentMethod = (method: any) => {
        setPaymentMethod(method);
        closePaymentMethodModal();
        console.log("Preferred method:", method);
        setAllData({ ...allData, units: units, paymentMethod: method, walletBalance: walletBalance, accountId: accountId });
        if (method === "Paystack") {
            InitializePayment();
        }
    }

    const URL = `${baseURL}/Wallet/InitializePaystackPayment`;

    const InitializePayment = async () => {
        setLoading(true);

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                },
                body: JSON.stringify({accountId,units}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
           setApiResponse(responseData.data);
           if(responseData){
            window.open(`${responseData.data.authorization_url}`, '_blank');
           }
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
            openFundingSuccess();

        }
    };


    const VerifyPayStackPayment = async () => {
        setLoading(true);

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                },
                body: JSON.stringify({reference: apiResponse.reference}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
        //    setApiResponse(responseData.data);
           if(responseData.succeeded==true){
           TopWallet()
           }
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            // setLoading(false);
            // openFundingSuccess();

        }
    };


    const TopWallet= async () => {
        setLoading(true);

        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                },
                body: JSON.stringify({reference: apiResponse.reference}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
        //    setApiResponse(responseData.data);
           if(responseData.succeeded==true){
          openFundingSuccess();
          setLoading(false);
           }
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            // setLoading(false);
        }
    };



    return (
        <>
            <Navbar />
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <div className={`flex bg-gray-100 justify-center h-screen `}>
                <div className=" mt-10 ">
                <div className={`p-4 w-full md:max-w-md border-gray-700 bg-white rounded-lg my-2 bg-cover  bg-center overflow-hidden ${WalletDataLoading && 'animate-pulse'}`} 
                style={{ backgroundImage: 'url(images/frame2.png)' }}>
                          
                            <div className="mt-3  pl-2 pr-10">
                                <h1 className="text-sm text-customBlue">
                                Wallet Ballance
                                </h1>
                            </div>

                            <div className="mt-2 pl-2 pr-10">
                                <h1 className="text-3xl font-bold text-customBlue">
                               {walletBalance}
                                </h1>
                            </div>  

                            <div className="mt-5 pl-2  ">
                            <button 
                                className="px-10 py-2  bg-customBlue hover:bg-gray-900 text-white rounded-md  "
                                onClick={ () => setFundWalletModal(true)}
                                >
                                  Fund Wallet
                            </button>
                            </div>  
                        </div>
                      <div className='font-medium text-lg'> Today</div>
               
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
                                Wallet Funded
                                </h1>
                                <div className="mt-2 text-sm">
                                You funded your wallet with 30 units(30,000 Naira).
                                </div>

                                <div className="mt-2 text-sm">
                                  Balance : <span className='font-medium'> 30,000 Points</span>
                                </div>

                                <div>
                                    <p className="text-xs mt-10">
                                        18 June, 2024
                                    </p>
                                </div>

                            </div>
                        </div>
                </div>
            </div>



            <FundWallet 
            isOpen={fundWalletModal} 
            onClose={closeFundWalletModal} 
            onSubmit={handleUnitsAmount} />

            <PaymentMethodModal
                    isOpen={paymentMethodModal}
                    onClose={closePaymentMethodModal}
                    onSubmit={submitPaymentMethod}
                />

            <FundingSuccessful
              isOpen={fundingSuccessModal}
                 onClose={closeFundingSuccess}
                     details ={allData}
                     />


        </>


    );
};

export default Wallet;
