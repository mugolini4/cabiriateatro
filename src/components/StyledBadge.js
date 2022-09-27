import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import {muiTheme} from "../theme";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: muiTheme.palette.error.main,
        color: muiTheme.palette.error.main,
        boxShadow: `0 0 0 2px ${muiTheme.palette.primary.main}`,
        minWidth: '12px',
        height: '12px',
        borderRadius: '50%',
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(0.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(3.7)',
            opacity: 0,
        },
    },
}));

export default StyledBadge