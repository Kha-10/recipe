import { useEffect, useState } from "react";
import axios from "../helper/axios";
import RecipeCard from "../components/RecipeCard";
import Pagination from "@/components/Pagination";
import { useLocation } from "react-router-dom";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const page = parseInt(searchQuery.get("page"))
    ? parseInt(searchQuery.get("page"))
    : 1;

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await axios("/api/recipes?page=" + page);
      setRecipes(response.data.data);
      setPagination(response.data.pagination);
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    };
    fetchRecipes();
  }, [page]);


  return (
    <>
      <div className="max-w-screen-lg mx-auto flex items-center flex-wrap gap-3">
        {!!recipes.length &&
          recipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe._id} />
          ))}
      </div>
      {!!pagination && <Pagination pagination={pagination} page={page || 1} />}
    </>
  );
}

export default Home;
