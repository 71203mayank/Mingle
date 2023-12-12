import { useContext, useState } from "react";
import { formInterface } from "../types";
import { Container, Stack, TextField, Button } from "@mui/material";
import './styles.css';
import { SocketContext } from "../Context";

const Home = () => {
    const [formControl, setFormControl] = useState<formInterface>({ username: '', roomId: '' });
    const { joinRoom } = useContext(SocketContext);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormControl(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        });
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(formControl);
        joinRoom(formControl.username, formControl.roomId);

    }

    return (
        <div className="main">
            <form>
                <Container >
                    <Stack spacing={2} width={500}>
                        <TextField id="outlined-basic" label="Username" variant="outlined" color="warning" name="username" value={formControl.username} onChange={handleChange} />
                        <TextField id="outlined-basic" label="Room ID" variant="outlined" color="warning" name="roomId" value={formControl.roomId} onChange={handleChange} />
                        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                    </Stack>
                </Container>
            </form>
        </div>
    )
}

export default Home;