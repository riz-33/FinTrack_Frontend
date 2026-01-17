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
  Divider,
  Alert,
} from "@mui/material";
import { UserCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/update-profile", {
        name: formData.name,
        email: formData.email,
      });
      setStatus({ type: "success", msg: "Profile updated successfully!" });
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to update profile." });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setStatus({ type: "success", msg: "Password changed successfully!" });
      setFormData({ ...formData, currentPassword: "", newPassword: "" });
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Password change failed.",
      });
    }
  };

  return (
    <Box className="max-w-4xl mx-auto">
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Account Settings
      </Typography>

      {status.msg && (
        <Alert
          severity={status.type}
          sx={{ mb: 3 }}
          onClose={() => setStatus({ type: "", msg: "" })}
        >
          {status.msg}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                <Typography variant="h6" fontWeight="bold">
                  Personal Info
                </Typography>
              </Box>

              <form onSubmit={handleUpdateProfile}>
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <TextField
                    label="Email Address"
                    fullWidth
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Update Profile
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Security / Password */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <KeyIcon className="h-6 w-6 text-indigo-600" />
                <Typography variant="h6" fontWeight="bold">
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
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Change Password
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
