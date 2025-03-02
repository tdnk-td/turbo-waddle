import { useState, useRef } from "react";

const channels = Array.from({ length: 24 }, (_, i) => i + 1);

export default function BossTracker() {
  const [timers, setTimers] = useState({});
  const intervals = useRef({});

  const startTimer = (channel, duration) => {
    if (intervals.current[channel]) {
      clearInterval(intervals.current[channel]);
    }

    setTimers((prev) => ({
      ...prev,
      [channel]: duration,
    }));

    intervals.current[channel] = setInterval(() => {
      setTimers((prev) => {
        if (prev[channel] === null) {
          clearInterval(intervals.current[channel]);
          return prev;
        }
        return { ...prev, [channel]: prev[channel] - 1 };
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(Math.abs(seconds) / 60);
    const sec = Math.abs(seconds) % 60;
    return `${seconds < 0 ? "-" : ""}${min}:${sec.toString().padStart(2, "0")}`;
  };

  const closestChannel = Object.entries(timers).reduce((closest, [channel, time]) => {
    if (closest === null || Math.abs(time) < Math.abs(timers[closest])) {
      return channel;
    }
    return closest;
  }, null);

  return (
    <div className="p-4 space-y-4 bg-[#1c1c1e] min-h-screen text-gray-200 flex flex-col items-center">
      {/* Large Timer Display */}
      <div className="p-6 bg-[#2a2a2c] text-white rounded-xl shadow-md text-center w-full max-w-3xl">
        <h1 className="text-3xl font-bold">Active Timers</h1>
        <div className="grid grid-cols-3 gap-4 mt-4 justify-items-center">
          {Object.entries(timers).map(([channel, time]) => (
            <div
              key={channel}
              className={`p-3 w-full max-w-[150px] rounded-lg text-center ${channel === closestChannel ? 'bg-red-500' : 'bg-[#404042]'}`}
            >
              <p className="text-lg font-bold">Channel {channel}</p>
              <p className="text-xl">{formatTime(time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Selection */}
      <div className="grid grid-cols-6 gap-4 justify-items-center">
        {channels.map((channel) => (
          <div
            key={channel}
            className={`p-4 w-full max-w-[150px] rounded-xl shadow-md text-center ${channel === closestChannel ? 'bg-red-700' : 'bg-[#2a2a2c]'}`}
          >
            <h2 className="text-lg font-bold">Channel {channel}</h2>
            <div className="mt-2 space-y-1">
              {[5, 2, 8].map((min) => (
                <button
                  key={min}
                  onClick={() => startTimer(channel, min * 60)}
                  className="w-full px-3 py-1 bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
