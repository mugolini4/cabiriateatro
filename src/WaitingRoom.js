import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {Start} from "@mui/icons-material";
import logo from "./instable_gomboc.gif";
import {Link} from "react-router-dom";
import {muiTheme} from "./theme";

export const waitingRoomSx = {
    backgroundColor: muiTheme.palette.background.main,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '4vh',
}

const WaitingRoom = () => {
    return (
        <Box sx={waitingRoomSx}>
            <img src={'/img.png'} width={'80px'}
                 style={{
                     filter: `opacity(0.45)`,
                     borderRadius: '45px',
                     padding: 2,
                     marginBottom: '12px'
                 }}
                 alt={'cabiria_logo'}/>
            <Typography gutterBottom variant={"h3"} color={`gray`}>
                TEATRO IBRIDO
            </Typography>
            <Typography gutterBottom variant={"h6"} color={`gray`} sx={{paddingX: 4}}>
                Con questo test ci stai aiutando a realizzare un'opera ibrida tra il mondo fisico e quello digitale...
            </Typography>
            <Button component={Link} to="/main"
                    endIcon={<Start/>} variant={'outlined'}
                    //disabled={Date.now() <= new Date(2022, 5, 3)}
                    style={{marginTop: '10%'}} size={'large'}>
                ENTRA
            </Button>
            <Box mt={'auto'} mb={4} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <img src={logo} className="App-logo" alt="logo"
                     style={{filter: `opacity(0.4)`, width: '120px', height: 'auto'}}/>
                {/*<a
                        className="App-link"
                        href="https://www.gomboc.it/"
                        target="_blank"
                        rel="noopener noreferrer">
                    </a>*/}
                <Button component={Link} to="/about">Powered by GOMBOC</Button>
            </Box>
        </Box>
    )
}

export default WaitingRoom