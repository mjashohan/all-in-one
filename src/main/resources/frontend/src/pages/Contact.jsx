import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import { sendMessage } from '../api/messages';

export default function Contact() {
  const [form, setForm] = useState({ senderName: '', senderEmail: '', content: '' });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, message: '' });
    try {
      await sendMessage(form);
      setStatus({ type: 'success', message: 'Message sent. I will get back to you soon.' });
      setForm({ senderName: '', senderEmail: '', content: '' });
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.details
        ? Object.values(data.details).join(' ')
        : data?.message || 'Failed to send message.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ pt: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'common.white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <MailOutlineIcon />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              Get in touch
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Have a question, a project idea, or just want to say hi? Drop a message and I will
              reply as soon as possible.
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 3 }}
          >
            {status.type && (
              <Alert severity={status.type} sx={{ mb: 2 }}>
                {status.message}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Your name"
                name="senderName"
                value={form.senderName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="senderEmail"
                type="email"
                value={form.senderEmail}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Message"
                name="content"
                multiline
                rows={5}
                value={form.content}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ mt: 2, py: 1.25, px: 4 }}
              >
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Send message'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
