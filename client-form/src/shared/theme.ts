import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C847FF',
      light: '#E040FF',
      dark: '#BF5FFF',
    },
    secondary: {
      main: '#00D4FF',
      light: '#00AAFF',
    },
    background: {
      default: '#06060E',
      paper: '#0C0C1A',
    },
    text: {
      primary: '#F5F2ED',
      secondary: 'rgba(245, 242, 237, 0.72)',
    },
  },
  typography: {
    fontFamily: "'Epilogue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 900,
      fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
    },
    h2: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 700,
      fontSize: 'clamp(1.9rem, 3.8vw, 3rem)',
    },
    h3: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 700,
      fontSize: '1rem',
    },
    h4: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 700,
      fontSize: '0.95rem',
    },
    body1: {
      fontSize: '0.95rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.85rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '2rem',
          paddingBottom: '2rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(12, 12, 26, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(200, 71, 255, 0.15)',
          borderRadius: '24px',
          boxShadow: '0 48px 120px rgba(0,0,0,.6)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '2rem',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontFamily: "'Epilogue', sans-serif",
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(200, 71, 255, 0.15)',
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(200, 71, 255, 0.3)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(200, 71, 255, 0.08)',
              borderColor: '#C847FF',
              boxShadow: '0 0 20px rgba(200, 71, 255, 0.2)',
            },
            '& input': {
              color: 'var(--light)',
              '&::placeholder': {
                color: 'rgba(245, 242, 237, 0.4)',
              },
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(200, 71, 255, 0.15)',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(245, 242, 237, 0.6)',
            fontFamily: "'Epilogue', sans-serif",
            '&.Mui-focused': {
              color: '#C847FF',
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: "'Epilogue', sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          fontFamily: "'Epilogue', sans-serif",
          fontWeight: 500,
          fontSize: '0.95rem',
          padding: '13px 30px',
          borderRadius: '60px',
          background: 'linear-gradient(135deg, #C847FF 0%, #E040FF 100%)',
          boxShadow: '0 8px 24px rgba(200, 71, 255, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E040FF 0%, #C847FF 100%)',
            boxShadow: '0 12px 32px rgba(200, 71, 255, 0.4)',
            transform: 'translateY(-2px)',
          },
          '&:disabled': {
            background: 'rgba(200, 71, 255, 0.2)',
            color: 'rgba(245, 242, 237, 0.4)',
          },
        },
        outlined: {
          fontFamily: "'Epilogue', sans-serif",
          fontWeight: 500,
          fontSize: '0.95rem',
          padding: '13px 30px',
          borderRadius: '60px',
          color: '#C847FF',
          border: '1.5px solid rgba(200, 71, 255, 0.4)',
          backgroundColor: 'rgba(200, 71, 255, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(200, 71, 255, 0.12)',
            borderColor: '#C847FF',
            boxShadow: '0 8px 24px rgba(200, 71, 255, 0.15)',
          },
          '&:disabled': {
            borderColor: 'rgba(200, 71, 255, 0.15)',
            color: 'rgba(245, 242, 237, 0.3)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: "'Epilogue', sans-serif",
          borderRadius: '12px',
          border: '1px solid',
          backdropFilter: 'blur(8px)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderColor: 'rgba(0, 212, 255, 0.3)',
          color: '#00D4FF',
          '& .MuiAlert-icon': {
            color: '#00D4FF',
          },
        },
        standardError: {
          backgroundColor: 'rgba(224, 64, 255, 0.1)',
          borderColor: 'rgba(224, 64, 255, 0.3)',
          color: '#E040FF',
          '& .MuiAlert-icon': {
            color: '#E040FF',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: 'rgba(224, 64, 255, 0.7)',
          fontFamily: "'Epilogue', sans-serif",
          fontSize: '0.75rem',
        },
      },
    },
  },
})

export default theme
