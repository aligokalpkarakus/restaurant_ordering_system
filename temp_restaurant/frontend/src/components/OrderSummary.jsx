import React from 'react';

const OrderSummary = ({ cart, onUpdateQuantity, onRemoveItem, onProceedToPayment }) => {
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="bg-white border-t-4 border-orange-500 shadow-2xl z-10 max-w-3xl mx-auto my-10 rounded-2xl">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h2>
        <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.price}₺ / piece</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                >-</button>
                <span className="w-8 text-center font-semibold text-lg">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                >+</button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-2 text-red-500 hover:text-red-600 text-base font-bold"
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 mb-4">
          <span className="text-xl font-semibold text-gray-700">Total:</span>
          <span className="text-3xl font-extrabold text-orange-500">{total.toFixed(2)}₺</span>
        </div>
        <button
          onClick={onProceedToPayment}
          disabled={cart.length === 0}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-200 ${
            cart.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
