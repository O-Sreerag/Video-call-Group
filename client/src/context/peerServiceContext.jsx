import React, { createContext, useContext, useMemo } from 'react';
import { useSocket } from './socketContext';
import PeerService from '../services/peer'

const PeerServiceContext = createContext(null);

export const usePeerService = () => {
    return useContext(PeerServiceContext);
};

export const PeerServiceProvider = ({ children }) => {
    const socket = useSocket();
    console.log("peer service provider , socket :", socket)
    const peerService = new PeerService(socket);
    // const peerService = useMemo(() => new PeerService(socket), [socket]);

    return (
        <PeerServiceContext.Provider value={peerService}>
            {children}
        </PeerServiceContext.Provider>
    );
};
