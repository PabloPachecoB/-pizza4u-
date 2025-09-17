import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

const PodcastPlayer = ({
  podcast,
  autoPlay = false,
  showPlaylist = true,
  compact = false,
  className = ''
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError('Error al cargar el audio');
      setIsLoading(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [podcast]);

  useEffect(() => {
    if (autoPlay && podcast?.url) {
      togglePlay();
    }
  }, [podcast?.url, autoPlay]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !podcast?.url) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Error al reproducir el audio');
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (x / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!podcast) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center ${className}`}>
        <i className="fas fa-podcast text-4xl text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Selecciona un podcast para reproducir
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 ${className}`}>
        <audio ref={audioRef} src={podcast.url} preload="metadata" />
        
        <div className="flex items-center space-x-4">
          {/* Cover Art */}
          <div className="flex-shrink-0">
            <img
              src={podcast.cover || '/placeholder-podcast.jpg'}
              alt={podcast.title}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-podcast.jpg';
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">
              {podcast.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {podcast.author}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              disabled={isLoading || !!error}
              icon={isLoading ? 'fas fa-spinner fa-spin' : (isPlaying ? 'fas fa-pause' : 'fas fa-play')}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div 
            className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-1 bg-primary-500 rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 ${className}`}>
      <audio ref={audioRef} src={podcast.url} preload="metadata" />
      
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-start space-x-4">
          {/* Cover Art */}
          <div className="flex-shrink-0">
            <img
              src={podcast.cover || '/placeholder-podcast.jpg'}
              alt={podcast.title}
              className="w-20 h-20 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-podcast.jpg';
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {podcast.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {podcast.author}
            </p>
            {podcast.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {podcast.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b dark:border-gray-700">
          <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
            <i className="fas fa-exclamation-triangle mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Player Controls */}
      <div className="p-6 space-y-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-6">
          <Button
            variant="ghost"
            onClick={() => skipTime(-30)}
            disabled={isLoading || !!error}
            icon="fas fa-undo"
            title="Retroceder 30s"
          />
          
          <Button
            variant="primary"
            size="lg"
            onClick={togglePlay}
            disabled={isLoading || !!error}
            icon={isLoading ? 'fas fa-spinner fa-spin' : (isPlaying ? 'fas fa-pause' : 'fas fa-play')}
            className="w-16 h-16 rounded-full"
          />
          
          <Button
            variant="ghost"
            onClick={() => skipTime(30)}
            disabled={isLoading || !!error}
            icon="fas fa-redo"
            title="Adelantar 30s"
          />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div 
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-2 bg-primary-500 rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              icon={isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Playback Speed */}
          <div className="flex items-center space-x-1">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <button
                key={rate}
                onClick={() => changePlaybackRate(rate)}
                className={`px-2 py-1 text-xs rounded ${
                  playbackRate === rate
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;