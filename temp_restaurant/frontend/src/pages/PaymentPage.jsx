import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { cart } = location.state || { cart: [] };
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Aktif session_id'yi çek
      const sessionRes = await axios.get(`http://localhost:8000/tables/session/active/${tableId}`);
      const session_id = sessionRes.data.id;

      const orderData = {
        table_id: parseInt(tableId),
        status: 'pending',
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          special_instructions: ''
        })),
        amount: total,
        method: paymentMethod,
        session_id
      };

      const response = await axios.post('http://localhost:8000/order/', orderData);
      if (response && response.data && response.data.id) {
        localStorage.setItem('lastOrderId', response.data.id);
      }
      navigate(`/payment-success/${tableId}`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 drop-shadow-sm">Payment</h1>
          <p className="text-lg text-gray-500">Select a payment method to complete your order</p>
        </div>
        <div className="bg-white/95 rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-200">
          <div className="p-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900 text-lg">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-orange-500 text-lg">{(item.price * item.quantity).toFixed(2)}₺</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-orange-500">{total.toFixed(2)}₺</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/95 rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-200">
          <div className="p-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Payment Method</h2>
            <div className="space-y-4">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors duration-200 gap-3 ${paymentMethod === 'cash' ? 'bg-orange-50 border-orange-400 shadow' : 'hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <span className="text-2xl">💵</span>
                <div>
                  <span className="block text-base font-semibold text-gray-900">Cash</span>
                  <span className="block text-sm text-gray-500">Pay with cash at the counter</span>
                </div>
              </label>
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors duration-200 gap-3 ${paymentMethod === 'credit_card' ? 'bg-orange-50 border-orange-400 shadow' : 'hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <span className="text-2xl">💳</span>
                <div>
                  <span className="block text-base font-semibold text-gray-900">Credit Card</span>
                  <span className="block text-sm text-gray-500">Pay with your card</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-200 ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Complete Payment'
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
