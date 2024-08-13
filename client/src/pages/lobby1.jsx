// src/Lobby1.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { MdOutlineVideoCall } from "react-icons/md";
import { FaKeyboard } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// import { useSocket } from '../context/socketProvider';
import { useUser } from '../context/userContext';

const slides = [
    {
        image: './image1.png',
        title: 'Your Meeting is safe',
        description: 'No one can join the meet unless invited or admitted by the host',
    },
    {
        image: './image2.png',
        title: 'Get a Link you can share',
        description: 'Click New Meeting to get a link you can send to people you want to meet with',
    },
    {
        image: './image3.png',
        title: 'Plan ahead',
        description: 'Click New Meeting to schedule meetings in SkillSet Calendar and send invites to participants',
    },
];

const Lobby1 = () => {
    // const socket = useSocket()
    const [currentSlide, setCurrentSlide] = useState(0);
    const { user, setUser } = useUser();
    const [email, setEmail] = useState(user.email);
    const [room, setRoom] = useState(user.room);
    const navigate = useNavigate()

    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();

        console.log("email :", email);
        console.log("room :", room);
        setUser({ email, room });
        setEmail("")
        setRoom("")

        navigate(`/join?e=${email}&r=${room}`)
    }, [email, room]);

    const nextSlide = () => {
        console.log("nextslide clicked")
        setCurrentSlide(currentSlide => {
            return currentSlide == 2 ? 0 : currentSlide + 1
        })
    };

    const prevSlide = () => {
        console.log("prevslide clicked")
        setCurrentSlide(currentSlide => {
            return currentSlide == 0 ? 2 : currentSlide - 1
        })
    };

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
                        <input
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="border focus:border-2 focus:border-blue-600 border-black rounded-[0.3rem] outline-none p-2"
                        />
                        <div>
                            <p className="text-sm font-semibold">Sreerag O</p>
                            <p className="text-xs text-gray-500">sreeragknd@gmail.com</p>
                            {/* <button className="text-xs text-blue-500 hover:underline">switch account</button> */}
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
                <div className="max-w-[1500px] h-[600px]">
                    <div className='flex w-full justify-between mt-20'>

                        <div className="w-1/2 p-20 flex flex-col items-start gap-7 justify-center">
                            <h1 className='text-5xl text-gray-800'>Video Calls and Meetings for Everyone</h1>
                            <p className='text-xl text-[#5e5e5e] w-[80%]'>Connect, Collaborate and Celebrate from anywhere with SkillSet</p>
                            <div className='flex gap-5 mt-7 w-[80%]'>
                                <div>
                                    <button className='bg-blue-600 p-2 rounded-[0.3rem] '>
                                        <p className='font-semibold text-white flex items-center gap-1'><MdOutlineVideoCall className='text-xl' />New Meeting</p>
                                    </button>
                                </div>
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        name="room"
                                        value={room}
                                        placeholder="Enter a code or link"
                                        onChange={(e) => setRoom(e.target.value)}
                                        className="border focus:border-2 focus:border-blue-600 border-black rounded-[0.3rem] outline-none p-2 pl-10 w-full"
                                    />
                                    <div className="absolute left-3 pointer-events-none">
                                        <FaKeyboard className="text-gray-700" />
                                    </div>
                                </div>
                                <button><p className='text-gray-400' onClick={handleSubmitForm}>Join</p></button>
                            </div>
                            <hr className='bg-gray-300 w-full' />
                            <div className='flex gap-1 cursor-pointer text-base'>
                                <a className='text-blue-600 hover:underline'>Learn more</a><p className='text-gray-700'>about Skill Set</p>
                            </div>
                        </div>

                        <div className="w-1/2 flex flex-col justify-center items-center">
                            <div className="relative w-full max-w-lg mx-auto">
                                <div className="flex justify-between w-full px-10 z-10 top-[110px] absolute">
                                    <button onClick={prevSlide} className="cursor-pointer hover:bg-gray-100 p-4 rounded-full">
                                        <IoIosArrowBack className='text-lg' />
                                    </button>
                                    <button onClick={nextSlide} className="cursor-pointer hover:bg-gray-100 p-4 rounded-full">
                                        <IoIosArrowForward className='text-lg' />
                                    </button>
                                </div>

                                <div key={currentSlide} className="min-w-full flex-shrink-0 flex flex-col items-center justify-center p-4">
                                    <div className=' w-full flex justify-center'>
                                        <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-64 h-64 rounded-full" />
                                    </div>
                                    <div  className={`w-[80%]`}>
                                        <h3 className="text-2xl text-black mt-10 text-center">{slides[currentSlide].title}</h3>
                                        <p className="text-center mt-2 ">{slides[currentSlide].description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Lobby1;
