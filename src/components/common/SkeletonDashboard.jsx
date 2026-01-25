import { Box, Grid, Card, Skeleton, Container } from "@mui/material";

const SkeletonDashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Top Summary Stats (4 Small Cards) */}
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ p: 2, borderRadius: 5 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="40%" height={20} />
            </Card>
          </Grid>
        ))}

        {/* Large Chart Area (Balance Trend) */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 5, height: 400 }}>
            <Box mb={2}>
              <Skeleton variant="text" width="30%" height={30} />
              <Skeleton variant="text" width="50%" height={20} />
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ borderRadius: 3 }}
            />
          </Card>
        </Grid>

        {/* Side Chart (Expense Pie) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 5, height: 400 }}>
            <Skeleton variant="text" width="50%" height={30} />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Skeleton variant="circular" width={220} height={220} />
            </Box>
          </Card>
        </Grid>

        {/* Recent Transactions Table */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 5 }}>
            <Skeleton variant="text" width="20%" height={35} sx={{ mb: 2 }} />
            {[1, 2, 3, 4, 5].map((row) => (
              <Box key={row} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SkeletonDashboard;
