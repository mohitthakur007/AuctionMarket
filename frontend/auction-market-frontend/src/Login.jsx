import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Login() {
  return (
    <>
      <Container maxWidth="sm" style={{ paddingTop: 50 }}>
        <Typography variant="h5" component="h2">
          Welcome to Auction Market
        </Typography>
        <br />
        <br />
        <TextField
          type="text"
          id="outlined-basic"
          label="Username"
          variant="outlined"
        />
        <br />
        <br />

        <TextField
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />
        <br />
        <br />

        <Button variant="contained">Login</Button>
        <br />
        <br />
      </Container>
    </>
  );
}

export default Login;
