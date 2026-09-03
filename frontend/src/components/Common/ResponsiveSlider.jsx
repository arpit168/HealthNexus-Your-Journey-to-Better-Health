import React, { useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ResponsiveSlider = ({ children, title, subtitle }) => {
  const sliderRef = useRef(null);
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);

  const handleScroll = (e) => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    
    // Show left blur if we've scrolled right at all
    setShowLeftBlur(scrollLeft > 5);
    // Show right blur if we haven't reached the end
    setShowRightBlur(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Optional Header */}
      {(title || subtitle) && (
        <div className="mb-4 flex items-center justify-between px-2">
          <div>
            {title && <h3 className="text-xl font-bold text-gray-900 ">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 ">{subtitle}</p>}
          </div>
          
          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <button 
              onClick={scrollLeft}
              disabled={!showLeftBlur}
              className={`p-2 rounded-full border transition-all ${
                showLeftBlur 
                  ? 'border-gray-300  text-gray-700  hover:bg-gray-100  hover:shadow-sm' 
                  : 'border-gray-100  text-gray-300 cursor-not-allowed'
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollRight}
              disabled={!showRightBlur}
              className={`p-2 rounded-full border transition-all ${
                showRightBlur 
                  ? 'border-gray-300  text-gray-700  hover:bg-gray-100  hover:shadow-sm' 
                  : 'border-gray-100  text-gray-300 cursor-not-allowed'
              }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Slider Container */}
      <div className="relative group">
        
        {/* Left Edge Fade Indicator (Mobile/Tablet) */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 md:hidden ${
            showLeftBlur ? 'opacity-100' : 'opacity-0'
          }`} 
        />

        {/* Scrollable Area */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {React.Children.map(children, (child) => (
            <div className="snap-start shrink-0 min-w-[280px] sm:min-w-[320px] md:min-w-[350px]">
              {child}
            </div>
          ))}
        </div>

        {/* Right Edge Fade Indicator (Mobile/Tablet) */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 md:hidden ${
            showRightBlur ? 'opacity-100' : 'opacity-0'
          }`} 
        />
      </div>
    </div>
  );
};

export default ResponsiveSlider;
