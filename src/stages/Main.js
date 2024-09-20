import React, {useEffect, useMemo, useState} from "react";
import {Avatar, Box, Button, Grow, Icon, IconButton, Stack, Typography} from "@mui/material";
import {muiTheme} from "../theme";
import StyledBadge from "../components/StyledBadge";
import ReactPlayer from "react-player";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {auth, firestore} from "../firebase_config";
import {useNavigate} from "react-router-dom";
import {VolumeOff, VolumeUp} from "@mui/icons-material";

/** query params in yt url ?
 * controls=0 -> frame con i controlli
 * autoplay=1 -> autoplay del video
 * */
export const Actors = [
    {
        id: 'romeo',
        name: 'Cucina creativa?',
        timeout: 1700,
        img: '/img.png',
        link: `https://www.youtube.com/embed/kmFdwPYOlYw?autoplay=1&mute=0`,
        scenes: {
            scena1: {label: "Scena 1", id: 'scena1', file: 'streaming/scena1/attore1.mp4'},
        }
    },
    {
        id: 'giulietta',
        name: 'Piramidi?',
        timeout: 3200,
        img: '/attore2.png',
        link: `https://www.youtube.com/embed/CCdlDNtc4hc?autoplay=1&mute=0`,
        scenes: {
            scena1: {label: "Scena 1", id: 'scena1', file: 'streaming/scena1/attore2.mp4'}
        }
        //{name: 'Giulia', timeout: 3200, link: `https://www.youtube.com/embed/channel/UCMesJQDqxYkz7rLNZv2adNg/live`
    },
]

export const Streaming = ({muted = "0", followedActor, width = "100%", height = null}) => {
    const playerRef = React.useRef();
    const [isReady, setIsReady] = React.useState(false);
    const [transitionToBlack, setTransitionToBlack] = React.useState(false);

    const [isMuted, setIsMuted] = useState(muted === "1");

    useEffect(() => {
        setIsMuted(muted === "1")
    }, [followedActor])

    const [actorData, actorDataLoading, actorDataError] = useDocumentData(firestore.doc('recordedVideos/'+followedActor.id))

    const actorLink = useMemo(() => {
        if(!actorData)
            return null
        return `https://www.youtube.com/embed/${actorData?.streamingString}?autoplay=1&mute=0`
    }, [actorData])

    const progressTimeSeconds = useMemo(() => {
        if(!actorData)
            return null
        setIsReady(false);
        setTransitionToBlack(false);

        console.log("Date().getTime():", new Date().getTime())
        console.log("actorData.startTime:",actorData?.startTime)
        console.log("actorData?.startTime._seconds*1000:", new Date(actorData?.startTime?.seconds*1000))
        console.log("progressTimeSeconds:",new Date().getTime() - new Date(actorData?.startTime?.seconds*1000))

        return (new Date().getTime() - new Date(actorData?.startTime?.seconds*1000)) / 1000
    }, [actorData])

    const onReady = React.useCallback(() => {
        console.log("progressTimeSeconds:",progressTimeSeconds)
        if (!isReady) {
            const duration = playerRef.current.getDuration()
            if(duration && duration >= progressTimeSeconds) {
                playerRef.current.seekTo(progressTimeSeconds, 'seconds');
                setIsReady(true);
            } else {
                setTransitionToBlack(true)
            }
        }
    }, [isReady, progressTimeSeconds]);

    const onEnded = React.useCallback(() => {
        console.log("onEnded progressTimeSeconds:",progressTimeSeconds)
        setTransitionToBlack(true)
    }, [isReady, progressTimeSeconds]);

    const handleMuteUnmute = () => {
        setIsMuted(!isMuted);
    };

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
            {(actorData?.isPlaying && !transitionToBlack) ?
                <>
                    <ReactPlayer // url={actorLink}
                        //url={`streaming/scena9/${followedActor.id}.mp4`}
                        ref={playerRef}
                        url={actorData.video}
                        controls={false}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: "noplay notimeline nofullscreen nodownload noremoteplayback",
                                    playsInline: true,
                                },
                            },
                        }}
                        muted={isMuted}
                        playing={true}
                        onReady={onReady}
                        onEnded={onEnded}
                        width={width}
                        height={height}
                        playsinline={true}
                    />
                    <IconButton
                        color={'primary'}
                        className={`control-button ${isMuted ? "unmute" : "mute"}`}
                        onClick={handleMuteUnmute}
                    >
                        {isMuted ? <VolumeOff sx={{fontSize: '45px'}} /> : <VolumeUp sx={{fontSize: '45px'}} />}
                    </IconButton>
                </> : null}
            {(actorData?.isPlaying === false) &&
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

    const isMuted = navigator.userAgent.includes("iPhone")

    return (
        <Stack p={2} sx={{height: '70vh', backgroundColor: 'black'}} justifyContent={'center'}>
            {followedActor && <Streaming muted={isMuted ? "1" : "0"} followedActor={followedActor}/>}
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