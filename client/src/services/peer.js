class PeerService {
    constructor(socket) {
        this.socket = socket
        this.peers = {};
        // this.remoteStreams = new Map();
        console.log(socket)
    }

    createPeerConnection(userId) {
        if (!this.peers[userId]) {
            console.log("created peerConnection")
            const peerConnection = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19032",
                            "stun:global.stun.twilio.com:3478",
                        ]
                    }
                ]
            });

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log(`Sending ICE candidate to user ${userId}`, event.candidate);
                    this.socket.emit('ice-candidate', { to: { id: userId }, candidate: event.candidate });
                }
            };

            peerConnection.onnegotiationneeded = async () => {
                console.log(`Negotiation needed for user ${userId}`);
                const offer = await this.getOffer(userId);
                this.socket.emit('peer:nego:needed', { to: userId, from: this.socket.id, offer });
            };

            // peerConnection.ontrack = (event) => {
            //     console.log(`ontrack event from user ${userId}`, event);
            //     const remoteStream = new MediaStream();
            //     event.streams[0].getTracks().forEach(track => {
            //         console.log(`Adding track: ${track.kind}`, track);
            //         remoteStream.addTrack(track);
            //     });
            //     console.log(`Received remote stream from user ${userId}`, remoteStream);
            //     this.addRemoteStream(userId, remoteStream);
            //     // setRemoteStream(prevStreams => [...prevStreams, { userId, stream: remoteStream }]);
            // };

            this.peers[userId] = peerConnection;
        }
        return this.peers[userId];
    }

    async getOffer(userId) {
        console.log("getOffer this.peers :", this.peers)
        console.log("userId")
        console.log(userId)
        const peer = this.createPeerConnection(userId);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }

    async getAnswer(userId, offer) {
        console.log("getAnswer this.peers :", this.peers)
        console.log("userId, offer")
        console.log(userId, offer)
        const peer = this.createPeerConnection(userId);
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(new RTCSessionDescription(answer));
        return answer;
    }

    async setAnswer(userId, ans) {
        console.log("setAnswer this.peers :", this.peers)
        console.log("userId, ans")
        console.log(userId, ans)
        const peer = this.createPeerConnection(userId)
        console.log(peer)
        await peer.setRemoteDescription(new RTCSessionDescription(ans))
    }

    async addLocalTracks(userId, stream) {
        console.log("add local tracks :", userId, stream)
        const peer = this.createPeerConnection(userId);
        await stream.getTracks().forEach(track => {
            console.log(`Adding track: ${track.kind}`, track);
            peer.addTrack(track, stream);
        });
        console.log("this.peers :", this.peers)
    }

    async handleRemoteICECandidate(userId, candidate) {
        const peer = this.createPeerConnection(userId);
        console.log(`Adding received ICE candidate from user ${userId}`, candidate);
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }

    // async addRemoteStream(userId, stream) {
    //     if (this.remoteStreams.has(userId)) {
    //         console.log(`Updating remote stream for user ${userId}`, stream);
    //         this.remoteStreams.set(userId, stream);
    //     } else {
    //         console.log(`Adding remote stream for user ${userId}`, stream);
    //         this.remoteStreams.set(userId, stream);
    //     }
    // }

    removePeerConnection(userId) {
        if (this.peers[userId]) {
            this.peers[userId].close();
            delete this.peers[userId];
        }
    }
}

export default PeerService;

// this.peers[userId].onicecandidate = (event) => {
//     if (event.candidate) {
//         // Send the ICE candidate to the remote peer
//         socket.emit("ice-candidate", {
//             to: userId,
//             candidate: event.candidate
//         });
//     }
// };

// this.peers[userId].ontrack = (event) => {
//     console.log("Received remote track:", event.track);
//     console.log("Received remote streams:", event.streams);
//     // Handle the received tracks here
//     if (this.onRemoteStream) {
//         this.onRemoteStream(event.streams[0], userId);
//     }
// };

// async addIceCandidate(userId, candidate) {
//     const peer = this.createPeerConnection(userId);
//     await peer.addIceCandidate(new RTCIceCandidate(candidate));
// }

// addTrack(userId, track, stream) {
//     const peer = this.createPeerConnection(userId);
//     peer.addTrack(track, stream);
// }
