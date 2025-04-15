import { useState, useEffect } from "react";

const LoadingScreen = ({ message = "Loading your dashboard..." }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(message);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          const increment = Math.max(2, Math.floor((90 - prev) / 8));
          return prev + increment;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const messages = [
      "Preparing your data...",
      "Almost there...",
      "Finalizing...",
      "Just a moment...",
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      {/* Logo Placeholder */}
      <div className="mb-12"></div>

      <div className="relative">
        {/* Background Circle */}
        <div className="w-20 h-20 rounded-full border-4 border-gray-100" />

        {/* Animated Progress Circle */}
        <div className="absolute inset-0">
          <div
            className="w-20 h-20 rounded-full border-4 border-t-green-500 border-r-green-500 border-transparent animate-spin"
            style={{ animationDuration: "1.5s" }}
          />
        </div>

        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-3 h-3 bg-green-500 rounded-full animate-ping"
            style={{ animationDuration: "1.5s" }}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1 bg-gray-100 rounded-full mt-8 overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-700 ease-out" // Moderate transition duration
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading Text */}
      <div className="mt-6 text-center">
        <p className="text-green-600 font-medium tracking-wide">
          {loadingText}
        </p>
        <p className="text-sm text-gray-400 mt-2">{progress}% Complete</p>
      </div>

      {/* Loading Indicators */}
      <div className="flex gap-1 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.25}s`,
              animationDuration: "1.2s",
              opacity: 0.6 + i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
