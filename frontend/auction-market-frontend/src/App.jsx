import "./App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Login from "./Login";


function App() {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Auction Market
          </Typography>
          <Button color="inherit">Login</Button>
          <Button color="inherit">Sign up</Button>
        </Toolbar>
      </AppBar>
      <Login></Login>
    </>
  );
}

export default App;
