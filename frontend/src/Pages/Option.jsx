import { useState, useEffect } from "react";
import axios from "../helper/axios";
import OptionGroups from "@/components/OptionGroups";
import AllItems from "@/components/AllItems";
import Options from "@/components/Options";

function Option() {
  const [recipes, setRecipes] = useState([]);
  const [menus, setMenus] = useState([]);

  const getRecipes = async () => {
    try {
      let url = "/api/optionGroups";

      const res = await axios.get(url);
      if (res.status === 200) {
        console.log(res.data);
        setRecipes(res.data)
        setMenus(res.data);
        // setRecipes(res.data.data);
        // setMenus(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  let getMenusBycategory = async (id) => {
    try {
      let url = "/api/recipes/" + id;
      const res = await axios(url);

      if (res.status === 200) {
        setMenus(res.data);
      } else {
        console.error("Failed to fetch recipes");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const res = await axios.delete("/api/recipes/" + id);
      if (res.status == 200) {
        setMenus((prev) => prev.filter((p) => p._id !== id));
        setRecipes((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting the form", error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto overflow-hidden">
      <div className="flex gap-6">
        <OptionGroups recipes={recipes} getMenusBycategory={getMenusBycategory} />
        <Options menus={menus} deleteHandler={deleteHandler} />
      </div>
    </div>
  );
}

export default Option;
