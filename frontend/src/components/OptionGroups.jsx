import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "../helper/axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const OptionGroups = ({ recipes, getMenusBycategory, deleteHandler }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const navigate = useNavigate();

  const closeDialog = () => setIsOpened(false);

  const getCategories = async (id) => {
    try {
      let res;
      if (id) {
        setCategoryId(id);
        res = await axios("/api/optionGroups/" + id);
        if (res.status == 200) {
          form.setValue("title", res.data.title);
        }
      } else {
        res = await axios("/api/optionGroups/");
        if (res.status == 200) {
          setCategories(res.data);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      let res;
      if (categoryId) {
        res = await axios.patch("/api/categories/" + categoryId, data);
      } else {
        res = await axios.post("/api/categories", data);
      }
      if (res.status === 200) {
        closeDialog();
        form.setValue("title", "");
        getCategories();
      }
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  const getSingleCategory = (id) => {
    setCategoryId(id);
    getMenusBycategory(id);
  };

  return (
    <div className="w-[30%] flex flex-col shadow-sm border border-slate-200 rounded-t-lg h-fit">
      <div className="w-full bg-white border-b border-slate-200 rounded-t-lg h-fit text-sm p-3 flex items-center justify-between">
        <p className="w-full">Option Groups</p>
        {/* <Link
          to={"/menus/optionGroups/addOptions"}
          className="text-white w-[140px] h-[30px] py-1 px-2 bg-orange-400 text-xs flex items-center justify-center gap-2 rounded hover:bg-orange-400 hover:text-white"
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
          <p>Add</p>
        </Link> */}
      </div>
      <div className="bg-white max-h-[635px] divide-y example divide-slate-100 overflow-auto">
        {recipes.length > 0 &&
          recipes.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => getSingleCategory(recipe._id)}
              className={`w-full ${
                categoryId == recipe._id ? "bg-orange-50" : "bg-transparent"
              } flex items-center justify-between p-3 text-sm hover:bg-orange-50 rounded`}
            >
              <p>{recipe.title}</p>
              <div className="flex items-center gap-2">
                <p>{recipe.options.length}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4 rotate-90"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => {
                        navigate(
                          `/menus/optionGroups/editOptions/${recipe._id}`
                        );
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteHandler(recipe._id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OptionGroups;
