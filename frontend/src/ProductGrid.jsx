import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import GavelIcon from "@mui/icons-material/Gavel";
import { useNavigate } from "react-router-dom";

function ProductGrid(props) {
  const itemData = props.itemData;
  const navigate = useNavigate();
  console.log(itemData);
  return (
    <ImageList cols={5}>
      {itemData.map((item) => (
        <ImageListItem key={item.photoURL}>
          <img
            srcSet={`${item.photoURL}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.photoURL}?w=248&fit=crop&auto=format`}
            alt={item.name}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.name}
            subtitle={"Rs." + item.minPrice}
            actionIcon={
              <IconButton
                onClick={() => navigate("/post/"+item._id)}
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${item.title}`}
              >
                <GavelIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export default ProductGrid;
