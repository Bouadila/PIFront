import axios from 'axios';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';

// material
import { Box, Grid, Container, Typography, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Stack from '@mui/material/Stack';
// components
import Page from '../components/Page';
import { format } from 'date-fns';

export default function TrainingDetails() {
  const user = useSelector((state) => state.user);
  const [training, setTraining] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://lernigoback.herokuapp.com/api/training/getOne/${id}`).then((response) => {
      setTraining(response.data);
    });
  }, []);
  const navigate = useNavigate();
  const deleteTraining = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00ab55',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://lernigoback.herokuapp.com/api/training/delete/${id}`);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        setTimeout(() => {
          navigate('/training', { replace: true });
        }, 2000);
      }
    });
  };
  const fDateTime = (date) => {
    return format(new Date(date), 'dd MMM yyyy HH:mm ');
  };
  return (
    <Page title=" Traning Details | Minimal-UI">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <IconButton aria-label="delete" component={RouterLink} to="/training">
              <ArrowBackIcon />
            </IconButton>
            {training.name}
          </Typography>
        </Stack>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} md={8} justify="center">
            <Paper
              sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonBase>
                    {training.image && (
                      <CardMedia
                        justify="center"
                        component="img"
                        image={`https://lernigoback.herokuapp.com/${training.image}`}
                      />
                    )}
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={1}>
                    <Grid item xs>
                      <Typography variant="body2" color="text.secondary">
                        {training.tag}
                      </Typography>
                      {training.description && (
                        <Typography variant="body2" gutterBottom component="div">
                          {parse(training.description)}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" component="div">
                      DT{training.price}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper
              sx={{
                p: 2,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
              }}
            >
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  {/* //flag:gb-4x3 */}
                  {training.language === 'French' && (
                    <Icon icon="twemoji:flag-france" width="20" height="20" />
                  )}
                  {training.language === 'English' && (
                    <Icon icon="flag:gb-4x3" width="20" height="20" />
                  )}{' '}
                  Language : {training.language}
                </Typography>
              </Grid>
              <Grid item>
                {training.scheduledDate && (
                  <Typography variant="body2" color="text.secondary">
                    <Icon icon="icon-park:time" width="20" height="20" /> ScheduledDate :{' '}
                    {fDateTime(training.scheduledDate)}
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  <Icon icon="bi:box-arrow-in-down" width="20" height="20" />
                  Participants apply into: {training.nbrApplyInto}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  <Icon icon="heroicons-solid:user-group" width="20" height="20" />
                  Places available: {training.nbrParticipent}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  <Icon icon="el:screen" width="20" height="20" /> Duration: {training.duration} Min
                </Typography>
              </Grid>
              <Grid item>
                {training.trainer?.firstName && training.trainer?.lastName && (
                  <Typography variant="body2" color="text.secondary">
                    <Icon icon="icon-park:user-business" width="20" height="20" /> Created by{' '}
                    <b>
                      {' '}
                      {training.trainer.firstName} {training.trainer.lastName}
                    </b>
                  </Typography>
                )}
              </Grid>
              <Divider variant="middle" />
              <Box sx={{ m: 2 }} justify="center">
                <Stack spacing={2} display="flex" justifyContent="center" alignItems="center">
                  <Button
                    variant="contained"
                    startIcon={<Icon icon="ant-design:video-camera-add-outlined" />}
                    onClick={() => {
                      navigate('/meeting', { replace: false, state: training });
                    }}
                  >
                    join meeting now
                  </Button>
                </Stack>
              </Box>
              <Divider variant="middle" />
              <Box sx={{ m: 2 }} justify="center" justifyContent="space-between">
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      deleteTraining(training._id);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<ModeEditIcon />}
                    component={RouterLink}
                    to={`/training/update/${training._id}`}
                  >
                    Update
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
