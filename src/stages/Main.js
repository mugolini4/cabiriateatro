import React, {useState} from "react";
import {Avatar, Box, Button, Grow, Stack, Typography} from "@mui/material";
import {muiTheme} from "../theme";
import StyledBadge from "../Components/StyledBadge";

/** query params in yt url ?controls=0 */
const Actors = [
    {name: 'Mariano', timeout: 1700, link: `https://www.youtube.com/embed/h5VJ3WV6wBY`},
    {name: 'Elena', timeout: 3200, link: `https://www.youtube.com/embed/kTPhzu4x7o8`},
]

const Streaming = ({followedActor}) => {
    return (
        <Box py={2}>
            <Typography textAlign={'center'}>
                {followedActor?.name||''}
            </Typography>
            <iframe src={followedActor?.link}
                title={followedActor?.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen/>
        </Box>
    );
}

const MainStage = ({show}) => {
    const [followedActor, toggleFollowedActor] = useState(undefined)

    console.log("followedActor:",followedActor)
    const handleChangeActor = (index) => {
        toggleFollowedActor(Actors[index])
    }

    const isSelected = (index) => {
        return index === Actors.findIndex((o) => o.name === followedActor?.name)
    }

    return (
        <Stack p={2} sx={{height: '70vh'}} justifyContent={'center'}>
            <Streaming followedActor={followedActor}/>
            <Box px={2} position={"fixed"} bottom={40} left={0} right={0}>
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
                            <Avatar src={'/img.png'}
                                    sx={{
                                        width: 80, height: 80,
                                        border: `4px solid ${muiTheme.palette.primary.main}`,
                                        boxShadow: `5px 8px 18px 0px ${muiTheme.palette.secondary.main}`
                                    }}/>
                        </StyledBadge>
                        : <Avatar src={'/img.png'}
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