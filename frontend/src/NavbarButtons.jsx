import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@mui/material";

function NavbarButtons() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  useEffect(() => {
    console.log("navbarr buttonssss!!!!");
    fetch("http://localhost:3000/ume", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("matoken"),
      },
    })
      .then((response) => {
        if (!response) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUsername(data.username);
      });
  }, []);
  if (username) {
    return (
      <>
        <Chip label={username} sx={{ color: "white" }} variant="outlined" />
        <Button
          color="inherit"
          onClick={() => {
            localStorage.setItem("matoken", null);
            window.location = "/";
          }}
        >
          logout
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Button color="inherit" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button color="inherit" onClick={() => navigate("/signup")}>
          Sign up
        </Button>
      </>
    );
  }
}
export default NavbarButtons;
