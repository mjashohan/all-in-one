import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MailIcon from '@mui/icons-material/Mail';
import { listUsers, deleteUser } from '../api/users';
import {
  listServiceRequests,
  updateServiceRequestStatus,
  deleteServiceRequest,
} from '../api/serviceRequests';
import { listMessages, deleteMessage } from '../api/messages';

const STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE', 'REJECTED'];

const statusColor = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'PENDING':
      return 'warning';
    case 'IN_PROGRESS':
      return 'info';
    case 'DONE':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

function StatCard({ icon, label, value, color = 'primary.main' }) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 3, height: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: 'action.hover',
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

// Extracted inline status-change menu for service requests.
function StatusMenu({ current, onChange }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <Tooltip title="Change status">
        <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {STATUSES.map((s) => (
          <MenuItem
            key={s}
            selected={s === current}
            onClick={() => {
              setAnchor(null);
              if (s !== current) onChange(s);
            }}
          >
            {s}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, r, m] = await Promise.all([listUsers(), listServiceRequests(), listMessages()]);
      setUsers(u);
      setRequests(r);
      setMessages(m);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm(`Delete user #${id}?`)) return;
    await deleteUser(id);
    await fetchAll();
  };

  const handleStatusChange = async (id, status) => {
    await updateServiceRequestStatus(id, status);
    await fetchAll();
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm(`Delete service request #${id}?`)) return;
    await deleteServiceRequest(id);
    await fetchAll();
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm(`Delete message #${id}?`)) return;
    await deleteMessage(id);
    await fetchAll();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Admin dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage users, service requests, and contact messages.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={fetchAll} disabled={loading}>
          Refresh
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard icon={<PeopleAltIcon />} label="Users" value={users.length} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            icon={<AssignmentIcon />}
            label="Service requests"
            value={requests.length}
            color="secondary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard icon={<MailIcon />} label="Messages" value={messages.length} color="success.main" />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label={`Users (${users.length})`} />
          <Tab label={`Service Requests (${requests.length})`} />
          <Tab label={`Messages (${messages.length})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {tab === 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id} hover>
                          <TableCell>#{u.id}</TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>{u.username}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={u.role}
                              size="small"
                              color={u.role === 'ADMIN' ? 'secondary' : 'default'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.role === 'ADMIN'}
                              color="error"
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {tab === 1 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.map((r) => (
                        <TableRow key={r.id} hover>
                          <TableCell>#{r.id}</TableCell>
                          <TableCell>{r.username || '—'}</TableCell>
                          <TableCell>{r.serviceType}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
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
                          <TableCell align="right">
                            <StatusMenu
                              current={r.status}
                              onChange={(s) => handleStatusChange(r.id, s)}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteRequest(r.id)}
                              color="error"
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {tab === 2 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Content</TableCell>
                        <TableCell>Sent</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {messages.map((m) => (
                        <TableRow key={m.id} hover>
                          <TableCell>#{m.id}</TableCell>
                          <TableCell>{m.senderName}</TableCell>
                          <TableCell>{m.senderEmail}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {m.content}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {m.sentAt ? new Date(m.sentAt).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteMessage(m.id)}
                              color="error"
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
