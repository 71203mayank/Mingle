import { createContext, useRef, useState } from "react";
import Peer from 'simple-peer';
import { io } from "socket.io-client";
import { peerInterface, socketInterface } from "./types";
import { useNavigate } from "react-router-dom";

const socket = io('http://localhost:8000');
const SocketContext = createContext<socketInterface>(null);

const ContextProvider = ({ children }) => {
    const [peers, setPeers] = useState<Peer.Instance[]>([]);
    // const socketRef = useRef<Socket>(null);
    const peersRef = useRef<peerInterface[]>([]);
    const [userStream, setUserStream] = useState<MediaStream>(null);
    // navigate(`/room/${formControl.roomId}`, { state: { username: formControl.username } });
    const navigate = useNavigate();


    const joinRoom = (username: string, roomId: string) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            // userVideo.current.srcObject = stream;
            setUserStream(stream);
            socket.emit("room--join", { username, roomId }) //fix
            socket.on("room--info", (users: { username: string, id: string }[]) => {
                const peers = [];
                console.log(users);
                users.forEach(user => {
                    console.log(user.id);
                    const peer = createPeer(user.id, user.username, stream);
                    peersRef.current.push({
                        id: user.id,
                        peer,
                        username: user.username,
                    });
                    peers.push(peer)
                })
                setPeers(peers);
                navigate(`/room/${roomId}`, { state: { username } });

            })

            socket.on("user--incoming", ({ signal, from, name }) => {
                const peer = addPeer(signal, from, stream);
                peersRef.current.push({
                    id: from,
                    peer,
                    username: name,
                });
                setPeers(users => [...users, peer]);
            });

            socket.on("user--accept", ({ signal, answerId }) => {
                const item = peersRef.current.find(p => p.id === answerId);
                item.peer.signal(signal);
            });
        })
    }


    const createPeer = (userToCall: string, username: string, stream: MediaStream): Peer.Instance => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on("signal", signal => {
            socket.emit("user--call", { userToCall, signalData: signal, username })
        });
        return peer;
    }

    const addPeer = (incomingSignal: Peer.SignalData, to: string, stream: MediaStream): Peer.Instance => {
        const peer = new Peer({ initiator: false, trickle: false, stream })
        peer.on("signal", signal => {
            socket.emit("user--answer", { signal, to });
        });

        peer.signal(incomingSignal);
        return peer;
    }


    return (
        <SocketContext.Provider value={{
            joinRoom,
            peers,
            userStream
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketContext, ContextProvider };