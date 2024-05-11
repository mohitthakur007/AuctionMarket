import "./App.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Card } from "@mui/material";
import ProductGrid from "./ProductGrid";

function CreateButton() {
  const navigate = useNavigate();
  return (
    <Button variant="contained" onClick={() => navigate("/post/add")}>
      <AddIcon></AddIcon>
    </Button>
  );
}
const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Autographed Cricket Bat",
    author: "Rs. 510",
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Product2",
    author: "Rs. 617",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "Rs. 567",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee Mug",
    author: "Rs. 500",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "Rs. 550",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey Jar",
    author: "Rs. 4000",
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Autographed Basketball by MJ",
    author: "Rs. 8000",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "@silverdalex",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "@shelleypauls",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "@peterlaster",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "@southside_customs",
    cols: 2,
  },
];

function Posts() {
  const [posts, setPosts] = useState([]);

  const fetchData = () => {
    fetch("http://localhost:3000/post/get", {
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
        console.log("inside fetch");
        console.log(data);
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (posts.length === 0) {
    return (
      <>
        <Card
          variant={"outlined"}
          style={{ width: 700, padding: 20, alignContent: "end" }}
        >
          <CreateButton />
        </Card>
        No posts yet!!!!! Create a post
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Card variant="elevation" style={{ width: 70, padding: 20 }}>
          <CreateButton />
        </Card>
      </div>

      <ProductGrid itemData={posts}></ProductGrid>
    </>
  );
}

export default Posts;
