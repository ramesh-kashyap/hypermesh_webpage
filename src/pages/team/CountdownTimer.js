import React, { useEffect, useState } from "react";

const CountdownTimer = ({ dateString }) => {
  const calculateTimeLeft = () => {
    const targetDate = new Date(dateString);
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) return null;

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [dateString]);

  if (!timeLeft) return <span>Time's up!</span>;

  return (
    <span>
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  );
};

export default CountdownTimer;