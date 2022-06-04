import {alpha, createTheme} from "@mui/material";

const PRIMARY = "#aba75f";
const SECONDARY = "#808080";
const BACKGROUND = "#393a3b";
const ERROR = "#b00020";

const font = "'Montserrat','Helvetica Neue','Arial','sans-serif','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"

export const muiTheme = createTheme({
    palette: {
        primary: {
            main: PRIMARY
        },
        secondary: {
            main: SECONDARY
        },
        error: {
            main: ERROR
        },
        background: {
            main: BACKGROUND
        },
        disabled: {
            main: ERROR
        },
        type: "dark",
    },
    typography: {
        fontFamily: font
    },
    components: {
        MuiTypography: {
            defaultProps: {
                fontFamily: font,
            },
        },
        MuiLink: {
            defaultProps: {
                underline: "hover"
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    "&.Mui-disabled": {
                        color: alpha(SECONDARY, 0.4),
                        border: `1px solid ${alpha(SECONDARY, 0.4)}`
                    }
                }
            }
        },
    }
});