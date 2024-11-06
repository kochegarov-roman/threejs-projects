'use client';

import { useRef, useState } from 'react';
import { PauseIcon } from '@/shared/ui/pause';
import { PlayIcon } from '@/shared/ui/play';
import { Skeleton } from './skeleton';

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
  const [isLoading, setIsLoading] = useState(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      className="group transition-all"
    >
      {isLoading ? (
        <div className={'flex items-center space-x-4'}>
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-[250px]" />
          </div>
        </div>
      ) : null}
      <video
        ref={videoRef}
        width={width}
        height={height}
        poster={poster}
        loop={loop}
        autoPlay={autoplay}
        playsInline={true}
        muted={true}
        onLoadedData={handleLoadedData}
        onClick={handlePlayPause}
        style={{ cursor: 'pointer', display: isLoading ? 'none' : 'block' }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <button
        onClick={handlePlayPause}
        className="absolute top-1/2 transition-all duration-500 opacity-0 group-hover:opacity-100 js-play-btn"
        style={{ width: '50px', height: '50px' }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
};

export default Video;
