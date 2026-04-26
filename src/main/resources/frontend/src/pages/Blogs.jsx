import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../contexts/AuthContext';
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogCover,
} from '../api/blogs';

const FALLBACK_IMG =
    'https://placehold.co/600x400/e3eaf6/2a5db0?text=No+Cover+Image';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const emptyForm = {
  title: '',
  content: '',
  category: '',
  excerpt: '',
  coverImageUrl: '',
};

export default function Blogs() {
  const { isAdmin } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Read modal
  const [reading, setReading] = useState(null);

  // Create / Edit dialog
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  // Upload state (lives inside the editor dialog)
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      setBlogs(await listBlogs());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(blogs.map((b) => b.category).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [blogs]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return blogs.filter((b) => {
      const inCategory = activeCategory === 'All' || b.category === activeCategory;
      const inSearch =
          !term ||
          b.title?.toLowerCase().includes(term) ||
          b.excerpt?.toLowerCase().includes(term) ||
          b.content?.toLowerCase().includes(term);
      return inCategory && inSearch;
    });
  }, [blogs, activeCategory, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setUploadError(null);
    setEditorOpen(true);
  };

  const openEdit = (blog) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title || '',
      content: blog.content || '',
      category: blog.category || '',
      excerpt: blog.excerpt || '',
      coverImageUrl: blog.coverImageUrl || '',
    });
    setFormError(null);
    setUploadError(null);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    if (saving || uploading) return;
    setEditorOpen(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    // Reset the input so picking the same file again still triggers onChange.
    e.target.value = '';
    if (!file) return;

    // Client-side validation. The server validates again — this is just for UX.
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Only JPG, PNG, GIF, and WebP are allowed.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('Image must be 5 MB or smaller.');
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      const { url } = await uploadBlogCover(file);
      setForm((f) => ({ ...f, coverImageUrl: url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveCover = () => {
    setForm((f) => ({ ...f, coverImageUrl: '' }));
    setUploadError(null);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateBlog(editingId, form);
      } else {
        await createBlog(form);
      }
      setEditorOpen(false);
      await fetchBlogs();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save the post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog) => {
    if (!confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    try {
      await deleteBlog(blog.id);
      await fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete the post.');
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
      <Container maxWidth="lg">
        {/* Header */}
        <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              mb: 4,
            }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Blog
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Articles on marketing, productivity, and personal growth.
            </Typography>
          </Box>

          <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ width: { xs: '100%', md: 'auto' } }}
          >
            <TextField
                size="small"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                  },
                }}
                sx={{ flex: { xs: 1, md: 'unset' }, width: { md: 280 } }}
            />
            {isAdmin && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                  New Post
                </Button>
            )}
          </Stack>
        </Box>

        {/* Category filter */}
        {categories.length > 1 && (
            <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 3, flexWrap: 'wrap', rowGap: 1 }}
            >
              {categories.map((c) => (
                  <Chip
                      key={c}
                      label={c}
                      clickable
                      color={activeCategory === c ? 'primary' : 'default'}
                      variant={activeCategory === c ? 'filled' : 'outlined'}
                      onClick={() => setActiveCategory(c)}
                  />
              ))}
            </Stack>
        )}

        {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
        )}

        {/* Content */}
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
        ) : filtered.length === 0 ? (
            <Box
                sx={{
                  textAlign: 'center',
                  py: 10,
                  color: 'text.secondary',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                }}
            >
              <ArticleIcon sx={{ fontSize: 56, opacity: 0.4, mb: 1 }} />
              <Typography>
                {blogs.length === 0
                    ? 'No blog posts yet.'
                    : 'No posts match your filters.'}
              </Typography>
              {isAdmin && blogs.length === 0 && (
                  <Button variant="text" onClick={openCreate} sx={{ mt: 2 }}>
                    Write the first post →
                  </Button>
              )}
            </Box>
        ) : (
            <Grid container spacing={3}>
              {filtered.map((b) => (
                  <Grid key={b.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 3,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          transition: 'transform 160ms ease, box-shadow 160ms ease',
                          '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                        }}
                        onClick={() => setReading(b)}
                    >
                      <CardMedia
                          component="img"
                          height="180"
                          image={b.coverImageUrl || FALLBACK_IMG}
                          alt={b.title}
                          sx={{ bgcolor: 'action.hover', objectFit: 'cover' }}
                          onError={(e) => {
                            if (e.currentTarget.src !== FALLBACK_IMG) {
                              e.currentTarget.src = FALLBACK_IMG;
                            }
                          }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                        >
                          {b.category && (
                              <Chip
                                  label={b.category}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                              />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(b.publishedDate)}
                          </Typography>
                        </Stack>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}
                        >
                          {b.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                        >
                          {b.excerpt || b.content}
                        </Typography>
                      </CardContent>
                      {isAdmin && (
                          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                            <Tooltip title="Edit">
                              <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEdit(b);
                                  }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(b);
                                  }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </CardActions>
                      )}
                    </Card>
                  </Grid>
              ))}
            </Grid>
        )}

        {/* Read modal */}
        <Dialog
            open={Boolean(reading)}
            onClose={() => setReading(null)}
            maxWidth="md"
            fullWidth
        >
          {reading && (
              <>
                {reading.coverImageUrl && (
                    <Box
                        component="img"
                        src={reading.coverImageUrl}
                        alt={reading.title}
                        sx={{
                          width: '100%',
                          maxHeight: 320,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                    />
                )}
                <DialogTitle sx={{ pb: 0 }}>
                  <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1 }}
                  >
                    {reading.category && (
                        <Chip
                            label={reading.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(reading.publishedDate)}
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {reading.title}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  {reading.excerpt && (
                      <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ mb: 3, fontStyle: 'italic' }}
                      >
                        {reading.excerpt}
                      </Typography>
                  )}
                  <Typography
                      variant="body1"
                      sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}
                  >
                    {reading.content}
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  {isAdmin && (
                      <>
                        <Button
                            color="error"
                            onClick={() => {
                              const target = reading;
                              setReading(null);
                              handleDelete(target);
                            }}
                        >
                          Delete
                        </Button>
                        <Button
                            onClick={() => {
                              const target = reading;
                              setReading(null);
                              openEdit(target);
                            }}
                        >
                          Edit
                        </Button>
                      </>
                  )}
                  <Button variant="contained" onClick={() => setReading(null)}>
                    Close
                  </Button>
                </DialogActions>
              </>
          )}
        </Dialog>

        {/* Editor dialog (create + update) */}
        <Dialog open={editorOpen} onClose={closeEditor} maxWidth="md" fullWidth>
          <DialogTitle>{editingId ? 'Edit post' : 'New post'}</DialogTitle>
          <DialogContent>
            {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
            )}
            <TextField
                fullWidth
                margin="normal"
                label="Title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Category"
                placeholder="e.g. marketing, productivity, personal"
                value={form.category}
                onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                }
            />

            {/* Cover image picker */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cover image
              </Typography>
              {form.coverImageUrl ? (
                  <Box
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 2,
                      }}
                  >
                    <Box
                        component="img"
                        src={form.coverImageUrl}
                        alt="Cover preview"
                        sx={{
                          width: { xs: '100%', sm: 160 },
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 1,
                          flexShrink: 0,
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Cover image uploaded.
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                            size="small"
                            component="label"
                            variant="outlined"
                            disabled={uploading}
                        >
                          Replace
                          <input
                              hidden
                              type="file"
                              accept={ACCEPTED_TYPES.join(',')}
                              onChange={handleFileChange}
                          />
                        </Button>
                        <Button
                            size="small"
                            color="error"
                            onClick={handleRemoveCover}
                            disabled={uploading}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
              ) : (
                  <Button
                      component="label"
                      variant="outlined"
                      startIcon={
                        uploading ? (
                            <CircularProgress size={16} />
                        ) : (
                            <CloudUploadIcon />
                        )
                      }
                      disabled={uploading}
                      sx={{ alignSelf: 'flex-start' }}
                  >
                    {uploading ? 'Uploading...' : 'Upload cover image'}
                    <input
                        hidden
                        type="file"
                        accept={ACCEPTED_TYPES.join(',')}
                        onChange={handleFileChange}
                    />
                  </Button>
              )}
              {uploadError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {uploadError}
                  </Alert>
              )}
              <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
              >
                JPG, PNG, GIF, or WebP. Max 5 MB.
              </Typography>
            </Box>

            <TextField
                fullWidth
                margin="normal"
                label="Excerpt"
                placeholder="A short summary shown on the thumbnail card."
                multiline
                rows={2}
                value={form.excerpt}
                onChange={(e) =>
                    setForm((f) => ({ ...f, excerpt: e.target.value }))
                }
            />
            <TextField
                fullWidth
                margin="normal"
                label="Content"
                required
                multiline
                rows={10}
                value={form.content}
                onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                }
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeEditor} disabled={saving || uploading}>
              Cancel
            </Button>
            <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || uploading}
            >
              {saving ? (
                  <CircularProgress size={20} color="inherit" />
              ) : editingId ? (
                  'Save changes'
              ) : (
                  'Publish'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
}