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
import axios from "axios";

function AddItems() {
  const [itemData, setItemData] = useState(null);
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
      if(id) {
        res = await axios.patch("http://localhost:8000/api/recipes/"+id,data)
      }else {
        res = await axios.post("http://localhost:8000/api/recipes/",data)
      }
      if(res.status == 200) {
        navigate('/')
      }
    } catch (error) {
      console.log("Error submitting the form", error);
    }
  };

  useEffect(() => {
    const getMenu = async () => {
      if (id) {
        const url = "http://localhost:8000/api/recipes/" + id;
        const res = await axios.get(url);
        console.log(res.data);
        if (res.status == 200) {
          form.setValue('title',res.data.title);
          form.setValue('price',res.data.price);
          form.setValue('category',res.data.category?._id);
        }
      }
    };
    getMenu();
  }, [id]);

  useEffect(() => {
    const getCategories = async () => {
      const url = "http://localhost:8000/api/categories";
      const res = await axios.get(url);
      if (res.status == 200) {
        setCategories(res.data);
      }
    };
    getCategories();
  }, []);

  return (
    <div className="space-y-3 max-w-screen-sm mx-auto ml-[300px]">
      <h1 className="text-xl font-semibold">{id ? 'Edit item' : 'Add item'}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-white p-5 rounded-lg shadow-sm border border-slate-200"
        >
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl className="w-[70%]">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category"/>
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
          <Button className="bg-orange-500 text-white">{id ? "Update" :"Submit"}</Button>
        </form>
      </Form>
      <DevTool control={form.control} />
    </div>
  );
}

export default AddItems;
