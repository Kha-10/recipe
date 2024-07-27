import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { DevTool } from "@hookform/devtools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"
import axios from "../helper/axios";

function AddItems() {
  const [itemData, setItemData] = useState(null);
  const [files,setFiles] = useState(null)
  const [preview,setPreview] = useState(null)
  const [categories, setCategories] = useState([]);
  const form = useForm({
    defaultValues: {
      title: "",
      price: 0,
      category: "",
    },
  });
  const navigate = useNavigate();

  const { id } = useParams();

  const onSubmit = async (data) => {
    try {
      let res;
      if (id) {
        res = await axios.patch("/api/recipes/" + id, data);
      } else {
        res = await axios.post("/api/recipes/", data);
      }
      let formData = new FormData;
      formData.set('photo',files)
      let uploadRes = await axios.post(`/api/recipes/${res.data._id}/upload`,
      formData,{
        headers :{
          Accept : 'multipart/form-data'
        }
      })
      console.log(uploadRes);

      if (res.status == 200) {
        navigate("/");
      }
    } catch (error) {
      console.log("Error submitting the form", error);
    }
  };

  useEffect(() => {
    const getMenu = async () => {
      if (id) {
        const url = "/api/recipes/" + id;
        const res = await axios(url);
        console.log(res.data);
        if (res.status == 200) {
          setPreview(import.meta.env.VITE_URL+res.data.photo)
          form.setValue("title", res.data.title);
          form.setValue("price", res.data.price);
          form.setValue("category", res.data.category?._id);
        }
      }
    };
    getMenu();
  }, [id]);

  useEffect(() => {
    const getCategories = async () => {
      const url = "/api/categories";
      const res = await axios.get(url);
      if (res.status == 200) {
        setCategories(res.data);
      }
    };
    getCategories();
  }, []);

  const addPhoto = (e) => {
    let file = e.target.files[0]
    setFiles(file)

    let fileReader = new FileReader;
    fileReader.onload = (e) => {
      setPreview(e.target.result);
    }
    fileReader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3 max-w-screen-sm mx-auto">
      <h1 className="text-xl font-semibold">{id ? "Edit item" : "Add item"}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-white p-5 rounded-lg shadow-sm border border-slate-200"
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Add photo</Label>
            <Input id="picture" type="file" onChange={addPhoto}/>
          </div>
          {preview && <img className="max-w-[30%]" src={preview} alt="" />}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the name of this item"
                    className="w-[70%]"
                    {...field}
                    {...form.register("title", {
                      required: "Item name is required",
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter the amount"
                    className="w-[70%]"
                    {...field}
                    {...form.register("price", {
                      required: "Price is required",
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="w-[70%]">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!!categories.length &&
                      categories.map((category) => (
                        <div key={category._id}>
                          <SelectItem value={category._id}>
                            {category.title}
                          </SelectItem>
                        </div>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage>
                  {form.formState.errors.category && (
                    <span>{form.formState.errors.category.message}</span>
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button className="bg-orange-500 text-white">
            {id ? "Update" : "Submit"}
          </Button>
        </form>
      </Form>
      <DevTool control={form.control} />
    </div>
  );
}

export default AddItems;
