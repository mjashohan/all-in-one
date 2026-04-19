import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate('/');
  };

  const initial = (user?.username || '?').charAt(0).toUpperCase();

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ gap: 2 }}>
          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton edge="start" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          )}

          {/* Brand */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: '-0.01em',
              mr: 2,
            }}
          >
            All-In-One
          </Typography>

          {/* Desktop links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  color="inherit"
                  sx={{ color: 'text.primary' }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* Right side: auth state */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {!isMobile && (
                <Box sx={{ textAlign: 'right', lineHeight: 1.1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              )}
              {isAdmin && !isMobile && (
                <Chip label="ADMIN" size="small" color="secondary" sx={{ fontWeight: 600 }} />
              )}
              <IconButton onClick={openMenu} size="small" aria-label="Account menu">
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>{initial}</Avatar>
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    closeMenu();
                    navigate(isAdmin ? '/admin' : '/dashboard');
                  }}
                >
                  <DashboardIcon fontSize="small" sx={{ mr: 1.5 }} />
                  {isAdmin ? 'Admin dashboard' : 'Dashboard'}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeMenu();
                    navigate('/dashboard');
                  }}
                >
                  <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                startIcon={<LoginIcon />}
              >
                Log in
              </Button>
              {!isMobile && (
                <Button component={RouterLink} to="/register" variant="contained">
                  Sign up
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton component={RouterLink} to={link.to}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            {isAuthenticated ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to={isAdmin ? '/admin' : '/dashboard'}>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText primary="Log out" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/login">
                    <ListItemText primary="Log in" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/register">
                    <ListItemText primary="Sign up" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
