import React, { useState, useEffect } from "react";

function AuctionTimer({ endTime }) {
  const [timeRemaining, setTimeRemaining] = useState(
    Math.max(0, endTime - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now());
      setTimeRemaining(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);

  return (
    <div>
      {hours}h {minutes}m {seconds}s
    </div>
  );
}

export default AuctionTimer;
