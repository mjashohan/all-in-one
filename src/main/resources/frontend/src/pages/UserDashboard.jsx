import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAuth } from '../contexts/AuthContext';
import {
  getMyServiceRequests,
  submitServiceRequest,
} from '../api/serviceRequests';

const statusColor = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'PENDING':
      return 'warning';
    case 'IN_PROGRESS':
      return 'info';
    case 'DONE':
    case 'COMPLETED':
      return 'success';
    case 'REJECTED':
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const SERVICE_TYPES = ['Consulting', 'Development', 'Design', 'SEO', 'Other'];

export default function UserDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ serviceType: 'Consulting', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      setRequests(await getMyServiceRequests());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your service requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitServiceRequest(form);
      setDialogOpen(false);
      setForm({ serviceType: 'Consulting', description: '' });
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Welcome back, {user?.username}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your account.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 3, height: '100%' }}
          >
            <Typography variant="overline" color="text.secondary">
              Profile
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
              {user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user?.email}
            </Typography>
            <Chip
              label={user?.role}
              size="small"
              color={user?.role === 'ADMIN' ? 'secondary' : 'primary'}
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* App usage placeholder — integrates with your existing productivity app */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 3, height: '100%' }}
          >
            <Typography variant="overline" color="text.secondary">
              Productivity app
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5, mb: 1 }}>
              Your usage
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Once the productivity app is wired up, your task and usage summary will appear here.
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'App opens', value: '—' },
                { label: 'Tasks created', value: '—' },
                { label: 'Top category', value: '—' },
              ].map((stat) => (
                <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Service requests */}
        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 2, gap: 1 }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Your service requests
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Track your submissions
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setDialogOpen(true)}
              >
                New request
              </Button>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : requests.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <AssignmentIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
                <Typography>You haven't submitted any requests yet.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>#{r.id}</TableCell>
                        <TableCell>{r.serviceType}</TableCell>
                        <TableCell sx={{ maxWidth: 400 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {r.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={r.status} size="small" color={statusColor(r.status)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* New request dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request a service</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Service type"
            value={form.serviceType}
            onChange={(e) => setForm((f) => ({ ...f, serviceType: e.target.value }))}
          >
            {SERVICE_TYPES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Tell us what you need..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !form.description.trim()}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
