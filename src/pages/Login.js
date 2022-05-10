import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography, Divider, Alert } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { LoginForm } from '../sections/authentication/login';
import GoogleLogin from 'react-google-login';
import { useDispatch } from 'react-redux';
import { login } from 'src/features/User/UserSlice';
import { useState } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);
  const handleLogin = async (googleData) => {
    const res = await fetch('https://lernigoback.herokuapp.com/users/google', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    const {
      _id,
      email,
      firstName,
      lastName,
      photo,
      role,
      phone,
      skills,
      followers,
      following,
      status
    } = data.user;
    // store returned user somehow
    if (!status) {
      setStatus({ type: 'error', message: 'Your account is banned please contact your admin' });
    } else {
      dispatch(
        login({
          email,
          token: data.accessToken,
          firstName,
          lastName,
          role,
          phone,
          followers,
          following,
          id: _id,
          photo: `https://lernigoback.herokuapp.com/${photo}`,
          skills
        })
      );
    }
  };
  return (
    <RootStyle title="Login | Minimal-UI">
      <AuthLayout>
        Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Get started
        </Link>
      </AuthLayout>

      <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
          Hi, Welcome Back
        </Typography>
        <img src="/static/illustrations/illustration_login.png" alt="login" />
      </SectionStyle>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Sign in to Minimal
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
          </Stack>
          <GoogleLogin
            clientId={'374086012147-nprk3ceoj1dds52ipbksbcr4jdc4mjk8.apps.googleusercontent.com'}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={'single_host_origin'}
          />
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>
          <Stack sx={{ mb: 5 }}>
            {status && (
              <Alert onClose={() => setStatus(null)} severity={status?.type} sx={{ width: '100%' }}>
                {status?.message}
              </Alert>
            )}
          </Stack>
          <LoginForm />

          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 3,
              display: { sm: 'none' }
            }}
          >
            Don’t have an account?&nbsp;
            <Link variant="subtitle2" component={RouterLink} to="register" underline="hover">
              Get started
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
