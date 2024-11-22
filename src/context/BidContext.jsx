import React, { createContext, useState } from "react";

export const BidContext = createContext();

export function BidProvider({ children }) {
  const [bids, setBids] = useState([]);

  const placeBid = (productId, amount) => {
    setBids((prevBids) => [
      ...prevBids,
      { productId, amount, timestamp: new Date() },
    ]);
  };

  const getHighestBid = (productId) => {
    const productBids = bids.filter((bid) => bid.productId === productId);
    return productBids.length
      ? Math.max(...productBids.map((bid) => bid.amount))
      : 0;
  };

  return (
    <BidContext.Provider value={{ placeBid, getHighestBid }}>
      {children}
    </BidContext.Provider>
  );
}
