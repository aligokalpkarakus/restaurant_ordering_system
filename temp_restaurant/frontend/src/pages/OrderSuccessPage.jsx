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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc]">
      <div className="flex flex-col items-center bg-white/95 rounded-2xl shadow-2xl px-12 py-16 border border-gray-100">
        <svg className="h-20 w-20 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2l4-4" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişiniz Alındı!</h1>
        <p className="text-gray-600 mb-6">Siparişiniz mutfağa iletildi. Durumunu siparişlerim bölümünden takip edebilirsiniz.</p>
        <button onClick={() => navigate(`/table/${tableId}`)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl text-lg shadow-lg transition-all">Menüye Dön</button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 