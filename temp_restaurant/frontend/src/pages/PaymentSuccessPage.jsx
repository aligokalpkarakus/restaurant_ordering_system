import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { tableId } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/table/${tableId}`);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, tableId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-12 w-12 text-green-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Redirecting to the main menu...</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 