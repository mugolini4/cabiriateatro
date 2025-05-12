import React from "react";
import {Backdrop, Box, Button, CircularProgress, Stack, Typography} from "@mui/material";
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
  const [showData, showDataLoading,] = useDocumentData(firestore.doc('facciamone-un-dramma/config'))

  return (
    <Stack spacing={1} sx={waitingRoomSx}>
      {<Backdrop open={showDataLoading} children={<CircularProgress/>} sx={{zIndex: 1}}/>}
      <img src={'/logo-coccia.png'} width={'220px'}
           style={{
             filter: `opacity(1)`,
             borderRadius: '45px',
             padding: 2,
             marginBottom: '12px'
           }}
           alt={'cabiria_logo'}/>
      {<Stack pt={1.5}>
        <Typography variant={"subtitle2"}>
          Il Teatro Coccia presenta
        </Typography>
        <Typography fontFamily={'Amarante'} gutterBottom variant={"h4"} paddingX={1}>
          {showData?.name}
        </Typography>
      </Stack>}
      <img src={'/luna-elemento.png'} width={'85%'}
           style={{
             filter: `opacity(1)`,
             borderRadius: '20px',
             //padding: 2,
             marginBottom: '12px'
           }}
           alt={'cabiria_logo'}/>
      {/*<Typography gutterBottom variant={"h6"}>
                Lo spettacolo sta per iniziare....
            </Typography>*/}
      {<Typography variant={"h6"}>
        {showData?.location}
      </Typography>}
      {<Typography variant={"subtitle1"}>
        {showData?.when}
      </Typography>}
      {/*<Typography variant={"subtitle1"} fontWeight={900}>
                Portate le cuffie!
            </Typography>*/}
      <Button component={Link} to="/main"
              endIcon={<Start/>} variant={'contained'}
        //disabled={Date.now() <= new Date(2022, 5, 3)}
        //TODO: RICORDA DI TOGLIERE IL DISABLED
              disabled={!showData?.isPlaying}
              style={{marginTop: '8%', borderRadius: '2rem'}} size={'medium'}>
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
        <Button href="https://gomboc.it" target={"_blank"}>Powered by GOMBOC</Button>
        {/*<Typography gutterBottom variant={"caption"} fontWeight={900}>
                    NU ARTS AND COMMUNITY
                </Typography>*/}
      </Box>
    </Stack>
  )
}

export default WaitingRoom