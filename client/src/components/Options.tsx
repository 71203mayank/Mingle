// import { Mic, MicOff, VideoCameraBack, VideocamOff } from "@mui/icons-material";
import { Mic, MicOff } from '@mui/icons-material'
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Button, Grid } from "@mui/material";
import { useState } from "react";
import './styles.css';


const Options = () => {

    const [videoStatus, setVideoStatus] = useState<{ video: boolean, audio: boolean }>({ video: true, audio: true });

    const leaveHandler = () => {

    }

    return (
        <div>
            <Grid container spacing={1} marginBottom={3} marginTop={3}>
                <Grid item xs={3} md={3}>
                    <Button variant={videoStatus.video ? "contained" : "outlined"}
                        onClick={() => setVideoStatus(prev => ({ ...prev, video: !prev.video }))}>

                        {videoStatus.video ? <VideocamIcon /> : <VideocamOffIcon />}

                    </Button>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Button variant={videoStatus.audio ? "contained" : "outlined"}
                        onClick={() => setVideoStatus(prev => ({ ...prev, audio: !prev.audio }))}>
                        {videoStatus.audio ? <Mic /> : <MicOff />}
                    </Button>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Button variant="outlined" color="error" onClick={leaveHandler}> Leave Room </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default Options;