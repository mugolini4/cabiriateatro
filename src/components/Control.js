import {muiTheme} from "../theme";
import {Avatar, Button, Chip, IconButton, Paper, Stack, TextField, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import {Actors} from "../stages/Main";
import {ContentCopy, PlayCircle} from "@mui/icons-material";

export const controlRoomSx = {
    backgroundColor: muiTheme.palette.background.main,
    minHeight: '100vh',
    alignItems: 'left',
    width: '100%',
    paddingTop: '4vh',
    padding: 5
}

const Control = () => {
    /** TODO: scrivere su firebase il link nuovo */

    //https://youtube.com/live/Y0-RAwTYlkE?feature=share
    const links = {}
    Actors.forEach((actor) => {
        links[actor.id] = {
            link: "",
            code: null
        }
    })
    const [state, setState] = useState(links)

    function getCodeLink(link) {
        let streamingCode = link?.split('live/')[1]
        streamingCode = streamingCode?.split('?')[0]

        return streamingCode || null
    }

    function getLink(actorId) {
        return state[actorId] && state[actorId].code ? `https://www.youtube.com/embed/${state[actorId].code}?autoplay=1&mute=0` : "";
    }

    function handleChange(event) {
        setState({...state, [event.target.id]: {link: event.target.value, code: getCodeLink(event.target.value)}});
    }

    return (
        <Stack sx={controlRoomSx} alignItems={'center'}>
            <Typography variant={'h4'} gutterBottom color={muiTheme.palette.primary.main}>
                Link streaming attori
            </Typography>
            <Stack mt={2} spacing={3} width={'80%'} marginX={'auto'}>
                {Actors.map((actor, index) =>
                    <Stack key={actor.id} component={Paper} variant={"outlined"} p={2}
                           borderRadius={'1.5rem'} borderColor={muiTheme.palette.primary.main}
                           color={'white'}
                           sx={{background: 'transparent'}}
                           alignItems={'flex-start'} justifyContent={'left'}>
                        <Stack direction={"row"} alignItems={'center'} justifyContent={'center'} width={'65%'}>
                            <Avatar src={actor.img}
                                    sx={{
                                        width: 64, height: 64,
                                        marginRight: 3,
                                        boxShadow: `5px 8px 18px 0px ${muiTheme.palette.secondary.main}`
                                    }}/>
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
                                       value={state[actor.id].link}
                                       onChange={(event) => handleChange(event)}
                                       type={'text'}/>
                            {/*<Stack direction={'row'} spacing={1} alignItems={'center'} marginLeft={'5%'} flexWrap={'wrap'}>
                                <Typography>https://www.youtube.com/embed/</Typography>
                                <TextField variant={'standard'}
                                           size={'small'}
                                           placeholder={'Codice YouTube live'}
                                           inputProps={{
                                               color: 'red',
                                               "& input": {
                                                   textAlign: "center"
                                               }
                                           }}
                                           sx={{
                                               '.MuiInput-root': {
                                                   color: muiTheme.palette.primary.main,
                                               },
                                               '& .MuiInput-underline:before': {borderBottomColor: muiTheme.palette.primary.main},
                                               '& .MuiInput-underline:after': {borderBottomColor: muiTheme.palette.primary.main},
                                               background: 'transparent',
                                               borderRadius: '1rem',
                                               boxShadow: 'none',
                                           }}
                                    //value={dati.nome}
                                    //onChange={(event) => handleChange(event, 'nome')}
                                           type={'text'}/>
                                <Typography>?autoplay=1&mute=0</Typography>
                            </Stack>*/}
                        </Stack>
                        <Stack mt={3} direction={'row'} marginLeft={'auto'} alignItems={'center'} spacing={1}>
                            <Chip label={'Embed Link'} color={'primary'} size={'small'}/>
                            <Typography textAlign={'center'} color={'white'} variant={'subtitle2'}>
                                <a
                                    className="App-link"
                                    href={getLink(actor.id)}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {getLink(actor.id)}
                                </a>
                            </Typography>
                            <Stack direction={'row'} spacing={2}>
                                <Tooltip title={'Copia link da embeddare'}>
                                    <IconButton variant={'contained'}
                                                sx={{color: muiTheme.palette.primary.main}}
                                                disabled={!state[actor.id].code || state[actor.id].code?.length !== 11}
                                    >
                                        <ContentCopy/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={'Mandando il link live l\'app aggiornerà il player di ' + actor.name}>
                                    <span>
                                        <Button variant={'contained'} fullWidth startIcon={<PlayCircle/>}
                                                disabled={!state[actor.id].code || state[actor.id].code?.length !== 11}>
                                            Manda live
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Stack>
                        </Stack>

                    </Stack>)}
            </Stack>
        </Stack>
    )
}

export default Control