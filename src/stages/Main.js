import React, {useEffect} from "react";
import {Grow, Stack, Typography} from "@mui/material";
import {BACKGROUND, muiTheme} from "../theme";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {auth, firestore} from "../firebase_config";
import {useNavigate} from "react-router-dom";

export function SlidoInteraction({preview = false}) {
    return <Grow in timeout={1000}>
            <Stack px={1} sx={{
                //backgroundColor: muiTheme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
                zIndex: '999'
            }}
                   style={{
                       borderRadius: '1.1rem'
                   }}
            >
                {/*<Typography sx={{py:1}} gutterBottom variant={!preview ? 'h6' : 'caption'}>Interagisci con lo spettacolo ❤️👍</Typography>*/}
                <iframe //src="https://wall.sli.do/event/wRVrJ5g1JWtQ1xp4JpMjdi?section=bfc92e9e-ad69-4600-a1e0-c465c27c67da" // present
                    src="https://app.sli.do/event/wRVrJ5g1JWtQ1xp4JpMjdi" //interazioni
                    height="100%"
                    width="80%"
                    frameBorder="0"
                    style={{
                        margin: 'auto',
                        minHeight: !preview ? '80vh' : '5vh',
                        borderRadius: '1rem',
                    }}
                    title="Amleto">
                </iframe>
                {/* MATI: <iframe //src="https://ortometraggi.2ndStage.app"
                        src="https://app.sli.do/event/9Lrf4S2smDM56Eq5UVeAJj"
                        height="100%" width="100%"
                        frameBorder="0"
                        style={{minHeight: '520px', borderRadius: '1rem'}}
                        title="Amleto"></iframe>*/}
            </Stack>
        </Grow>
}

export const MainStage = ({preview}) => {
    const navigate = useNavigate()
    const [showData, loading] = useDocumentData(firestore.doc('facciamone-un-dramma/config'))

    useEffect(() => {
        if (showData?.isPlaying === false && !auth.currentUser) {
            navigate('/')
        }
    }, [showData, auth])

    return (
      <Stack p={0} sx={{height: '100vh', backgroundColor: BACKGROUND}} justifyContent={'center'}>
        {!preview && <img src={"/bkg.png"}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                objectFit: 'fill',
                opacity: 1,
                zIndex: 0,
              }}
        />}
        {
          showData?.openInteraction === true ?
            <SlidoInteraction preview={preview}/>
            :
            <Grow in={!showData?.openInteraction} timeout={1500}>
              <Stack p={6} alignItems={'center'} spacing={1}>
                <Typography fontFamily={'Grasond'} variant={!preview ? 'h4' : 'body2'} color={'primary'}
                            sx={{opacity: 0.7}}>
                  Resta collegato per interagire
                </Typography>
                <img src={"/luna-elemento.png"}
                     width={'150px'}
                     style={{zIndex: 9999}}
                />
              </Stack>
            </Grow>
        }
      </Stack>
    );
}

export default MainStage