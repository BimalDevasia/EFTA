import React from 'react'

const QuantityCounter = ({ count, setCount }) => {
  return (
    <div className="flex gap-2">
    <button
      disabled={count === 0}
      onClick={() => setCount((prev) => prev - 1)}
      className="w-[28px] h-[28px] border border-black disabled:border-[#DBDBDB] rounded-full font-inter text-[14px] font-medium text-black disabled:text-[#DBDBDB]"
    >
      -
    </button>
    <p className="h-[28px] w-[48px] flex items-center justify-center border border-[#DBDBDB]">
      {count}
    </p>
    <button
      onClick={() => setCount((prev) => prev + 1)}
      className="w-[28px] h-[28px] border border-black disabled:border-[#DBDBDB] rounded-full font-inter text-[14px] font-medium text-black disabled:text-[#DBDBDB]"
    >
      +
    </button>
  </div>
  )
}

export default QuantityCounter