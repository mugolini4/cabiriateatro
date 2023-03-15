import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, Stack, TextField} from "@mui/material";
import logo from "../instable_gomboc.gif";
import {auth} from "../firebase_config";

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const logIn = async (e) => {
        e.preventDefault()
        await auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                navigate('/control', {replace: true})
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
            });
    }

    return (
        <Container maxWidth={"sm"} style={{textAlign:"center", paddingTop: 40}}>
            <img src={logo} style={{width: 'min(20%, 20rem)', padding: '0.5rem', filter: 'brightness(0) invert(1)'}}/>
            <form onSubmit={logIn}>
                <Stack mt={3} direction={'column'} spacing={3} alignItems={'center'}>
                    <TextField size={'small'} fullWidth required placeholder={'Email'} onChange={(e) => setEmail(e.target.value)} type={"email"}/>
                    <TextField size={'small'} fullWidth required placeholder={'Password'} onChange={(e) => setPassword(e.target.value)}
                               type={"password"}/>
                    <Box sx={{width: '100%', textAlign: 'center'}}>
                        <Button fullWidth type={'submit'} variant={"contained"}>login</Button>
                    </Box>
                </Stack>
            </form>
        </Container>
    )
}
