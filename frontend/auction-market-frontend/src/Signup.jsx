import "./App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import { Card } from "@mui/material";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = (path) => {
    window.location.href = path; // Use window.location.href for navigation
  };
  return (
    <>
      <Container maxWidth="xs" style={{ paddingTop: 50 }}>
        <Typography variant="h5" component="h2">
          Welcome to Auction Market
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
          required
          fullWidth
        />
        <br />
        <br />

        <TextField
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        <br />
        <br />

        <Button
          variant="contained"
          onClick={() => {
            fetch("http://localhost:3000/usign-up", {
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
                  window.localStorage.setItem("matoken", token);
                  navigateTo("/posts");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }}
        >
          Signup
        </Button>
        </Card>
        <br />
        <br />
      </Container>
    </>
  );
}

export default Signup;
