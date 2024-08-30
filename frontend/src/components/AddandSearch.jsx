import React, { useState,useEffect} from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Search, CircleX } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import axios from "axios";

const AddandSearch = ({setRecipes,setMenus}) => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search,1000)
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
          const res = await axios.get(`/api/optionGroups?query=${debouncedValue}`);
          if (res.status === 200) {
            setRecipes(res.data)
            setMenus(res.data);
          }
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      };
      fetchData()
  }, [debouncedValue]);

  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        onClick={() => navigate("/menus/optionGroups/addOptions")}
        className="text-white max-w-fit bg-orange-400 text-xs flex items-center justify-center gap-2 rounded hover:bg-orange-400 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <p>Add new option group</p>
      </Button>
      <div className="relative w-[30%]">
        {search ? (
          <CircleX
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={14}
            color="gray"
            onClick={()=>setSearch('')}
          />
        ) : (
          <Search
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={14}
          />
        )}
        <Input
          placeholder="Search by group option name"
          className="h-11 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default AddandSearch;
