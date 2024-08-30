import { useState, useEffect } from "react";
import axios from "../helper/axios";
import OptionGroups from "@/components/OptionGroups";
import Options from "@/components/Options";
import AddandSearch from "@/components/AddandSearch";

function Option() {
  const [recipes, setRecipes] = useState([]);
  const [menus, setMenus] = useState([]);

  const getRecipes = async () => {
    try {
      let url = "/api/optionGroups";

      const res = await axios.get(url);
      if (res.status === 200) {
        setRecipes(res.data)
        setMenus(res.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  let getMenusBycategory = async (id) => {
    try {
      let url = "/api/optionGroups/" + id;
      const res = await axios(url);
      console.log(res.data.options);
      if (res.status === 200) {
        setMenus(res.data.options);
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
      const res = await axios.delete("/api/optionGroups/" + id);
      if (res.status == 200) {
        setMenus((prev) => prev.filter(p => p._id !== id));
        setRecipes((prev) => prev.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting the form", error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto overflow-hidden mt-3 space-y-3">
      <AddandSearch setRecipes={setRecipes} setMenus={setMenus}/>
      <div className="flex gap-6">
        <OptionGroups recipes={recipes} deleteHandler={deleteHandler} getMenusBycategory={getMenusBycategory} />
        <Options menus={menus} deleteHandler={deleteHandler} />
      </div>
    </div>
  );
}

export default Option;
