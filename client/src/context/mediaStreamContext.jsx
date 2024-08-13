// src/context/mediaStreamContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const MediaStreamContext = createContext();

export const useMediaStream = () => {
  return useContext(MediaStreamContext);
};

export const MediaStreamProvider = ({ children }) => {
  const [myStream, setMyStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({ myMap: new Map() });

  const getMyMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }, []);

  const setRemoteMediaStream = useCallback(async (userId, stream) => {
    try {
      setRemoteStreams(prevState => {
        const newMap = new Map(prevState.myMap);
        if (newMap.has(userId)) {
          console.log(`Updating remote stream for user ${userId}`, stream);
          if (newMap.get(userId) !== stream) {
            newMap.set(userId, stream);
          }
        } else {
          console.log(`Adding remote stream for user ${userId}`, stream);
          newMap.set(userId, stream);
        }
        return { ...prevState, myMap: newMap };
      });
    } catch (error) {
      console.error('Error setting remote media stream', error);
    }
  }, [setRemoteStreams])

  return (
    <MediaStreamContext.Provider value={{ myStream, getMyMediaStream, remoteStreams, setRemoteMediaStream }}>
      {children}
    </MediaStreamContext.Provider>
  );
};