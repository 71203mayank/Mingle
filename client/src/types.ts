import Peer from 'simple-peer';

export interface formInterface {
    roomId: string,
    username: string,
}

export interface peerInterface {
    id: string,
    username: string,
    peer: Peer.Instance,
}

export interface socketInterface {
    joinRoom: (username: string, roomId: string) => void,
    peers: Peer.Instance[],
    userStream: MediaStream,
}
