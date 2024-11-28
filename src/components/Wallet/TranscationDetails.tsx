import React, { useState, useEffect } from 'react';
import { baseURL } from '../URL';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import { toast } from 'react-toastify';

const TransactionDetails = () => {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const { reference } = location.state || {};
  const navigate = useNavigate();
  const url = `${baseURL}/Wallet/VerifyPaystackPaymentResponse`;

  const fetchTransactionData = async () => {
    if (!reference) {
      setError("Transaction reference is missing");
      return;
    }

    try {
      setError('');
      const token = window.localStorage.getItem('token');
      if (!token) {
        setError("User is not authenticated. Please log in.");
        return;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction data');
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log
      setTransactionData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to validate payment, please try again or contact support.');
    }
  };

  useEffect(() => {
    fetchTransactionData();
    const intervalId = setInterval(fetchTransactionData, 10000);
    return () => clearInterval(intervalId);
  }, []);



  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex bg-gray-100 justify-center">
        <div className="flex flex-col mt-10 mx-3">
          {error && (
            <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-6 text-red-600">
              <h2 className="text-xl font-bold mb-4">Error</h2>
              <div>{error}</div>
            </div>
          )}

          {!error && !transactionData && (
            <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold mb-4 text-customBlue">Pending...</h2>
              <div>Your transaction is being verified by the system.</div>
            </div>
          )}

          {transactionData && (
            <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold mb-4 text-customBlue">Transaction Successful</h2>
              {/* Transaction Details */}
              <div className="mb-2">
                <span className="font-semibold text-gray-600">Amount:</span>
                <span className="ml-2 text-gray-800">{transactionData?.data?.formattedAmount}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-600">Payment Status:</span>
                <span
                  className={`ml-2 ${transactionData?.data?.paymentStatus === 'SUCCESSFUL'
                    ? 'text-green-600'
                    : 'text-gray-600'
                    }`}
                >
                  {transactionData?.data?.paymentStatus}
                </span>
              </div>
              {/* Other details */}
              <button
                onClick={() => navigate('/wallet')}
                className="mt-5 w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Back to wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
