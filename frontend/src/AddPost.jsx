import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";

function AddPost() {
  const r = {
    name: "Sample Product",
    desc: "This is a sample product description.",
    qty: 10,
    unit: "pcs",
    photoURL: "https://example.com/sample-product.jpg",
    minPrice: 50,
  };
  const [request, setRequest] = useState({});

  return (
    <div>
      <Container maxWidth="sm" style={{ paddingTop: 50 }}>
        <Typography variant="h5" component="h2">
          Add a product for Auction
        </Typography>
        <br />
        <br />
        <TextField
          type="text"
          id="outlined-basic"
          label="Product Name"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => {
            request.name = e.target.value;
            setRequest(request);
          }}
        />
        <br />
        <br />

        <TextField
          type="text"
          id="outlined-basic"
          label="Product Description"
          variant="outlined"
          rows="5"
          multiline
          fullWidth
          required
          onChange={(e) => {
            request.desc = e.target.value;
            setRequest(request);
          }}
        />
        <br />
        <br />
        <TextField
          type="number"
          id="outlined-basic"
          label="Quantity"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => {
            request.qty = e.target.value;
            setRequest(request);
          }}
        />
        <br />
        <br />
        <TextField
          type="text"
          id="outlined-basic"
          label="Unit"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => {
            request.unit = e.target.value;
            setRequest(request);
          }}
        />
        <br />
        <br />
        <TextField
          type="text"
          id="outlined-basic"
          label="Photo URL"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => {
            request.photoURL = e.target.value;
            setRequest(request);
          }}
        />
        <br />
        <br />
        <TextField
          type="number"
          id="outlined-basic"
          label="Minimum Price"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => {
            request.minPrice = e.target.value;
            setRequest(request);
          }}
        />
        <br />
        <br />
        <Button
          variant="contained"
          onClick={() => {
            fetch("http://localhost:3000/post/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  "Bearer " + window.localStorage.getItem("matoken"),
              },
              body: JSON.stringify(request),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {
                window.location = "/posts";
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }}
        >
          Add Post
        </Button>
        <br />
        <br />
      </Container>
    </div>
  );
}
export default AddPost;
