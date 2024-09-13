import React, { useState, useEffect } from 'react';
import { baseURL } from '../URL';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';

const TransactionDetails = () => {
  const [transactionData, setTransactionData] = useState<any>(null); // Changed from [] to null
  const [error, setError] = useState("");
  const location = useLocation();
  const { access_code, reference } = location.state || {};

  const navigate = useNavigate();
  const url = `${baseURL}/Wallet/VerifyPaystackPaymentResponse`;

  const fetchTransactionData = async () => {
    try {
      setError(""); // Reset the error state before making the request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reference }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction data');
      }

      const data = await response.json();
      setTransactionData(data); // Set the fetched data
    } catch (err) {
      setError('Error fetching transaction data');
    }
  };

  useEffect(() => {
    fetchTransactionData();
    const intervalId = setInterval(fetchTransactionData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateStr: any) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Navbar />

      <div className="flex bg-gray-100 justify-center">
        <div className="flex flex-col mt-10 mx-3">
      
        {/* {(transactionData === null || transactionData?.data?.paymentStatus === 'PENDING') && ( */}

            {(transactionData === null ) && (
              <>
                <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-bold mb-4 text-customBlue">Pending...</h2>
                <div>Your transaction is being verified by the system.</div>
                </div>
              </>
            )}
            {transactionData && (
              <>
                <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-bold mb-4 text-customBlue">Transaction Successful</h2>

                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Amount:</span>
                  <span className="ml-2 text-gray-800">{transactionData?.data?.formattedAmount}</span>
                </div>

                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Payment Status:</span>
                  <span className={`ml-2 ${transactionData?.data?.paymentStatus === 'SUCCESSFUL' ? 'text-green-600' : 'text-green-600'}`}>
                    {transactionData?.data?.paymentStatus}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Payment Type:</span>
                  <span className="ml-2 text-gray-800">{transactionData?.data?.paymentType}</span>
                </div>

                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Payment Channel:</span>
                  <span className="ml-2 text-gray-800">{transactionData?.data?.paymentChannel}</span>
                </div>

                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Transaction ID:</span>
                  <span className="ml-2 text-gray-800">{transactionData?.data?.transactionId}</span>
                </div>

                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Payment Reference:</span>
                  <span className="ml-2 text-gray-800">{transactionData?.data?.paymentReference}</span>
                </div>

                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Initiated Date:</span>
                  <span className="ml-2 text-gray-800">{formatDate(transactionData?.data?.initiatedPaymentDate)}</span>
                </div>

                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Confirmed Date:</span>
                  <span className="ml-2 text-gray-800">{formatDate(transactionData?.data?.confirmedPaymentDate)}</span>
                </div>
                <button
              onClick={() => navigate('/wallet')}
              className="mt-5 w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Back to wallet
            </button>
                </div>
              </>
            )}
       

        
          </div>
        </div>
      </div>
  
  );
};

export default TransactionDetails;
