import React from "react";
import {Backdrop, Box, Button, CircularProgress, Typography} from "@mui/material";
import {Start} from "@mui/icons-material";
import logo from "../instable_gomboc.gif";
import {Link} from "react-router-dom";
import {muiTheme} from "../theme";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {firestore} from "../firebase_config";

export const waitingRoomSx = {
    backgroundColor: muiTheme.palette.background.main,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '4vh',
}

const WaitingRoom = () => {
    const [showData, showDataLoading, ] = useDocumentData(firestore.doc('config/show'))

    return (
        <Box sx={waitingRoomSx}>
            {<Backdrop open={showDataLoading} children={<CircularProgress/>} sx={{zIndex:1}}/>}
            <img src={'/img.png'} width={'55px'}
                 style={{
                     filter: `opacity(0.45)`,
                     borderRadius: '45px',
                     padding: 2,
                     marginBottom: '12px'
                 }}
                 alt={'cabiria_logo'}/>
            {<Typography variant={"subtitle1"} color={`gray`}>
                Le Notti di Cabiria presenta
            </Typography>}
            <Typography gutterBottom variant={"h4"} color={`gray`} paddingX={1}>
                {showData?.name}
            </Typography>
            <img src={'/cover_omicidio.jpeg'} width={'210px'}
                 style={{
                     filter: `opacity(0.75)`,
                     borderRadius: '20px',
                     //padding: 2,
                     marginBottom: '12px'
                 }}
                 alt={'cabiria_logo'}/>
            {/*<Typography gutterBottom variant={"h6"} color={`gray`}>
                Lo spettacolo sta per iniziare....
            </Typography>*/}
            {<Typography variant={"h6"} color={`gray`}>
                {showData?.location}
            </Typography>}
            {<Typography variant={"subtitle1"} color={`gray`}>
                {showData?.when}
            </Typography>}
            {<Typography variant={"subtitle1"} color={`gray`} fontWeight={900}>
                Portate le cuffie!
            </Typography>}
            <Button component={Link} to="/main"
                    endIcon={<Start/>} variant={'contained'}
                    //disabled={Date.now() <= new Date(2022, 5, 3)}
                    //TODO: RICORDA DI TOGLIERE IL DISABLED
                    disabled={!showData?.isPlaying}
                    style={{marginTop: '8%'}} size={'large'}>
                ENTRA
            </Button>
            <Box mt={'auto'} mb={4} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <img src={logo} className="App-logo" alt="logo"
                     style={{filter: `opacity(0.4)`, width: '60px', height: 'auto'}}/>
                {/*<a
                        className="App-link"
                        href="https://www.gomboc.it/"
                        target="_blank"
                        rel="noopener noreferrer">
                    </a>*/}
                <Button component={Link} to="/">Powered by GOMBOC</Button>
                {/*<Typography gutterBottom variant={"caption"} color={`gray`} fontWeight={900}>
                    NU ARTS AND COMMUNITY
                </Typography>*/}
            </Box>
        </Box>
    )
}

export default WaitingRoom