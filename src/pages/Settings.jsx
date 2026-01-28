import { useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Button,
  Grid,
} from "@mui/material";
import {
  PaintBrushIcon,
  BellIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CurrencyContext, ColorModeContext } from "../context/ThemeContext";
import { useTheme } from "@mui/material/styles";

const Settings = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { currency, toggleCurrency } = useContext(CurrencyContext);

  // Local state for non-context preferences
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
  });

  const SectionCard = ({ title, icon: Icon, children }) => (
    <Paper
      elevation={0}
      className="p-6 mb-6 rounded-3xl border border-gray-100 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <Typography variant="h6" fontWeight="600" className="dark:text-white">
          {title}
        </Typography>
      </div>
      {children}
    </Paper>
  );

  return (
    <Box className="max-w-4xl mx-auto">
      <Typography
        variant="h5"
        fontWeight="800"
        className="mb-8 tracking-tight dark:text-white"
      >
        System Settings
      </Typography>

      {/* Appearance Section */}
      <SectionCard title="Appearance" icon={PaintBrushIcon}>
        <div className="flex items-center justify-between">
          <div>
            <Typography fontWeight="600" className="dark:text-gray-200">
              Dark Mode
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Adjust the interface to reduce eye strain
            </Typography>
          </div>
          <Switch
            checked={theme.palette.mode === "dark"}
            onChange={colorMode.toggleColorMode}
          />
        </div>
      </SectionCard>

      {/* Localization Section */}
      <SectionCard title="Localization" icon={CurrencyDollarIcon}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel className="dark:text-gray-400">
                Default Currency
              </InputLabel>
              <Select
              size="small"
                value={currency}
                label="Default Currency"
                onChange={(e) => {
                  if (e.target.value !== currency) toggleCurrency();
                }}
                className="dark:text-white dark:border-gray-700"
              >
                <MenuItem value="USD">USD ($) - US Dollar</MenuItem>
                <MenuItem value="PKR">PKR (₨) - Pakistani Rupee</MenuItem>
                <MenuItem value="EUR">EUR (€) - Euro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Notification Section */}
      <SectionCard title="Notifications" icon={BellIcon}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography className="dark:text-gray-200">
              Push Notifications
            </Typography>
            <Switch
              checked={notifications.push}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  push: !notifications.push,
                })
              }
            />
          </div>
          <Divider className="dark:border-gray-800" />
          <div className="flex items-center justify-between">
            <Typography className="dark:text-gray-200">
              Weekly Email Summary
            </Typography>
            <Switch
              checked={notifications.email}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  email: !notifications.email,
                })
              }
            />
          </div>
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <div className="mt-12 p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
        <Typography
          variant="h6"
          fontWeight="bold"
          color="error"
          className="mb-2"
        >
          Danger Zone
        </Typography>
        <Typography  variant="body2" color="text.secondary" className="mb-4">
          Once you delete your account, there is no going back. All your
          financial history will be permanently erased.
        </Typography>
        <Button variant="outlined" color="error" sx={{ borderRadius: "12px" }}>
          Delete Account
        </Button>
      </div>
    </Box>
  );
};

export default Settings;
