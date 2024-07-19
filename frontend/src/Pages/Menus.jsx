import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
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

function Menus() {
  const [isOpened, setIsOpened] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [menus, setMenus] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

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
        res = await axios.get("http://localhost:8000/api/categories/" + id);
        if (res.status == 200) {
          form.setValue("title", res.data.title);
        }
      } else {
        res = await axios.get("http://localhost:8000/api/categories/");
        if (res.status == 200) {
          setCategories(res.data);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getRecipes = async () => {
    try {
      let url = "http://localhost:8000/api/recipes";

      const res = await axios.get(url);

      if (res.status === 200) {
        setRecipes(res.data);
        setMenus(res.data);
      } else {
        console.error("Failed to fetch recipes");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const getMenusBycategory = async (id) => {
    try {
      let url = "http://localhost:8000/api/recipes/" + id;
      const res = await axios.get(url);

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
    getCategories();
    getRecipes();
  }, []);

  const onSubmit = async (data) => {
    try {
      let res;
      if (categoryId) {
        res = await axios.patch(
          "http://localhost:8000/api/categories/" + categoryId,
          data
        );
      } else {
        res = await axios.post("http://localhost:8000/api/categories", data);
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

  const deleteHandler = async (id) => {
    try {
      const res = await axios.delete("http://localhost:8000/api/recipes/" + id);
      if (res.status == 200) {
        setMenus((prev) => prev.filter((p) => p._id !== id));
        setRecipes((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting the form", error);
    }
  };

  const deleteCategoryHandler = async (id) => {
    try {
      const res = await axios.delete("http://localhost:8000/api/categories/" + id);
      if (res.status == 200) {
        setCategories((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting the form", error);
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto ml-[300px] overflow-hidden">
      <div className="flex gap-6">
        <div className="w-[30%] flex flex-col shadow-sm border border-slate-200">
          <div className="w-full bg-white border-b border-slate-200 rounded-t-lg h-fit text-sm p-3 flex items-center justify-between">
            <p>Categories</p>
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
                    categoryId == category._id
                      ? "bg-orange-50"
                      : "bg-transparent"
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
                        <DropdownMenuItem onClick={() => deleteCategoryHandler(category._id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="w-full h-full shadow-sm border border-slate-200">
          <div className="w-full flex items-center justify-between p-4 bg-white border-b border-slate-200 rounded-t-lg">
            <p>Items</p>
            <Link
              to={"/menus/addItems"}
              className="text-white w-[100px] h-[30px] py-1 px-2 bg-orange-400 text-xs flex items-center justify-center gap-2 rounded hover:bg-orange-400 hover:text-white"
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
              <p>Add item</p>
            </Link>
          </div>
          <div className="w-full max-h-[624px] overflow-y-auto divide-y example">
            {menus.map((menu) => (
              <div key={menu._id} className="w-full bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-base">{menu.title}</p>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/menus/editItems/${menu._id}`}
                      className="w-fit text-center p-1 bg-transparent border border-slate-300 text-orange-400 text-xs rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </Link>
                    <button
                      className="w-fit text-center p-1 bg-red-500 text-white border border-slate-300 text-xs rounded"
                      onClick={() => deleteHandler(menu._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menus;
