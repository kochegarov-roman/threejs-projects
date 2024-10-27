'use client';

import { useRef, useState } from 'react';
import { PauseIcon } from '@/shared/ui/pause';
import { PlayIcon } from '@/shared/ui/play';

interface IVideo {
  src: string;
  poster?: string;
  width: string;
  height: string;
  loop: boolean;
  autoplay: boolean;
}

const Video = ({
  src,
  poster,
  width = '100%',
  height = 'auto',
  loop,
  autoplay,
}: IVideo) => {
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
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      className="group transition-all"
    >
      <video
        ref={videoRef}
        width={width}
        height={height}
        poster={poster}
        loop={loop}
        autoPlay={autoplay}
        playsInline={true}
        muted={true}
        onClick={handlePlayPause}
        style={{ cursor: 'pointer' }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button
        onClick={handlePlayPause}
        className="absolute top-1/2 transition-all duration-500 opacity-0 group-hover:opacity-100"
        style={{ width: '50px', height: '50px' }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
};

export default Video;
