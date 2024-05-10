import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function AddPost() {
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
        />
        <br />
        <br />

        <TextField
          type="text"
          id="outlined-basic"
          label="Product Description"
          variant="outlined"
          rows = '5'
          multiline	
          fullWidth	
          required
        />
        <br />
        <br />
        <TextField
          type="text"
          id="outlined-basic"
          label="Quantity"
          variant="outlined"
          fullWidth	
          required
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
        />
        <br />
        <br />
        <TextField
          type="text"
          id="outlined-basic"
          label="Minimum Price"
          variant="outlined"
          fullWidth	
          required
        />
        <br />
        <br />
        <Button variant="contained">Add Post</Button>
        <br />
        <br />
      </Container>
    </div>
  );
}
export default AddPost;
