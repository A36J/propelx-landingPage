import React from 'react';

const IntegrationVisual = () => {
  // Platform logos/icons for D2C marketing
  const platforms = [
    { name: 'Google Ads', color: 'bg-red-500', icon: 'G', position: 'top-left' },
    { name: 'Facebook Ads', color: 'bg-blue-600', icon: 'f', position: 'top-right' },
    { name: 'Shopify', color: 'bg-green-600', icon: 'S', position: 'left' },
    { name: 'Analytics', color: 'bg-orange-500', icon: 'A', position: 'right' },
    { name: 'Email', color: 'bg-gray-600', icon: 'E', position: 'bottom-left' },
    { name: 'CRM', color: 'bg-purple-600', icon: 'C', position: 'bottom-right' }
  ];

  const getPositionClasses = (position) => {
    switch(position) {
      case 'top-left': return 'top-8 left-8';
      case 'top-right': return 'top-8 right-8';
      case 'left': return 'top-1/2 left-8 -translate-y-1/2';
      case 'right': return 'top-1/2 right-8 -translate-y-1/2';
      case 'bottom-left': return 'bottom-8 left-8';
      case 'bottom-right': return 'bottom-8 right-8';
      default: return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 overflow-hidden">
      {/* Central Hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-purple-600 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Platform Icons */}
      {platforms.map((platform, index) => (
        <div key={platform.name} className={`absolute ${getPositionClasses(platform.position)}`}>
          {/* Connection Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{
            width: '400px',
            height: '300px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <line 
              x1="200" 
              y1="150" 
              x2={platform.position.includes('left') ? '80' : platform.position.includes('right') ? '320' : '200'}
              y2={platform.position.includes('top') ? '80' : platform.position.includes('bottom') ? '220' : '150'}
              stroke="#e5e7eb" 
              strokeWidth="2"
              strokeDasharray="4,4"
              className="animate-pulse"
            />
          </svg>
          
          {/* Platform Icon */}
          <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-white font-bold shadow-md hover:scale-110 transition-transform duration-200 relative z-10`}>
            {platform.icon}
          </div>
          
          {/* Platform Label */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
            {platform.name}
          </div>
        </div>
      ))}

      {/* Floating Data Points */}
      <div className="absolute top-16 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({length: 48}).map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationVisual;