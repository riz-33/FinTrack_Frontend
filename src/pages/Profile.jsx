import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  UserCircleIcon,
  KeyIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user, login } = useContext(AuthContext); // Destructure login to update local state
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const showToast = (msg, type = "success") => {
    setSnackbar({ open: true, msg, type });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/update-profile", {
        name: formData.name,
        email: formData.email,
      });

      // Update the AuthContext so the sidebar/header reflects the new name
      login(res.data);
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      showToast("Password changed successfully!");
      setFormData({ ...formData, currentPassword: "", newPassword: "" });
    } catch (err) {
      showToast(
        err.response?.data?.message || "Password change failed.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, md: 4 } }}>
      {/* 1. Profile Header */}
      <Box display="flex" alignItems="center" gap={3} mb={5}>
        <Box position="relative">
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: "2.5rem",
              fontWeight: "bold",
              boxShadow: theme.shadows[4],
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              border: "1px solid #ddd",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <CameraIcon style={{ width: 16, height: 16 }} />
          </IconButton>
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="900" letterSpacing="-1px">
            {user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.type}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>

      <Grid container spacing={4}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <UserCircleIcon
                  style={{
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography variant="h6" fontWeight="800">
                  Account Details
                </Typography>
              </Box>

              <form onSubmit={handleUpdateProfile}>
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    InputProps={{ sx: { borderRadius: 3 } }}
                  />
                  <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    InputProps={{ sx: { borderRadius: 3 } }}
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Security / Password */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <KeyIcon
                  style={{
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography variant="h6" fontWeight="800">
                  Security
                </Typography>
              </Box>

              <form onSubmit={handleChangePassword}>
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    InputProps={{ sx: { borderRadius: 3 } }}
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    InputProps={{ sx: { borderRadius: 3 } }}
                  />
                  <Button
                    variant="outlined"
                    type="submit"
                    disabled={loading}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
