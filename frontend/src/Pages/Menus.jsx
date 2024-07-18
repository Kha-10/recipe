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
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Menus() {
  const [isOpened, setIsOpened] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [menus, setMenus] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState(null);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const closeDialog = () => setIsOpened(false);

  const getCategories = async () => {
    const url = "http://localhost:8000/api/categories";
    const res = await axios.get(url);
    if (res.status == 200) {
      setCategories(res.data);
    }
  };

  const getRecipes = async () => {
    try {
      let url = "http://localhost:8000/api/recipes";
      // if (id) {
      //   url += `/${id}`;
      // }

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
    console.log('gg');
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

  // console.log(recipes);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/api/categories", {
        title: data.title,
      });
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
    setCategoryTitle(id);
    getMenusBycategory(id);
  };
  console.log(menus);

  return (
    <div className="max-w-screen-lg mx-auto ml-[300px]">
      <div className="flex gap-6">
        <div className="w-[30%] flex flex-col">
          <div className="bg-white border-b border-slate-200 rounded-t-lg h-fit text-sm p-3 flex items-center justify-between">
            <Dialog open={isOpened} onOpenChange={setIsOpened}>
              <DialogTrigger asChild>
                <div className="w-full flex items-center justify-between">
                  <p>Categories</p>
                  <Button
                    variant="outline"
                    className="text-orange-400 w-fit h-fit py-1 px-2 bg-transparent text-xs flex items-center justify-center gap-2 rounded hover:bg-orange-400 hover:text-white"
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
                    Add
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
                      Submit
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="bg-white max-h-[635px] divide-y example divide-slate-100 overflow-auto">
            {!!categories.length &&
              categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => getSingleCategory(category._id)}
                  className="w-full flex items-center justify-between p-3 text-sm hover:bg-slate-50 rounded"
                >
                  <p>{category.title}</p>
                  <p>{getQuantity(category._id, recipes)}</p>
                </button>
              ))}
          </div>
        </div>
        <div className="w-full rounded-xl space-y-2 max-h-[686px] overflow-y-auto example">
          {menus.map((menu) => (
            <div
              key={menu._id}
              className="w-full bg-slate-50 rounded-t-lg shadow-sm border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-base">{menu.title}</p>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menus;