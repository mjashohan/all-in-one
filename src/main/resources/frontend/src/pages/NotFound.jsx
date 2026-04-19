import { Container, Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h1"
          sx={{ fontWeight: 800, fontSize: { xs: '6rem', md: '8rem' }, color: 'primary.main' }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" size="large">
          Back to home
        </Button>
      </Box>
    </Container>
  );
}
