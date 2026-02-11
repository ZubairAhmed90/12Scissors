import { useEffect, useRef, useState } from 'react';
import video1 from '@/assets/video1.mp4';
import video2 from '@/assets/video2.mp4';

const videos = [video1, video2];

const HeroVideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [currentIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {});
    }
  }, [currentIndex]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        key={currentIndex}
      >
        <source src={videos[currentIndex]} type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroVideoCarousel;
