import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <Drawer variant="permanent">
    <List>
      <ListItem button component={Link} to="/dashboard">
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} to="/accounts">
        <ListItemText primary="Accounts" />
      </ListItem>
      <ListItem button component={Link} to="/transactions">
        <ListItemText primary="Transactions" />
      </ListItem>
      <ListItem button component={Link} to="/budgets">
        <ListItemText primary="Budgets" />
      </ListItem>
    </List>
  </Drawer>
);

export default Sidebar;
