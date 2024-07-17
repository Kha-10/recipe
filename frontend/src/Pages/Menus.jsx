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
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  const openDialog = () => setIsOpened(true);
  const closeDialog = () => setIsOpened(false);

  const getCategories = async () => {
    const url = "http://localhost:8000/api/categories";
    const res = await axios.get(url);
    if (res.status == 200) {
      setCategories(res.data);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);


  useEffect(() => {
    const getRecipes = async () => {
      const url = "http://localhost:8000/api/recipes";
      const res = await axios.get(url);
      if (res.status == 200) {
        setRecipes(res.data);
      }
    };
    getRecipes();
  }, []);

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

  const getQuantity = (title, recipes) => {
    return recipes.filter((item) => item.category == title).length;
  };

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
          <div className="bg-white max-h-[88%] divide-y example divide-slate-100 overflow-y-auto">
            {!!categories.length &&
              categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 text-sm hover:bg-slate-50 rounded"
                >
                  <p>{category.title}</p>
                  <p>{getQuantity(category.title, recipes)}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="w-full rounded-xl space-y-3">
          {categories.map((category) => (
            <div key={category._id} className="w-full bg-slate-50 rounded-t-lg shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <p className="text-lg">{category.title}</p>
                <Link
                  to={"/menus/addItems"}
                  className="text-white w-[100px] p-2 bg-orange-400 text-xs flex items-center justify-center gap-2 rounded"
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
                  Add item
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
