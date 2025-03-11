import {BACKGROUND, muiTheme} from "../theme";
import {
    alpha,
    Button,
    Chip,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Lock, LockOpen, Reviews, Save, SpeakerNotesOff, SpeakerNotesOffOutlined} from "@mui/icons-material";
import {firestore} from "../firebase_config";
import {useDocumentData} from "react-firebase-hooks/firestore";
import StyledBadge from "./StyledBadge";
import MainStage from "../stages/Main";

export const controlRoomSx = {
    backgroundColor: muiTheme.palette.background.main,
    minHeight: '100vh',
    alignItems: 'left',
    width: '100%',
    paddingTop: '4vh',
    padding: 2
}

const Control = () => {
    const [showData, showDataLoading, showDataError] = useDocumentData(firestore.doc('facciamone-un-dramma/config'))

    const mobile = useMediaQuery(muiTheme.breakpoints.between("xs", "sm"));

    const [show, setShow] = useState(showData)

    useEffect(() => {
        if (showData && !showDataLoading)
            setShow(showData)
    }, [showData])

    function handleOpenInteraction() {
        /** PERMETTE L'INTERAZIONE CON IL PUBBLICO */
        firestore.collection('facciamone-un-dramma').doc('config').set({
            openInteraction: !showData?.openInteraction
        }, {merge: true}).then()
    }

    function save() {
        firestore.collection('facciamone-un-dramma').doc('config').set(show, {merge: true}).then()
    }

    function handleChangeShowData(event) {
        setShow({
            ...show,
            [event.target.id]: event.target.value
        })
    }

    function handlePlayShow() {
        firestore.collection('facciamone-un-dramma').doc('config').set({
            isPlaying: !show?.isPlaying
        }, {merge: true}).then()
    }

    return (
        <Stack sx={controlRoomSx} alignItems={'center'}>
            <Typography variant={'h4'} gutterBottom color={muiTheme.palette.primary.main}>
                Pannello di controllo
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

                    <Button variant={'contained'} startIcon={show?.isPlaying ? <Lock/> : <LockOpen/>}
                            onClick={handlePlayShow}>
                        {show?.isPlaying ? "Blocca l'accesso" : "Consenti accesso"}
                    </Button>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Stack py={2}
                           alignItems={'center'}
                           borderRadius={'1.5rem'}
                           borderColor={muiTheme.palette.secondary.main}
                           variant={"outlined"}
                           color={'white'}
                           sx={{background: 'black'}}
                           component={Paper}
                           width={'240px'}
                           height={'370px'}
                    >
                        <Typography gutterBottom>Preview utente</Typography>
                        {<MainStage preview={true}/>}
                        {/*<Stack mt={'auto'}>
                            {
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
                            }
                        </Stack>*/}
                    </Stack>
                    <Stack p={2}
                           alignItems={'center'}
                           borderRadius={'1.5rem'}
                           borderColor={muiTheme.palette.secondary.main}
                           variant={"outlined"}
                           color={'white'}
                           sx={{background: 'black'}}
                           component={Paper}
                           width={'100%'}
                           height={'370px'}
                    >
                        <Typography gutterBottom>Risultati sondaggi</Typography>
                        {/*<MainStage preview={true}/>*/}
                        <iframe src="https://wall.sli.do/event/wRVrJ5g1JWtQ1xp4JpMjdi?section=bfc92e9e-ad69-4600-a1e0-c465c27c67da" // present
                            width="100%"
                            height={'250px'}
                            frameBorder="0"
                            title="Slido">
                        </iframe>
                    </Stack>
                </Stack>
                <Stack>
                    <Tooltip title={showData?.openInteraction ? "Disattiva interazione" : "Attiva interazione"}>
                        <Button variant={showData?.openInteraction ? 'contained' : 'outlined'}
                                fullWidth
                                startIcon={showData?.openInteraction ? <SpeakerNotesOff/> : <Reviews/>}
                                size={'small'}
                                sx={{mt: 'auto'}}
                                onClick={handleOpenInteraction}>
                            {`${showData?.openInteraction ? 'DISATTIVA' : 'ATTIVA'} interazione pubblico`}
                        </Button>
                    </Tooltip>
                </Stack>
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