// src/Lobby2.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { IoMic } from "react-icons/io5";
import { IoMicOff } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";
import { FaVideoSlash } from "react-icons/fa6";
import { BiDotsVerticalRounded } from "react-icons/bi";

import { useUser } from '../context/userContext';
import { useMediaStream } from '../context/mediaStreamContext';
import { usePeerService } from '../context/peerServiceContext';

const Lobby2 = () => {
  const { user, setUser } = useUser();
  const peerService = usePeerService();
  const { myStream, getMyMediaStream } = useMediaStream();
  const { remoteStreams, setRemoteMediaStream } = useMediaStream();
  const [mic, setMic] = useState(true)
  const [video, setVideo] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getMyMediaStream()
  }, [getMyMediaStream, myStream])

  const handleJoinClick = useCallback(async () => {
    console.log("handle Join Click")
    const from = { email: user.email, id: peerService.socket.id }
    console.log("user : ", user)
    console.log("from : ", from)
    peerService.socket.emit("new:user:join:request", { from: from, room: user.room });
  }, [user, peerService]);

  const handleNewUserJoinRequest = useCallback(async (data) => {
    console.log("handle new user join request")
    const { from } = data
    console.log(from)
    const offer = await peerService.getOffer(from.id);
    console.log("offer : ", offer)
    peerService.socket.emit('initiating:handshake:from:room', { from: { email: user.email, id: peerService.socket.id }, to: from, offer })
  }, [])

  const handleInitiatingHandshakeFromRoom = useCallback(async (data) => {
    console.log("handle initiating handshake from room")
    const { from, to, offer } = data;
    console.log(from, to, offer)
    const ans = await peerService.getAnswer(from.id, offer)
    console.log("ans :", ans)
    peerService.socket.emit('handshake:accepted:from:user', { from: to, to: from, ans });
  }, [peerService]);

  const sendStreams = useCallback(async (userId) => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    console.log("sendStreams :", localStream)
    peerService.addLocalTracks(userId, localStream);
  }, [getMyMediaStream]);

  const handleHandshakeAcceptedFromUser = useCallback(async (data) => {
    console.log("handle handshake accepted from user")
    const { from, to, ans } = data;
    console.log(from, to, ans)
    await peerService.setAnswer(from.id, ans);
    sendStreams(from.id);
    peerService.socket.emit('handshake:success', { from: to, to: from });
  }, [peerService, sendStreams]);

  const handleHandshakeSuccess = useCallback(async (data) => {
    console.log("handle hand shake success")
    const { from, to } = data
    console.log(from, to)
    sendStreams(from.id);
    console.log(`connection established from ${from.email} to ${to.email}`)
  }, [navigate])

  const handleRemoteICECandidate = useCallback((data) => {
    console.log("handle remote ice candidate")
    const { from, to, candidate } = data;
    console.log("from, to, candidate")
    console.log(from, to, candidate)
    peerService.handleRemoteICECandidate(from.id, candidate);
  }, []);

  const handleNegoIncoming = useCallback(async ({ to, from, offer }) => {
    console.log("handleNegoIncoming :", to, from, offer)
    const ans = await peerService.getAnswer(from, offer)
    sendStreams(from.id);
    peerService.socket.emit('peer:nego:done', { from: to, to: from, ans })
  }, [peerService])

  const handleNegoFinal = useCallback(async ({ to, from, ans }) => {
    console.log("handleNegoFinal :", to, from, ans)
    sendStreams(from.id);
    await peerService.setAnswer(from, ans)
  }, [])

  const handleTrackEvent = (userId, event) => {
    console.log(`ontrack event from user ${userId}`, event);
    const remoteStream = new MediaStream();
    event.streams[0].getTracks().forEach(track => {
      console.log(`Adding track: ${track.kind}`, track);
      remoteStream.addTrack(track);
    });
    console.log(`Received remote stream from user ${userId}`, remoteStream);
    setRemoteMediaStream(userId, remoteStream);
    // navigate(`/room?e=${user.email}r=${user.room}`)
  };

  useEffect(() => {
    peerService.socket.on("peer:nego:needed", handleNegoIncoming)
    peerService.socket.on("peer:nego:final", handleNegoFinal)

    return () => {
      peerService.socket.off("peer:nego:needed", handleNegoIncoming)
      peerService.socket.off("peer:nego:final", handleNegoFinal)
    }
  }, [peerService, handleNegoIncoming, handleNegoFinal])

  useEffect(() => {
    Object.entries(peerService.peers).forEach(([peerId, peerConnection]) => {
      peerConnection.addEventListener('track', event => handleTrackEvent(peerId, event));
    });

    return () => {
      Object.values(peerService.peers).forEach(peer => {
        peer.removeEventListener('track', handleTrackEvent);
      });
    };
  }, [peerService.peers, handleTrackEvent])


  useEffect(() => {
    peerService.socket.on('new:user:join:request', handleNewUserJoinRequest);
    peerService.socket.on('initiating:handshake:from:room', handleInitiatingHandshakeFromRoom);
    peerService.socket.on('handshake:accepted:from:user', handleHandshakeAcceptedFromUser);
    peerService.socket.on('handshake:success', handleHandshakeSuccess);
    peerService.socket.on('ice-candidate', handleRemoteICECandidate);

    return () => {
      peerService.socket.off('new:user:join:request', handleNewUserJoinRequest);
      peerService.socket.off('initiating:handshake:from:room', handleInitiatingHandshakeFromRoom);
      peerService.socket.off('handshake:accepted:from:user', handleHandshakeAcceptedFromUser);
      peerService.socket.off('handshake:success', handleHandshakeSuccess);
      peerService.socket.off('ice-candidate', handleRemoteICECandidate);
    };
  }, [peerService, handleNewUserJoinRequest, handleInitiatingHandshakeFromRoom, handleHandshakeAcceptedFromUser, handleHandshakeSuccess, handleRemoteICECandidate]);

  const handleMic = () => { setMic(prev => !prev) }
  const handlevideo = () => { setVideo(prev => !prev) }

  return (
    <div>
      {/* navbar */}
      <div className='flex justify-center py-3 z-10 absolute'>
        <nav className="max-w-[1500px] md:w-[1500px] px-5 flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <img className="w-8 h-8 rounded-full" src="./logo.png" alt="" />
            <p className='text-gray-700 text-xl font-semibold'>SKILLSET</p>
          </div>
          <div className="flex items-center space-x-2">
            <div>
              <p className="text-sm font-semibold">Sreerag O</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <img
              className="w-8 h-8 rounded-full"
              src="https://via.placeholder.com/40"
              alt="User"
            />
          </div>
        </nav>
      </div>

      {/* body */}
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-[1500px] flex items-center p-6">
          <div className='flex w-full justify-between h-[600px]'>

            <div className="w-1/2 flex items-center justify-end">
              <div className="relative w-[88%] h-[80%] flex flex-col justify-between items-center">
                {myStream ? (

                  <ReactPlayer
                    url={myStream}
                    playing
                    muted
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <div className='bg-black w-[100%] h-[100%] relative'>
                    <p className='text-white absolute top-[50%] left-[43%]'>camera is off</p>
                  </div>
                )}
                <div className="absolute top-0 left-0 w-full flex justify-between py-2 px-4 bg-opacity-50  rounded-t-md">
                  <p className="text-white text-sm">Sreerag O</p>
                  <button>
                    <BiDotsVerticalRounded className="text-white" />
                  </button>
                </div>
                <div className="absolute bottom-0 w-full flex justify-center p-4 bg-opacity-5 rounded-b-md">
                  <div className="space-x-5 p-1">
                    <button className={`p-2 rounded-full border ${video ? 'border-white bg-none' : 'border-red-500 bg-red-500'}`} onClick={handlevideo}>
                      {
                        video ?
                          <FaVideo className="text-white text-xl" />
                          : <FaVideoSlash className="text-white text-xl" />
                      }
                    </button>
                    <button className={`p-2 rounded-full border ${mic ? 'border-white bg-none' : 'border-red-500 bg-red-500'}`} onClick={handleMic}>
                      {
                        mic ?
                          <IoMic className="text-white text-xl" />
                          : <IoMicOff className="text-white text-xl" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 flex flex-col justify-center items-center space-y-4">
              <p className="text-center text-3xl font-semibold text-black">Ready to Join?</p>
              <div className='space-y-1'>
                <div className='flex justify-center gap-1'>
                  <img
                    className="w-5 h-5 rounded-full"
                    src="https://via.placeholder.com/40"
                    alt="User"
                  />
                  <img
                    className="w-5 h-5 rounded-full"
                    src="https://via.placeholder.com/40"
                    alt="User"
                  />
                  <img
                    className="w-5 h-5 rounded-full"
                    src="https://via.placeholder.com/40"
                    alt="User"
                  />
                </div>
                <p className='text-sm font-semibold text-black'>Sreerag O and 10 others are in this call</p>
              </div>
              <div className='flex justify-center gap-2'>
                <button className='rounded-lg  bg-black shadow-lg py-[0.4rem] px-4' onClick={handleJoinClick}>
                  <p className='text-base text-white font-semibold'>join now</p>
                </button>
              </div>
              <div className='flex gap-2'>
                {
                  <p>{remoteStreams ? 'remoteStreams are present' : 'remoteStreams are not present'}</p>
                }
                {
                  remoteStreams && Array.from(remoteStreams.myMap.values()).map(eachStream => (
                    <ReactPlayer key={eachStream.id} height='100px' width='200px' playing muted url={eachStream} />
                  ))
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Lobby2;

// useEffect(() => {
//   Object.entries(peerService.peers).forEach(([peerId, peerConnection]) => {
//     peerConnection.addEventListener('track', async ev => {
//       const remoteStream = ev.streams[0]
//       console.log("remoteStream: ", remoteStream)
//     });
//   });
// }, [peerService.peers])

// useEffect(() => {
//   console.log("peerService.peers changed")
//   Object.entries(peerService.peers).forEach(([peerId, peerConnection]) => {
//     peerConnection.addEventListener('icecandidate', async event => {
//       console.log(`Sending ICE candidate to user ${peerId}`, event.candidate);
//       peerService.socket.emit('ice-candidate', { to: { id: peerId }, candidate: event.candidate });
//     });
//   });

// }, [peerService.peers])

// useEffect(() => {
//   Object.entries(peerService.peers).forEach(([peerId, peerConnection]) => {
//     peerConnection.addEventListener('negotiationneeded', handleNegoNeeded(peerId));
//   });

//   return () => {
//     Object.entries(peerService.peers).forEach(([peerId, peerConnection]) => {
//       peerConnection.removeEventListener('negotiationneeded', handleNegoNeeded(peerId));
//     });
//   };
// }, [peerService, handleNegoNeeded]);

// if (peerService.signalingState === "stable") {
//   await peerService.setRemoteDescription(new RTCSessionDescription(description));
// } else {

//   console.log("Signaling state is not stable. Waiting for stable state...");
// }