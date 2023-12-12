import { useEffect, useRef } from "react";
import './styles.css';


const VideoPlayer = ({ peer }) => {
    const ref = useRef<HTMLVideoElement>()
    useEffect(() => {
        peer.on("stream", stream => {
            if (ref?.current)
                ref.current.srcObject = stream;
        })
    })
    return (
        <div className="video-container">
            <video className="video" playsInline autoPlay muted ref={ref}></video>
        </div>
    )
}

export default VideoPlayer;