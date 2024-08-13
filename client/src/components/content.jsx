import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';

import { FaUserTie } from "react-icons/fa";
import { IoLink } from "react-icons/io5";
import { FaVideo } from "react-icons/fa6";
import { FaVideoSlash } from "react-icons/fa6";
import { IoMic } from "react-icons/io5";
import { IoMicOff } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import { IoHandLeftSharp } from "react-icons/io5";
import { IoHandLeftOutline } from "react-icons/io5";
import { MdAddReaction } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";

import './main/items.css'
import Team from "./main/team"
import Zoom from "./main/zoom"
// import { useUser } from '../context/userContext';
import { useMediaStream } from '../context/mediaStreamContext';
// import { usePeerService } from '../context/peerServiceContext';

const Content = () => {  
  // const { user, setUser } = useUser();
  const { myStream, getMyMediaStream } = useMediaStream();
  // const peerService = usePeerService();
  // const { remoteStreams, setRemoteMediaStream } = useMediaStream();
  const videoRef = useRef();
  const [mic, setMic] = useState(true)
  const [video, setVideo] = useState(true)

  // const handleTrackEvent = (userId, event) => {
  //   console.log(`ontrack event from user ${userId}`, event);
  //   const remoteStream = new MediaStream();
  //   event.streams[0].getTracks().forEach(track => {
  //     console.log(`Adding track: ${track.kind}`, track);
  //     remoteStream.addTrack(track);
  //   });
  //   console.log(`Received remote stream from user ${userId}`, remoteStream);
  //   setRemoteMediaStream(userId, remoteStream);
  // };

  // const handleNewUserJoinRequest = useCallback(async (data) => {
  //   console.log("handle new user join request")
  //   const { from } = data
  //   console.log(from)
  //   const offer = await peerService.getOffer(from.id);
  //   console.log("offer : ", offer)
  //   peerService.socket.emit('initiating:handshake:from:room', { from: { email: user.email, id: peerService.socket.id }, to: from, offer })
  // }, [])

  // const handleInitiatingHandshakeFromRoom = useCallback(async (data) => {
  //   console.log("handle initiating handshake from room")
  //   const { from, to, offer } = data;
  //   console.log(from, to, offer)
  //   const ans = await peerService.getAnswer(from.id, offer)
  //   console.log("ans :", ans)
  //   peerService.socket.emit('handshake:accepted:from:user', { from: to, to: from, ans });
  // }, [peerService]);

  // const sendStreams = useCallback(async (userId) => {
  //   const localStream = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     video: true,
  //   });
  //   console.log("sendStreams :", localStream)
  //   peerService.addLocalTracks(userId, localStream);
  // }, [getMyMediaStream]);

  // const handleHandshakeAcceptedFromUser = useCallback(async (data) => {
  //   console.log("handle handshake accepted from user")
  //   const { from, to, ans } = data;
  //   console.log(from, to, ans)
  //   await peerService.setAnswer(from.id, ans);
  //   sendStreams(from.id);
  //   peerService.socket.emit('handshake:success', { from: to, to: from });
  // }, [peerService, sendStreams]);

  // const handleHandshakeSuccess = useCallback(async (data) => {
  //   console.log("handle hand shake success")
  //   const { from, to } = data
  //   console.log(from, to)
  //   sendStreams(from.id);
  //   console.log(`connection established from ${from.email} to ${to.email}`)
  // }, [])

  // const handleRemoteICECandidate = useCallback((data) => {
  //   console.log("handle remote ice candidate")
  //   const { from, to, candidate } = data;
  //   console.log("from, to, candidate")
  //   console.log(from, to, candidate)
  //   sendStreams(from.id);
  //   peerService.handleRemoteICECandidate(from.id, candidate);
  // }, []);

  // const handleNegoIncoming = useCallback(async ({ to, from, offer }) => {
  //   console.log("handleNegoIncoming :", to, from, offer)
  //   const ans = await peerService.getAnswer(from, offer)
  //   peerService.socket.emit('peer:nego:done', { from: to, to: from, ans })
  // }, [peerService])

  // const handleNegoFinal = useCallback(async ({ to, from, ans }) => {
  //   console.log("handleNegoFinal :", to, from, ans)
  //   await peerService.setAnswer(from, ans)
  // }, [])

  // useEffect(() => {
  //   peerService.socket.on("peer:nego:needed", handleNegoIncoming)
  //   peerService.socket.on("peer:nego:final", handleNegoFinal)

  //   return () => {
  //     peerService.socket.off("peer:nego:needed", handleNegoIncoming)
  //     peerService.socket.off("peer:nego:final", handleNegoFinal)
  //   }
  // }, [peerService, handleNegoIncoming, handleNegoFinal])

  // useEffect(() => {
  //   Object.entries(peerService.peers).forEach(([peerId, peerConnection]) => {
  //     peerConnection.addEventListener('track', event => handleTrackEvent(peerId, event));
  //   });

  //   return () => {
  //     Object.values(peerService.peers).forEach(peer => {
  //       peer.removeEventListener('track', handleTrackEvent);
  //     });
  //   };
  // }, [peerService.peers, handleTrackEvent])

  // useEffect(() => {
  //   peerService.socket.on('new:user:join:request', handleNewUserJoinRequest);
  //   peerService.socket.on('initiating:handshake:from:room', handleInitiatingHandshakeFromRoom);
  //   peerService.socket.on('handshake:accepted:from:user', handleHandshakeAcceptedFromUser);
  //   peerService.socket.on('handshake:success', handleHandshakeSuccess);
  //   peerService.socket.on('ice-candidate', handleRemoteICECandidate);

  //   return () => {
  //     peerService.socket.off('new:user:join:request', handleNewUserJoinRequest);
  //     peerService.socket.off('initiating:handshake:from:room', handleInitiatingHandshakeFromRoom);
  //     peerService.socket.off('handshake:accepted:from:user', handleHandshakeAcceptedFromUser);
  //     peerService.socket.off('handshake:success', handleHandshakeSuccess);
  //     peerService.socket.off('ice-candidate', handleRemoteICECandidate);
  //   };
  // }, [peerService, handleNewUserJoinRequest, handleInitiatingHandshakeFromRoom, handleHandshakeAcceptedFromUser, handleHandshakeSuccess, handleRemoteICECandidate]);

  useEffect(() => {
    getMyMediaStream();
  }, [getMyMediaStream]);

  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // console.log("remoteStreams :", remoteStreams)

  const handleMic = () => { setMic(prev => !prev) }
  const handleVideo = () => { setVideo(prev => !prev) }

  return (
    <div className="w-full h-screen flex justify-center py-3 bg-gray-100">
      <div className="max-w-[1200px] lg:min-w-[1200px] bg-white rounded-md flex-col flex justify-around items-center border border-gray-300 shadow-md ">
        <div className="flex flex-col justify-between w-full lg:min-h-[700px] px-5">

          {/* navbar */}
          <div className="h-[60px] flex justify-center items-center">
            <div className="w-full p-1 flex justify-between">
              <div className="flex gap-3 items-center">
                <img src="/public/logo.png" alt="logo" width={30} />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Weekly Report - Marketing + Sales</p>
                  <p className="text-xs text-gray-700">Friday, Jan 01 2023</p>
                  {
                    <p>{remoteStreams ? 'remoteStreams are present' : 'remoteStreams are not present'}</p>
                  }
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex gap-2 rounded-full bg-blue-50 border-blue-500 border text-blue-500 px-3 py-[0.3rem] items-center">
                  <p className="text-xs">jkl-mkp-xrt</p>
                  <IoLink className="text-sm" />
                </div>
                <div>
                  <FaUserTie className="text-gray-700 border rounded-full border-gray-800 text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* body */}
          <div className="flex w-full h-[640px] justify-between space-x-2">

            {/* left side */}
            <div className="flex flex-col justify-between w-4/5">
              <div className="h-[570px] bg-[#f5f8fa] rounded-md flex flex-col">
                <div className="h-[71%] ">
                  {
                    myStream &&
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }}
                    />
                  }
                </div>
                <div className="h-[29%] justify-center">
                  <div className='h-full p-4'>
                    <div className="grid grid-cols-4 h-full gap-2 pr-2 overflow-y-scroll team-container">
                      {
                        // remoteStreams && Array.from(remoteStreams.myMap.values()).map(eachStream => (
                        //   <div className="rounded-md min-h-[130px]">
                        //     <ReactPlayer key={eachStream.id} height='130px' width='' playing muted url={eachStream}/>
                        //   </div>
                        // ))
                      }
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                      <div className="rounded-md bg-yellow-200 min-h-[130px]">people</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[70px] flex justify-center items-center">
                <div className="space-x-5 p-1 flex items-center">
                  <button>
                    <MdAddReaction className="text-yellow-400 text-3xl" />
                  </button>
                  <button className={`p-1 rounded-full border ${video ? 'border-gray-500 bg-none' : 'border-red-500 bg-red-500'}`} onClick={handleVideo}>
                    {
                      video ?
                        <FaVideo className="text-gray-400 text-xl" />
                        : <FaVideoSlash className="text-white text-xl" />
                    }
                  </button>
                  <button className={`p-1 rounded-full border border-red-500 bg-red-500`}>
                    <MdCallEnd className="text-white text-xl" />
                  </button>
                  <button className={`p-1 rounded-full border ${mic ? 'border-gray-500 bg-none' : 'border-red-500 bg-red-500'}`} onClick={handleMic}>
                    {
                      mic ?
                        <IoMic className="text-gray-400 text-xl" />
                        : <IoMicOff className="text-white text-xl" />
                    }
                  </button>
                  <button className={`p-1 rounded-full border border-gray-500 bg-gray-50`}>
                    <IoHandLeftOutline className="text-gray-500 text-xl" />
                  </button>
                </div>
              </div>
            </div>

            {/* right side */}
            <div className="flex flex-col justify-between w-1/5">
              <div className="h-[570px]">
                <div className="bg-[#f5f8fa] flex flex-col justify-between h-full rounded-lg">
                  <div className="flex p-[0.3rem] bg-[#f1f2f3] #e5eff6 w-full rounded-t-lg">
                    <button className="w-1/2 bg-white shadow-sm rounded-md"><p className="p-[0.2rem] text-gray-600 text-sm">participants</p></button>
                    <button className="w-1/2"><p className=" p-[0.2rem] text-gray-700 text-sm">chat</p></button>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="h-[70px] flex justify-center items-center">
                <div className="flex justify-between p-[0.3rem] bg-[#f5f8fa] w-full gap-1 rounded-lg">
                  <button className=""><BiDotsVerticalRounded className="text-gray-800" /></button>
                  <div className="flex justify-start w-full"><p className=" p-[0.2rem] text-gray-700 text-xs">type something...</p></div>
                  <button className="w-7 bg-white rounded-full items-center flex justify-center"><IoIosSend /></button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Content
{/* {
                        remoteStreams.map((stream, index) => (
                          <div key={index} className="rounded-md bg-yellow-200 min-h-[130px]">
                            <ReactPlayer
                              url={stream}
                              playing
                              muted
                              width="100%"
                              height="100%"
                            />
                          </div>
                        ))
                      } */}