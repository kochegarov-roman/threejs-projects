"use client";

import { useRef, useState } from 'react';
import {PlayIcon} from "@/components/ui/play";
import {PauseIcon} from "@/components/ui/pause";

const Video = ({ src, poster, width = '100%', height = 'auto', loop, autoplay }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
         className="group transition-all">
      <video
        ref={videoRef}
        width={width}
        height={height}
        poster={poster}
        loop={loop}
        autoPlay={autoplay}
        muted={true}
        onClick={handlePlayPause}
        style={{ cursor: 'pointer' }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button onClick={handlePlayPause}
              className="absolute top-1/2 transition-all duration-500 opacity-0 group-hover:opacity-100"
              style={{width: "50px", height: "50px"}}>
        {isPlaying ? <PauseIcon/> : <PlayIcon />}
      </button>
    </div>
  );
};

export default Video;
