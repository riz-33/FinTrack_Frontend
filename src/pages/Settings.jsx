import { useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import {
  PaintBrushIcon,
  CurrencyDollarIcon,
  BellIcon,
  ShieldCheckIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import { CurrencyContext } from "../context/ThemeContext"; // Assuming currency lives here

const SettingSection = ({ title, icon: Icon, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 3,
      borderRadius: 5,
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
      <Icon style={{ width: 22, height: 22, color: "#6366f1" }} />
      <Typography variant="h6" fontWeight="800">
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

const Settings = () => {
  const { currency, setCurrency } = useContext(CurrencyContext);

  // Local state for toggles (ideally these would come from a SettingsContext or Backend)
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailReports: false,
    twoFactor: true,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="900" mb={4} letterSpacing="-1.5px">
        Settings
      </Typography>

      {/* 1. Localization & Currency */}
      <SettingSection title="Preferences" icon={LanguageIcon}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Primary Currency</InputLabel>
              <Select
                value={currency}
                label="Primary Currency"
                onChange={(e) => setCurrency(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="USD">USD ($) - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR (€) - Euro</MenuItem>
                <MenuItem value="GBP">GBP (£) - British Pound</MenuItem>
                <MenuItem value="INR">INR (₹) - Indian Rupee</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select value="en" label="Language" sx={{ borderRadius: 3 }}>
                <MenuItem value="en">English (US)</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </SettingSection>

      {/* 2. Appearance */}
      <SettingSection title="Appearance" icon={PaintBrushIcon}>
        <List disablePadding>
          <ListItem
            secondaryAction={
              <Switch
                checked={settings.darkMode}
                onChange={() => handleToggle("darkMode")}
              />
            }
          >
            <ListItemText
              primary="Dark Mode"
              secondary="Reduce eye strain in low-light environments"
            />
          </ListItem>
        </List>
      </SettingSection>

      {/* 3. Notifications */}
      <SettingSection title="Notifications" icon={BellIcon}>
        <List disablePadding>
          <ListItem
            secondaryAction={
              <Switch
                checked={settings.notifications}
                onChange={() => handleToggle("notifications")}
              />
            }
          >
            <ListItemText
              primary="Push Notifications"
              secondary="Alerts for unusual spending or budget limits"
            />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem
            secondaryAction={
              <Switch
                checked={settings.emailReports}
                onChange={() => handleToggle("emailReports")}
              />
            }
          >
            <ListItemText
              primary="Weekly Email Reports"
              secondary="Get a summary of your finances every Monday"
            />
          </ListItem>
        </List>
      </SettingSection>

      {/* 4. Danger Zone */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          borderRadius: 5,
          bgcolor: "error.main" + "10",
          border: "1px dashed",
          borderColor: "error.main",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="error.main"
          mb={1}
        >
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Once you delete your account, there is no going back. Please be
          certain.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          sx={{ borderRadius: 3, fontWeight: "bold" }}
        >
          Delete Account
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
