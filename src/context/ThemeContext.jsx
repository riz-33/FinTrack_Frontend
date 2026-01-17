import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const CurrencyContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD",
  );
  const [rate, setRate] = useState(280); // Default fallback

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        setRate(data.rates.PKR);
      } catch (err) {
        console.error("Failed to fetch rates, using fallback 280");
      }
    };
    fetchRate();
  }, []);

  const toggleCurrency = () => {
    const next = currency === "USD" ? "PKR" : "USD";
    setCurrency(next);
    localStorage.setItem("currency", next);
  };

  const formatValue = (value) => {
    // 1. Convert the value based on the current rate
    // If currency is USD, rate is 1. If PKR, it uses the state 'rate' (e.g., 280)
    const numericRate = currency === "USD" ? 1 : rate;
    const convertedValue = (value || 0) * numericRate;

    // 2. Use Intl.NumberFormat for professional locale-aware formatting
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-PK", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedValue);
  };

  // Sync Tailwind class with State
  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
      console.log("Dark mode enabled");
    } else {
      root.classList.remove("dark");
      console.log("Light mode enabled");
    }
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("theme", next);
          return next;
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#6366f1" }, // Indigo color
          ...(mode === "dark"
            ? {
                background: { default: "#0f172a", paper: "#1e293b" },
              }
            : {
                background: { default: "#f8fafc", paper: "#ffffff" },
              }),
        },
      }),
    [mode],
  );

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatValue }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CurrencyContext.Provider>
  );
};
