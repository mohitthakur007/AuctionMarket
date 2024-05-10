import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <Container maxWidth="xs" style={{ paddingTop: 50 }}>
      <Typography variant="h5" component="h2">
          Welcome back to Auction Market
        </Typography>
        <br />
        <br />
      <Card variant={"outlined"} style={{width: 400, padding: 20}}>
        <TextField
          type="text"
          id="outlined-basic"
          label="Username"
          variant="outlined"
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />
        <br />
        <br />

        <TextField
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <br />
        <br />

        <Button sx={{ backgroundColor: "black" }}
          variant="contained"
          onClick={() => {
            fetch("http://localhost:3000/ulog-in", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {

                console.log(data);
                const token = data.token;
                if (token) {
                  console.log("token found ")

                  window.localStorage.setItem("matoken", token);
                  navigate("/posts");
                }
              })
              .catch((error) => {
                console.log("error found")

                console.error("Error:", error);
              });
          }}
        >Login</Button>
        <br />
        <br />
        </Card>
      </Container>
    </>
  );
}

export default Login;
