// src/components/VideoLoop.tsx
import React from "react";

const VideoLoop: React.FC = () => {
  return (
    <div className="w-full h-auto overflow-hidden">
      <video
        src="/videos/foundry-pour.mp4" // path in public folder
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default VideoLoop;
