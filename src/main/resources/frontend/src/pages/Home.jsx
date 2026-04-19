import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AppsIcon from '@mui/icons-material/Apps';
import BuildIcon from '@mui/icons-material/Build';
import ArticleIcon from '@mui/icons-material/Article';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useAuth } from '../contexts/AuthContext';

const highlights = [
  {
    icon: <AppsIcon fontSize="large" />,
    title: 'Productivity App',
    description:
      'A free productivity app for registered users. Track tasks by category — study, work, or personal.',
    cta: 'Use the app',
    to: '/dashboard',
  },
  {
    icon: <BuildIcon fontSize="large" />,
    title: 'Services',
    description: 'Professional services to help you ship faster. Submit a request and we will follow up.',
    cta: 'Request a service',
    to: '/services',
  },
  {
    icon: <ArticleIcon fontSize="large" />,
    title: 'Blog',
    description: 'Articles on marketing, productivity, and personal growth — updated regularly.',
    cta: 'Read blog',
    to: '/blog',
  },
  {
    icon: <YouTubeIcon fontSize="large" />,
    title: 'YouTube',
    description: 'Watch the latest uploads from the channel, right from the content hub.',
    cta: 'Coming soon',
    to: '/',
    disabled: true,
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2a5db0 0%, #1e4280 100%)',
          color: 'common.white',
          py: { xs: 8, md: 12 },
          mb: { xs: 6, md: 8 },
          mt: { xs: -3, md: -5 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.85 }}>
            Welcome
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mt: 1,
              mb: 2,
              fontSize: { xs: '2.25rem', md: '3.25rem' },
            }}
          >
            One platform. Everything you need.
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 640, opacity: 0.92, fontWeight: 400, mb: 4 }}
          >
            A productivity app, a content hub, and a services marketplace — all in one place.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              size="large"
              variant="contained"
              color="secondary"
              component={RouterLink}
              to={isAuthenticated ? '/dashboard' : '/register'}
            >
              {isAuthenticated ? 'Open the app' : 'Get started'}
            </Button>
            <Button
              size="large"
              variant="outlined"
              component={RouterLink}
              to="/services"
              sx={{
                color: 'common.white',
                borderColor: 'rgba(255,255,255,0.6)',
                '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Request a service
            </Button>
            <Button
              size="large"
              variant="text"
              component={RouterLink}
              to="/blog"
              sx={{ color: 'common.white' }}
            >
              Read the blog →
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Highlights */}
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          What's here
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Four pillars, one account.
        </Typography>

        <Grid container spacing={3}>
          {highlights.map((h) => (
            <Grid key={h.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'transform 160ms ease, box-shadow 160ms ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{h.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {h.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, flexGrow: 1 }}
                >
                  {h.description}
                </Typography>
                <Button
                  component={RouterLink}
                  to={h.to}
                  disabled={h.disabled}
                  variant="text"
                  sx={{ alignSelf: 'flex-start', px: 0 }}
                >
                  {h.cta} →
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
