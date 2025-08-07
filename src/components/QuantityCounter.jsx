import React from 'react'

const QuantityCounter = ({ count, setCount }) => {
  // Ensure count is always a valid number
  const safeCount = parseInt(count) || 1;
  
  const handleDecrement = () => {
    if (safeCount > 1) {
      const newCount = Math.max(1, safeCount - 1);
      setCount(newCount);
    }
  };

  const handleIncrement = () => {
    if (safeCount < 100) {
      const newCount = Math.min(100, safeCount + 1);
      setCount(newCount);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={safeCount <= 1}
        onClick={handleDecrement}
        className="w-[28px] h-[28px] border border-black disabled:border-[#DBDBDB] rounded-full font-inter text-[14px] font-medium text-black disabled:text-[#DBDBDB]"
      >
        -
      </button>
      <p className="h-[28px] w-[48px] flex items-center justify-center border border-[#DBDBDB]">
        {safeCount}
      </p>
      <button
        disabled={safeCount >= 100}
        onClick={handleIncrement}
        className="w-[28px] h-[28px] border border-black disabled:border-[#DBDBDB] rounded-full font-inter text-[14px] font-medium text-black disabled:text-[#DBDBDB]"
      >
        +
      </button>
    </div>
  )
}

export default QuantityCounter