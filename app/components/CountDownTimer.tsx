import React, { useState, useEffect } from "react";

// Define the shape of our countdown state
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Define the component props
interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  // Helper to calculate time units
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    // Default to zeros if target date has passed
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval to avoid memory leaks
    return () => clearInterval(timer);
  }, [targetDate]);

  // Format numbers to always show two digits (e.g., "05")
  const formatNumber = (num: number): string => String(num).padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        fontFamily: "sans-serif",
        fontSize: "1.5rem",
      }}
    >
      <div>
        <span>{formatNumber(timeLeft.days)}</span>
        <div style={{ fontSize: "0.8rem", textAlign: "center" }}>Days</div>
      </div>
      <div>:</div>
      <div>
        <span>{formatNumber(timeLeft.hours)}</span>
        <div style={{ fontSize: "0.8rem", textAlign: "center" }}>Hours</div>
      </div>
      <div>:</div>
      <div>
        <span>{formatNumber(timeLeft.minutes)}</span>
        <div style={{ fontSize: "0.8rem", textAlign: "center" }}>Mins</div>
      </div>
      <div>:</div>
      <div>
        <span>{formatNumber(timeLeft.seconds)}</span>
        <div style={{ fontSize: "0.8rem", textAlign: "center" }}>Secs</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
