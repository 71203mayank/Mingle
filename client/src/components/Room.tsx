// import Peer from 'simple-peer';
import { useRef, useEffect, useContext } from "react";
// import { peerInterface } from "../types";
import { Grid, Box } from "@mui/material";
import VideoPlayer from "./VideoPlayer"
import Options from "./Options";
import './styles.css';
import { useLocation, useParams } from "react-router-dom";
import global from 'global';
import process from 'process';
import { SocketContext } from "../Context";
global.process = process;


const Room = () => {
    const { state } = useLocation();
    const routeParams = useParams();
    const { roomId } = routeParams;
    const { peers, userStream } = useContext(SocketContext);

    const userVideo = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (userVideo.current)
            userVideo.current.srcObject = userStream;
    }, [userVideo, userStream])
    return (
        // <div > Room </div>
        //         <div className='main'>
        //     <Grid container gap={0} marginTop={5} padding={2} width='100%' height='100%'>
        //         <Grid item xs={1} md={12} key={1} textAlign='center'>
        //             <VideoPlayer stream={stream} type={-1} />
        //         </Grid>
        //         {
        //             peers.map((peer, index) => {
        //                 return (
        //                     <Grid item xs={1} md={12} key={index} textAlign='center'>
        //                         <VideoPlayer peer={peer} type={index} />
        //                     </Grid>
        //                 )
        //             })
        //         }
        //     </Grid>
        //     <Box position='static' bottom={5} >
        //         <Options />
        //     </Box>
        // </div>
        <div className="main">
            <h1> {state.username} has joined {roomId}</h1>
            <Grid container gap={0} marginTop={5} padding={2} width="100%" height="100%">
                <Grid item xs={1} md={12} key={-1} textAlign={'center'}>
                    <div className="video-container">
                        <video muted autoPlay playsInline ref={userVideo} className="video" />
                    </div>
                </Grid>
                {
                    peers.map((peer, index) => {
                        return (
                            <Grid item xs={1} md={12} key={index} textAlign={'center'}>
                                <VideoPlayer peer={peer} />
                            </Grid>
                        )
                    })
                }
            </Grid>
            <Box position='static' bottom='5'>
                <Options />
            </Box>
        </div>
    )
}

export default Room;