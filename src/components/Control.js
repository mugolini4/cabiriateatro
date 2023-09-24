import {BACKGROUND, muiTheme} from "../theme";
import {
    alpha,
    Avatar,
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Stack, Switch,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Actors} from "../stages/Main";
import {
    ContentCopy,
    Lock,
    LockOpen,
    PlayCircle,
    Reviews,
    Save,
    SpeakerNotesOff,
    SpeakerNotesOffOutlined,
    StopCircle
} from "@mui/icons-material";
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
    const [amleto, amletoDataLoading, amletoDataError] = useDocumentData(firestore.doc('streamingLinks/amleto'))
    const [ofelia, ofeliaDataLoading, ofeliaDataError] = useDocumentData(firestore.doc('streamingLinks/ofelia'))
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
        if (amleto && ofelia)
            setState({
                ofelia: {
                    code: ofelia.streamingString,
                    link: ofelia.link,
                    isPlaying: ofelia.isPlaying,
                    disabled: ofelia.disabled
                },
                amleto: {
                    code: amleto.streamingString,
                    link: amleto.link,
                    isPlaying: amleto.isPlaying,
                    disabled: amleto.disabled
                }
            })
    }, [amleto, ofelia])

    function getCodeLink(link) {
        let streamingCode = link?.split('live/')[1]
        streamingCode = streamingCode?.split('?')[0]

        return streamingCode || null
    }

    function getLink(actorId) {
        return state[actorId] && state[actorId].code ? `https://www.youtube.com/embed/${state[actorId].code}?autoplay=1&mute=0&allowfullscreen=0` : "";
    }

    function handleChange(event) {
        setState({...state, [event.target.id]: {link: event.target.value, code: getCodeLink(event.target.value)}});
    }

    const copyLink = async (url) => {
        await navigator.clipboard.writeText(url).then()
    }

    function handlePlayLiveLink(actorId) {
        firestore.collection('streamingLinks').doc(actorId).set(
            {
                link: state[actorId].link,
                streamingString: state[actorId].code,
                isPlaying: true
            }, {merge: true}
        ).then()
    }

    function handleOpenInteraction() {
        /** PERMETTE L'INTERAZIONE CON IL PUBBLICO */
        firestore.collection('config').doc('show').set({
            openInteraction: !show?.openInteraction
        }, {merge: true}).then()
    }

    function handleStopActor(actorId) {
        /** METTE LA COVER INVECE CHE IL VIDEO LIVE */
        firestore.collection('streamingLinks').doc(actorId).set(
            {
                isPlaying: false
            }, {merge: true}
        ).then()
    }

    function handleDisableActor(actorId, checked) {
        /** TOGLIE L'ATTORE DALLA SCELTA */
        firestore.collection('streamingLinks').doc(actorId).set(
            {
                disabled: !checked
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
                {Actors.map((actor, index) =>
                    <Stack key={actor?.id} component={Paper} variant={"outlined"} p={2}
                           borderRadius={'1.5rem'} borderColor={muiTheme.palette.primary.main}
                           color={'white'} flexWrap={'wrap'}
                           sx={{background: 'transparent'}}
                           alignItems={'flex-start'} justifyContent={'left'}>
                        <Stack direction={mobile ? 'column' : 'row'} alignItems={'center'}
                               justifyContent={'space-between'} width={'100%'}
                               flexWrap={'wrap'}
                        >
                            <Avatar src={actor.img}
                                    sx={{
                                        width: 64, height: 64,
                                        marginRight: 3,
                                        boxShadow: `5px 8px 18px 0px ${muiTheme.palette.secondary.main}`
                                    }}/>
                            <Switch
                                checked={!state[actor?.id].disabled}
                                onChange={(event, checked) => handleDisableActor(actor?.id, checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                            <TextField variant={'standard'}
                                       size={'small'}
                                       fullWidth
                                       id={actor.id}
                                       placeholder={'Link diretta YouTube live'}
                                       helperText={'Link diretta YouTube live'}
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
                                       value={state[actor?.id]?.link}
                                       onChange={(event) => handleChange(event)}
                                       type={'text'}/>
                            <Stack py={2} marginX={'auto'} alignItems={'center'}
                                   borderRadius={'1.5rem'}
                                   borderColor={muiTheme.palette.secondary.main}
                                   variant={"outlined"}
                                   color={'white'}
                                   sx={{background: 'black'}}
                                   component={Paper}
                            >
                                <Typography>Preview</Typography>
                                {state[actor?.id]?.link && state[actor?.id]?.isPlaying ?
                                    <ReactPlayer url={getLink(actor?.id)}
                                                 controls={true}
                                                 muted={true}
                                                 playing={true}
                                                 width={'150px'}
                                                 height={'150px'}
                                                 config={{
                                                     youtube: {
                                                         playerVars: {
                                                             modestbranding: 1,
                                                             fs: 0,
                                                             showinfo:0
                                                         }
                                                     }}}
                                    /> :
                                    <Box position={'relative'}>
                                        <img src={actor?.img} style={{maxWidth: '200px', maxHeight: '150px'}}/>
                                        <Box position={'absolute'} bottom={15} left={0} right={0}
                                             sx={{transform: 'rotate(-5deg)'}}
                                        >
                                            <Typography>
                                                Tra poco...
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                                {
                                    actor?.id === 'amleto' ?
                                        show?.openInteraction ?
                                            <Tooltip title={'Disattiva interazione'}>
                                                <IconButton sx={{background: muiTheme.palette.primary.main}}
                                                        onClick={handleOpenInteraction}>
                                                    <Reviews sx={{color: BACKGROUND}}/>
                                                </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title={'Attiva interazione'}>
                                                <IconButton sx={{background: alpha(muiTheme.palette.primary.main, 0.5)}}
                                                      onClick={handleOpenInteraction}>
                                                    <SpeakerNotesOffOutlined sx={{color: BACKGROUND}}/>
                                                </IconButton>
                                            </Tooltip>
                                        : null
                                }
                            </Stack>
                        </Stack>
                        <Stack mt={3} direction={mobile ? 'column' : 'row'} marginLeft={'auto'} alignItems={'center'}
                               spacing={1}
                               flexWrap={'wrap'}>
                            <Chip label={'Embed Link'} color={'primary'}
                                  variant={!state[actor?.id]?.code || state[actor?.id]?.code?.length !== 11 ? 'outlined' : 'standard'}
                                  size={'small'}/>
                            <Box>
                                <Typography textAlign={'center'} color={'white'} variant={'subtitle2'} flexWrap={'wrap'}
                                            sx={{wordBreak: 'break-word'}}
                                >
                                    <a
                                        className="App-link"
                                        href={getLink(actor?.id)}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        {getLink(actor?.id)}
                                    </a>
                                </Typography>
                            </Box>
                            <Stack direction={'row'} spacing={2}>
                                <Tooltip title={'Copia link da embeddare'}>
                                    <IconButton variant={'contained'}
                                                sx={{color: muiTheme.palette.primary.main}}
                                                disabled={!state[actor?.id]?.code || state[actor?.id]?.code?.length !== 11}
                                                onClick={() => copyLink(getLink(actor?.id))}
                                    >
                                        <ContentCopy/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={'Togli il player di ' + actor?.name + ' e metti la cover'}>
                                    <span>
                                        <IconButton variant={'contained'}
                                                    sx={{color: muiTheme.palette.primary.main}}
                                                    onClick={() => handleStopActor(actor?.id)}
                                            //disabled={!state[actor.id].code || state[actor.id].code?.length !== 11}
                                        >
                                            <StopCircle/>
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <Tooltip title={'Mandando il link live l\'app aggiornerà il player di ' + actor?.name}>
                                    <span>
                                        <Button variant={'contained'} fullWidth startIcon={<PlayCircle/>}
                                                size={'small'}
                                                onClick={() => handlePlayLiveLink(actor?.id)}
                                                disabled={!state[actor?.id]?.code || state[actor?.id]?.code?.length !== 11}>
                                            Play
                                        </Button>
                                    </span>
                                </Tooltip>
                                {actor?.id === 'amleto' &&
                                    <span>
                                    <Button variant={show?.openInteraction ? 'contained' : 'outlined'}
                                            fullWidth
                                            startIcon={show?.openInteraction ? <SpeakerNotesOff/> : <Reviews/>}
                                            size={'small'}
                                            onClick={() => handleOpenInteraction()}>
                                        {`${show?.openInteraction ? 'DISATTIVA' : 'ATTIVA'} interazione pubblico`}
                                    </Button>
                                </span>}
                            </Stack>
                        </Stack>

                    </Stack>)}
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