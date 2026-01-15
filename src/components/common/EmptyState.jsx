import { Box, Typography, Button } from "@mui/material";
import { PlusIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const EmptyState = ({
  title = "No data found",
  message = "Try adding some transactions to see your analytics.",
  actionLabel = "Add Transaction",
  actionPath = "/transactions",
}) => {
  const navigate = useNavigate();

  return (
    <Box
      className="flex flex-col items-center justify-center p-8 text-center"
      sx={{ minHeight: 300 }}
    >
      {/* Icon with a soft background circle */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
        <ChartBarIcon className="h-8 w-8 text-blue-500" />
      </div>

      <Typography variant="h6" className="text-gray-900 font-semibold">
        {title}
      </Typography>

      <Typography variant="body2" className="text-gray-500 mt-1 max-w-xs">
        {message}
      </Typography>

      {actionLabel && (
        <Button
          variant="contained"
          startIcon={<PlusIcon className="h-5 w-5" />}
          sx={{ mt: 3, textTransform: "none", borderRadius: 2 }}
          onClick={() => navigate(actionPath)}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
