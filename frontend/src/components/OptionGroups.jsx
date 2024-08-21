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

const OptionGroups = ({recipes,getMenusBycategory}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const closeDialog = () => setIsOpened(false);

  const getCategories = async (id) => {
    try {
      let res;
      if (id) {
        setCategoryId(id);
        res = await axios("/api/categories/" + id);
        if (res.status == 200) {
          form.setValue("title", res.data.title);
        }
      } else {
        res = await axios("/api/categories/");
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

  const getQuantity = (id, recipes) => {
    return recipes.filter((item) => item.category?._id == id).length;
  };

  const getSingleCategory = (id) => {
    setCategoryId(id);
    getMenusBycategory(id);
  };

  const deleteCategoryHandler = async (id) => {
    try {
      const res = await axios.delete("/api/categories/" + id);
      if (res.status == 200) {
        setCategories((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting the form", error);
    }
  };

  return (
    <div className="w-[30%] flex flex-col shadow-sm border border-slate-200 h-fit">
      <div className="w-full bg-white border-b border-slate-200 rounded-t-lg h-fit text-sm p-3 flex items-center justify-between">
        <p className="w-full">Option Groups</p>
        <Dialog open={isOpened} onOpenChange={setIsOpened}>
          <DialogTrigger asChild>
            <div className="w-full flex items-center justify-end">
              <Button
                variant="outline"
                className="text-orange-400 w-[80px] h-[30px] py-1 px-2 bg-transparent text-xs flex items-center justify-center gap-2 rounded hover:bg-orange-400 hover:text-white"
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
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new category</DialogTitle>
            </DialogHeader>
            <DialogDescription>Add a new category here.</DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="eg. Noodle,Mala,Soda"
                          {...field}
                          {...form.register("title", {
                            required: "Category name is required",
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-orange-400 hover:bg-orange-400"
                >
                  {categoryId ? "Update" : "Submit"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white max-h-[635px] divide-y example divide-slate-100 overflow-auto">
        {!!categories.length &&
          categories.map((category) => (
            <div
              key={category._id}
              onClick={() => getSingleCategory(category._id)}
              className={`w-full ${
                categoryId == category._id ? "bg-orange-50" : "bg-transparent"
              } flex items-center justify-between p-3 text-sm hover:bg-orange-50 rounded`}
            >
              <p>{category.title}</p>
              <div className="flex items-center gap-2">
                <p>{getQuantity(category._id, recipes)}</p>
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
                        setIsOpened(true);
                        getCategories(category._id);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteCategoryHandler(category._id)}
                    >
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