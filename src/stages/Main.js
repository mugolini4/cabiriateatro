import React, {useEffect, useMemo, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    Grow,
    Stack,
    Typography
} from "@mui/material";
import {muiTheme} from "../theme";
import StyledBadge from "../components/StyledBadge";
import ReactPlayer from "react-player";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {auth, firestore} from "../firebase_config";
import {useNavigate} from "react-router-dom";
import {ExpandMore} from "@mui/icons-material";

/** query params in yt url ?
 * controls=0 -> frame con i controlli
 * autoplay=1 -> autoplay del video
 * */
export const Actors = [
    {
        id: 'amleto',
        name: 'Amleto',
        timeout: 1700,
        img: '/Romeo.jpeg',
        link: `https://www.youtube.com/embed/kmFdwPYOlYw?autoplay=1&mute=0`
    },
    {
        id: 'ofelia',
        name: 'Ofelia',
        timeout: 3200,
        img: '/Giulietta.jpeg',
        link: `https://www.youtube.com/embed/CCdlDNtc4hc?autoplay=1&mute=0`,
    //{name: 'Giulia', timeout: 3200, link: `https://www.youtube.com/embed/channel/UCMesJQDqxYkz7rLNZv2adNg/live`
    },
]

const Streaming = ({followedActor}) => {
    const [actorData, actorDataLoading, actorDataError] = useDocumentData(firestore.doc('streamingLinks/'+followedActor.id))

    const actorLink = useMemo(() => {
        if(!actorData)
            return null
        return `https://www.youtube.com/embed/${actorData?.streamingString}?autoplay=1&mute=0`
    }, [actorData])

    return (
        <Box py={2}>
            <Typography textAlign={'center'}>
                {followedActor?.name||''}
            </Typography>
            {/*<iframe src={followedActor?.link}
                     title={followedActor?.name}
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen/>*/}
            {actorLink && actorData?.isPlaying &&
                <ReactPlayer url={actorLink}
                          controls={true}
                          playing={true}
                          width={'100%'}
                />}
            {actorData?.isPlaying === false &&
                <Box position={'relative'}>
                    <img src={followedActor.img} style={{maxWidth: '100%'}}/>
                    <Box position={'absolute'} top={30} left={0} right={0}
                         sx={{transform: 'rotate(-10deg)'}}
                    >
                        <Typography variant={'h4'} fontWeight={'bold'} color={'primary'}
                                    sx={{textShadow: `2px 2px #000000`}}
                        >
                            Tra poco...
                        </Typography>
                    </Box>
                </Box>}
        </Box>
    );
}

function SlidoInteraction() {
    const [showData] = useDocumentData(firestore.doc('config/show'))

    const [openSlido, setOpenSlido] = useState(false)

    return showData?.openInteraction &&
        <Grow in={showData?.openInteraction === true} timeout={500}>
            <Box position={"absolute"} top={8} left={8} right={8} zIndex={100}>
        <Accordion expanded={openSlido} onChange={() => setOpenSlido(!openSlido)}
                   sx={{
                       backgroundColor: muiTheme.palette.primary.main,
                       color: 'white',
                       fontWeight: 'bold',
                   }}
                   style={{
                       borderRadius: '2rem'
                   }}
        >
            <AccordionSummary
                expandIcon={<ExpandMore />}
            >
                Interagisci con la diretta ❤️👍
            </AccordionSummary>
            <AccordionDetails>
                <iframe //src="https://ortometraggi.2ndStage.app"
                        src="https://app.sli.do/event/9Lrf4S2smDM56Eq5UVeAJj"
                        height="100%" width="100%"
                        frameBorder="0"
                        style={{minHeight: '520px', borderRadius: '1rem'}}
                        title="Amleto"></iframe>
            </AccordionDetails>
        </Accordion>
    </Box>
        </Grow>
}

const MainStage = ({show}) => {
    const navigate = useNavigate()
    const [showData, showDataLoading, ] = useDocumentData(firestore.doc('config/show'))

    useEffect(() => {
        if(showData?.isPlaying === false && !auth.currentUser) {
            navigate('/')
        }
    }, [showData, auth])

    const [followedActor, toggleFollowedActor] = useState(undefined)

    const handleChangeActor = (index) => {
        toggleFollowedActor(Actors[index])
    }

    const isSelected = (index) => {
        return index === Actors.findIndex((o) => o.name === followedActor?.name)
    }

    return (
        <Stack p={2} sx={{height: '70vh', backgroundColor: 'black'}} justifyContent={'center'}>
            {followedActor?.id === 'amleto' && <SlidoInteraction/>}
            {followedActor && <Streaming followedActor={followedActor}/>}
            <Box px={2} position={"fixed"} bottom={20} left={0} right={0}>
                <Typography gutterBottom color={`lightgray`}>
                    {'Scegli chi vuoi spiare...'}
                </Typography>
                <Stack direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}>
                    {Object.values(Actors).map((actor, index) =>
                        <Grow key={index} in={show} mountOnEnter timeout={actor.timeout}>
                            <Box onClick={() => handleChangeActor(index)} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                {isSelected(index) ? <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                        variant="dot">
                                        <Avatar src={actor.img}
                                                sx={{
                                                    width: 80, height: 80,
                                                    border: `4px solid ${muiTheme.palette.primary.main}`,
                                                    boxShadow: `5px 8px 18px 0px ${muiTheme.palette.secondary.main}`
                                                }}/>
                                    </StyledBadge>
                                    : <Avatar src={actor.img}
                                              sx={{
                                                  width: 64, height: 64,
                                                  boxShadow: `5px 8px 18px 0px ${muiTheme.palette.secondary.main}`
                                              }}/>}
                                <Button size={'large'}>{actor.name}</Button>
                            </Box>
                        </Grow>)}
                </Stack>
            </Box>
        </Stack>
    );
}

export default MainStage