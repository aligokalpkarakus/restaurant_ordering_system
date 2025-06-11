import React from 'react';

const BACKEND_URL = "http://localhost:8000"; // Gerekirse burayı değiştir

const MenuItemCard = ({ item, onAdd }) => {
  // image_url varsa tam URL oluştur
  const imageUrl = item.image_url ? (item.image_url.startsWith('http') ? item.image_url : BACKEND_URL + item.image_url) : null;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col justify-between min-h-[220px]">
      {/* Yemek resmi */}
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-300 text-6xl">🍽️</span>
        )}
      </div>
      <div className="p-6 pb-2 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
          <span className="text-2xl font-extrabold text-orange-500">{item.price}₺</span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags && item.tags.map((tag, idx) => (
            <span key={idx} className={
              tag === 'vegetarian' ? 'bg-green-100 text-green-700' :
              tag === 'vegan' ? 'bg-lime-100 text-lime-700' :
              tag === 'gluten-free' ? 'bg-blue-100 text-blue-700' :
              tag === 'dairy-free' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            + ' px-3 py-1 rounded-full text-xs font-semibold'}>
              {tag}
            </span>
          ))}
        </div>
        {item.dietary_info && (
          <div className="mb-2">
            <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
              {item.dietary_info}
            </span>
          </div>
        )}
      </div>
      <div className="px-6 pb-6">
        <button 
          onClick={onAdd}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors duration-200 text-lg shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
