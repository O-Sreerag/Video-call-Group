// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// pages
import Lobby1 from './pages/lobby1';
import Lobby2 from './pages/lobby2';
import Room from './pages/room';

import { UserProvider } from './context/userContext';
import { SocketProvider } from './context/socketContext';
import { MediaStreamProvider } from './context/mediaStreamContext';
import { PeerServiceProvider } from './context/peerServiceContext';

function App() {
  return (
    <SocketProvider>
      <PeerServiceProvider>
        <MediaStreamProvider>
          <UserProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Lobby1 />} />
                <Route path="/join" element={<Lobby2 />} />
                <Route path="/room" element={<Room />} />
              </Routes>
            </Router>
          </UserProvider>
        </MediaStreamProvider>
      </PeerServiceProvider>
    </SocketProvider>
  );
}

export default App;
