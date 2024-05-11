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
