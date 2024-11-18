import {muiTheme} from "../theme";
import {
    alpha,
    Avatar,
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Actors, Scenes, Streaming} from "../stages/Main";
import {Lock, LockOpen, PlayCircle, Save, StopCircle} from "@mui/icons-material";
import {firestore} from "../firebase_config";
import {useDocumentData} from "react-firebase-hooks/firestore";
import StyledBadge from "./StyledBadge";
import ReactPlayer from "react-player";

export const controlRoomSx = {
    backgroundColor: muiTheme.palette.background.main,
    minHeight: '100vh',
    alignItems: 'left',
    width: '100%',
    paddingTop: '4vh',
    padding: 2
}

const Control = () => {
    const [romeo, romeoDataLoading, romeoDataError] = useDocumentData(firestore.doc('recordedVideos/romeo'))
    const [giulietta, giuliaDataLoading, giuliaDataError] = useDocumentData(firestore.doc('recordedVideos/giulietta'))
    const [showData, showDataLoading, showDataError] = useDocumentData(firestore.doc('config/show'))

    const mobile = useMediaQuery(muiTheme.breakpoints.between("xs", "sm"));

    //https://youtube.com/live/Y0-RAwTYlkE?feature=share
    const links = {}
    Actors.forEach((actor) => {
        links[actor.id] = {
            link: "",
            code: null
        }
    })
    const [state, setState] = useState(links)
    const [show, setShow] = useState(showData)

    useEffect(() => {
        if (showData)
            setShow(showData)
    }, [showData])

    useEffect(() => {
        if (romeo && giulietta)
            setState({
                giulietta: {
                    video: giulietta.video,
                    isPlaying: giulietta.isPlaying,
                    sceneId: giulietta.sceneId
                },
                romeo: {
                    video: romeo.video,
                    isPlaying: romeo.isPlaying,
                    sceneId: romeo.sceneId
                }
            })
    }, [romeo, giulietta])

    function handlePlayRecordedVideo(actorId, sceneId, videoFile) {
        firestore.collection('recordedVideos').doc(actorId).set(
            {
                sceneId: sceneId,
                video: videoFile,
                isPlaying: true,
                startTime: new Date()
            }, {merge: true}
        ).then()
    }

    function handleStopActor(actorId) {
        firestore.collection('recordedVideos').doc(actorId).set(
            {
                isPlaying: false
            }, {merge: true}
        ).then()
    }

    function save() {
        firestore.collection('config').doc('show').set(show, {merge: true}).then()
    }

    function handleChangeShowData(event) {
        setShow({
            ...show,
            [event.target.id]: event.target.value
        })
    }

    function handlePlayShow() {
        firestore.collection('config').doc('show').set({
            isPlaying: !show?.isPlaying
        }, {merge: true}).then()
    }

    return (
        <Stack sx={controlRoomSx} alignItems={'center'}>
            <Typography variant={'h4'} gutterBottom color={muiTheme.palette.primary.main}>
                Link streaming attori
            </Typography>
            <Stack p={2} mt={2} spacing={3} width={mobile ? '100%' : '80%'} marginX={!mobile ? 'auto' : 'inherit'}
                   component={Paper} variant={"outlined"}
                   borderRadius={'1.5rem'} borderColor={muiTheme.palette.primary.main}
                   color={'white'} flexWrap={'wrap'}
                   sx={{background: 'transparent'}}>
                <Stack spacing={2} flexWrap={'wrap'}
                       direction={mobile ? 'column' : 'row'}
                       justifyContent={mobile ? 'center' : 'space-between'}
                       alignItems={'center'}>
                    {show?.isPlaying ?
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{vertical: 'middle', horizontal: 'right'}}
                            variant="dot">
                            <Chip label={show?.isPlaying ? '_ SPETTACOLO ON AIR' : 'PUBBLICO IN ATTESA'}
                                  variant={show?.isPlaying ? 'standard' : 'outlined'}
                                  disabled={!show?.isPlaying}
                                  color={'primary'}
                                  size={'small'}/>
                        </StyledBadge>
                        : <Chip label={show?.isPlaying ? 'SPETTACOLO ON AIR' : 'PUBBLICO IN ATTESA'}
                                variant={show?.isPlaying ? 'standard' : 'outlined'}
                                disabled={!show?.isPlaying}
                                color={'primary'}
                                size={'small'}/>}

                    <Button variant={'contained'} startIcon={showData?.isPlaying ? <Lock/> : <LockOpen/>}
                            onClick={handlePlayShow}>
                        {show?.isPlaying ? "Blocca l'accesso" : "Consenti accesso"}
                    </Button>
                </Stack>
                {
                    Scenes.map((scene) => (
                        <Stack id={scene.id}>
                            <Typography textAlign={"center"} variant={'h3'}>{scene.name}</Typography>
                            <Stack key={scene.id} component={Paper} variant={"outlined"} p={2}
                                   borderRadius={'1.5rem'}
                                   borderColor={muiTheme.palette.primary.main}
                                   color={'white'} flexWrap={'wrap'}
                                   sx={{background: alpha(muiTheme.palette.primary.main, 0.2)}}
                                   alignItems={'flex-start'} justifyContent={'left'}>

                                {
                                    scene?.videos?.map((video, index) => {
                                        const actorData = Actors.find((o) => {
                                            return o.id === video.actor
                                        })
                                        return <Stack direction={mobile ? 'column' : 'row'} alignItems={'center'}
                                                      width={'100%'}
                                        >
                                            <Stack alignItems={'center'} mr={3}>
                                                <Typography gutterBottom>{actorData.name}</Typography>
                                                {(state[actorData.id]?.isPlaying && state[actorData.id]?.sceneId === scene.id) ?
                                                    <StyledBadge
                                                        overlap="circular"
                                                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                                                        variant="dot"
                                                    >
                                                        <Avatar src={actorData.img}
                                                                sx={{
                                                                    width: 64, height: 64,
                                                                    boxShadow: `5px 8px 18px 0px ${muiTheme.palette.secondary.main}`
                                                                }}/>
                                                    </StyledBadge>
                                                    : <Avatar src={actorData.img}
                                                              sx={{
                                                                  width: 64, height: 64,
                                                                  boxShadow: `5px 8px 18px 0px ${muiTheme.palette.secondary.main}`
                                                              }}/>}
                                            </Stack>
                                            <Stack direction={mobile ? 'column' : 'row'} flexWrap={'wrap'}
                                                   alignItems={'center'}>
                                                <Stack direction={mobile ? 'column' : 'row'}
                                                       flexWrap={'wrap'}
                                                       justifyContent={'center'} alignItems={'center'}
                                                       key={scene.id} my={1} mr={2} px={2} py={1} component={Paper}
                                                       spacing={1}>
                                                    {<Stack component={Paper} variant={'outlined'}>
                                                        <Typography>Video Preview</Typography>
                                                        <ReactPlayer url={video.file}
                                                                     controls={true}
                                                                     muted={true}
                                                            //playing={true}

                                                                     width={'200px'}
                                                                     height={'100px'}
                                                        />
                                                    </Stack>}
                                                    <Stack mt={1} spacing={1} justifyContent={'end'}>
                                                        <Tooltip
                                                            title={'Mandando il video live, l\'app aggiornerà il player di ' + actorData.name}>
                                                    <span>
                                                        <Button variant={'contained'} fullWidth
                                                                startIcon={<PlayCircle/>}
                                                                onClick={() => handlePlayRecordedVideo(actorData.id, scene.id, video.file)}
                                                                disabled={(state[actorData.id]?.isPlaying && state[actorData.id]?.sceneId === scene.id)}
                                                        >
                                                            Play
                                                        </Button>
                                                    </span>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={'Togli il player di ' + actorData.name + ' e metti la cover'}>
                                                    <span>
                                                        <Button variant={'default'} fullWidth
                                                                startIcon={<StopCircle/>}
                                                                onClick={() => handleStopActor(actorData.id)}>
                                                            Stop
                                                        </Button>
                                                    </span>
                                                        </Tooltip>
                                                    </Stack>
                                                    <Stack component={Paper} variant={'outlined'}>
                                                        <Typography>Video Live</Typography>
                                                        {(state[actorData.id]?.isPlaying && state[actorData.id]?.sceneId === scene.id) ?
                                                            <Streaming followedActor={actorData} width={'200px'}
                                                                       height={'100px'} control={true}/>
                                                            : <Box position={'relative'}>
                                                                <img src={actorData.img}
                                                                     style={{
                                                                         width: '200px',
                                                                         maxHeight: '100px',
                                                                         objectFit: 'cover'
                                                                     }}/>
                                                                <Box position={'absolute'} bottom={15} left={0}
                                                                     right={0}
                                                                     sx={{transform: 'rotate(-5deg)'}}
                                                                >
                                                                    <Typography>
                                                                        Tra poco...
                                                                    </Typography>
                                                                </Box>
                                                            </Box>}
                                                    </Stack>
                                                </Stack>

                                            </Stack>
                                        </Stack>
                                    })
                                }
                            </Stack>
                        </Stack>
                    ))
                }
                {/*Actors.map((actor, index) =>
                    <Stack key={actor.id} component={Paper} variant={"outlined"} p={2}
                           borderRadius={'1.5rem'} borderColor={muiTheme.palette.primary.main}
                           color={'white'} flexWrap={'wrap'}
                           sx={{background: 'transparent'}}
                           alignItems={'flex-start'} justifyContent={'left'}>
                        <Stack direction={mobile ? 'column' : 'row'} alignItems={'center'}
                               width={'100%'}
                        >
                            <Avatar src={actor.img}
                                    sx={{
                                        width: 64, height: 64,
                                        marginRight: 3,
                                        boxShadow: `5px 8px 18px 0px ${muiTheme.palette.secondary.main}`
                                    }}/>
                            <Stack direction={mobile ? 'column' : 'row'} flexWrap={'wrap'} alignItems={'center'}>
                                {
                                    Object.values(actor.scenes).map((scene) => (
                                        <Stack direction={mobile ? 'column' : 'row'}
                                               flexWrap={'wrap'}
                                               justifyContent={'center'} alignItems={'center'}
                                               key={scene.id} my={1} mr={2} px={2} py={1} component={Paper} spacing={1}>
                                            <Stack alignItems={'start'}>
                                                {(state[actor.id]?.isPlaying && state[actor.id]?.sceneId === scene.id) ?
                                                    <StyledBadge
                                                        overlap="circular"
                                                        anchorOrigin={{vertical: 'middle', horizontal: 'right'}}
                                                        variant="dot">
                                                        <Chip label={`_${scene.label}`}
                                                              color={'primary'}/>
                                                    </StyledBadge>
                                                    : <Chip label={`_${scene.label}`}
                                                            color={'primary'}/>}
                                            </Stack>
                                            {<Stack component={Paper} variant={'outlined'}>
                                                <Typography>Video Preview</Typography>
                                                <ReactPlayer url={scene.file}
                                                             controls={true}
                                                             muted={true}
                                                    //playing={true}

                                                             width={'200px'}
                                                             height={'100px'}
                                                />
                                            </Stack>}
                                            <Stack mt={1} spacing={1} justifyContent={'end'}>
                                                <Tooltip
                                                    title={'Mandando il link live l\'app aggiornerà il player di ' + actor.name}>
                                                    <span>
                                                        <Button variant={'contained'} fullWidth
                                                                startIcon={<PlayCircle/>}
                                                                onClick={() => handlePlayRecordedVideo(actor.id, scene.id)}
                                                                disabled={(state[actor.id]?.isPlaying && state[actor.id]?.sceneId === scene.id)}
                                                        >
                                                            Play
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip
                                                    title={'Togli il player di ' + actor.name + ' e metti la cover'}>
                                                    <span>
                                                        <Button variant={'default'} fullWidth
                                                                startIcon={<StopCircle/>}
                                                                onClick={() => handleStopActor(actor.id)}>
                                                            Stop
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            </Stack>
                                            <Stack component={Paper} variant={'outlined'}>
                                                <Typography>Video Live</Typography>
                                                {(state[actor.id]?.isPlaying && state[actor.id]?.sceneId === scene.id) ?
                                                    <Streaming followedActor={actor} width={'200px'} height={'100px'}/>
                                                    : <Box position={'relative'}>
                                                        <img src={actor.img}
                                                             style={{
                                                                 width: '200px',
                                                                 maxHeight: '100px',
                                                                 objectFit: 'cover'
                                                             }}/>
                                                        <Box position={'absolute'} bottom={15} left={0} right={0}
                                                             sx={{transform: 'rotate(-5deg)'}}
                                                        >
                                                            <Typography>
                                                                Tra poco...
                                                            </Typography>
                                                        </Box>
                                                    </Box>}
                                            </Stack>
                                        </Stack>
                                    ))
                                }
                            </Stack>
                        </Stack>
                    </Stack>)*/}
            </Stack>
            <Stack marginY={3} width={mobile ? '100%' : '80%'} marginX={!mobile ? 'auto' : 'inherit'}
                   component={Paper} variant={"outlined"} p={2}
                   borderRadius={'1.5rem'} borderColor={muiTheme.palette.primary.main}
                   color={'white'}
                   sx={{background: 'transparent'}}>
                <Typography variant={'h5'} gutterBottom color={muiTheme.palette.primary.main}>
                    Dati spettacolo
                </Typography>
                <TextField variant={'standard'}
                           size={'small'}
                           fullWidth
                           id={'name'}
                           placeholder={'Nome spettacolo'}
                           helperText={'Nome spettacolo'}
                           sx={{
                               '.MuiInput-root': {
                                   color: 'white',
                               },
                               '& .MuiInput-underline:before': {borderBottomColor: muiTheme.palette.primary.main},
                               '& .MuiInput-underline:after': {borderBottomColor: muiTheme.palette.primary.main},
                               '& .MuiFormHelperText-root': {color: muiTheme.palette.primary.main},
                               background: 'transparent',
                               borderRadius: '1rem',
                               boxShadow: 'none',
                           }}
                           value={show?.name}
                           onChange={(event) => handleChangeShowData(event)}
                           type={'text'}/>
                <TextField variant={'standard'}
                           size={'small'}
                           fullWidth
                           id={'location'}
                           placeholder={'Location spettacolo'}
                           helperText={'Location spettacolo'}
                           sx={{
                               '.MuiInput-root': {
                                   color: 'white',
                               },
                               '& .MuiInput-underline:before': {borderBottomColor: muiTheme.palette.primary.main},
                               '& .MuiInput-underline:after': {borderBottomColor: muiTheme.palette.primary.main},
                               '& .MuiFormHelperText-root': {color: muiTheme.palette.primary.main},
                               background: 'transparent',
                               borderRadius: '1rem',
                               boxShadow: 'none',
                           }}
                           value={show?.location}
                           onChange={(event) => handleChangeShowData(event)}
                           type={'text'}/>
                <TextField variant={'standard'}
                           size={'small'}
                           fullWidth
                           id={'when'}
                           placeholder={'Data spettacolo'}
                           helperText={'Data spettacolo'}
                           sx={{
                               '.MuiInput-root': {
                                   color: 'white',
                               },
                               '& .MuiInput-underline:before': {borderBottomColor: muiTheme.palette.primary.main},
                               '& .MuiInput-underline:after': {borderBottomColor: muiTheme.palette.primary.main},
                               '& .MuiFormHelperText-root': {color: muiTheme.palette.primary.main},
                               background: 'transparent',
                               borderRadius: '1rem',
                               boxShadow: 'none',
                           }}
                           value={show?.when}
                           onChange={(event) => handleChangeShowData(event)}
                           type={'text'}/>
                <Button onClick={save} startIcon={<Save/>}>
                    SALVA
                </Button>
            </Stack>
        </Stack>
    )
}

export default Control