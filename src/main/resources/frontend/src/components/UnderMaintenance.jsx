import { Box, Container, Paper, Typography, Button } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Reusable placeholder for pages that are still being built.
 * Pass a `title` prop to customize what's shown above the icon.
 */
export default function UnderMaintenance({ title = 'This page' }) {
  return (
    <Container maxWidth="sm">
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          textAlign: 'center',
          border: 1,
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            mx: 'auto',
            mb: 3,
            borderRadius: '50%',
            bgcolor: 'secondary.light',
            color: 'secondary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ConstructionIcon sx={{ fontSize: 56 }} />
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          This page is currently undergoing maintenance. Check back soon.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to home
        </Button>
      </Paper>
    </Container>
  );
}
