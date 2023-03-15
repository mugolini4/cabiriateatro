import {alpha, createTheme} from "@mui/material";

const PRIMARY = "#aba75f";
const SECONDARY = "#808080";
export const BACKGROUND = "#393a3b";
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
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#252a33",
                },
            }
        },
        MuiInputBase: {
            variants: [
                {
                    props: {variant: 'control'},
                    style: {
                        color: 'red',
                        "& input": {
                            textAlign: "center"
                        }
                    }
                }
            ],
            styleOverrides: {
                root: {
                    color: "#252a33",
                    "& input": {
                        textAlign: "center"
                    }
                },
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    background: 'white',
                    borderRadius: '1rem',
                    borderColor: '#252a33',
                    boxShadow: 'none',
                    '& fieldset': {
                        borderRadius: `1rem`,
                        textAlign: "center"
                    },
                }
            }
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