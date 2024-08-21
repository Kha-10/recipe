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
import { useForm, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "../helper/axios";

const NewOption = () => {
  const [itemData, setItemData] = useState("");
  const [files, setFiles] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const form = useForm({
    defaultValues: {
      title: "",
      options: [{ name: "", price: 0 }],
    },
  });

  const [optionLists, setOptionLists] = useState([{ name: "", price: 0 }]);

  const navigate = useNavigate();

  const { id } = useParams();

  const addNewInput = () => {
    setOptionLists([...optionLists, { name: "", price: 0 }]);
  };
  console.log(optionLists);

  const onSubmit = async (data) => {
    console.log(data);
  };

  useEffect(() => {
    const getMenu = async () => {
      if (id) {
        const url = "/api/recipes/" + id;
        const res = await axios(url);
        if (res.status == 200) {
          setPreview(import.meta.env.VITE_AWS_URL + "/" + res.data.photo);
          setItemData(res.data.photo);
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

  return (
    <div className="space-y-3 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-semibold">
        {id ? "Edit option group" : "Add option group"}
      </h1>
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
                <FormLabel>Option group name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the name of this item"
                    className="w-[40%]"
                    {...field}
                    {...form.register("title", {
                      required: "Option group name is required",
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="options"
            render={() => (
              <FormItem>
                <div className="w-[40%] flex items-center justify-between">
                  <FormLabel>Options</FormLabel>
                  <Button
                    onClick={addNewInput}
                    className="w-[100px] bg-transparent px-0 py-0 text-orange-400 text-xs hover:bg-transparent"
                  >
                    Add new opition
                  </Button>
                </div>
                <FormControl>
                  <div className=" space-y-8">
                    {!!optionLists &&
                      optionLists.map((option, i) => (
                        <div key={i} className="space-y-2">
                          <Input
                            rules={{ required: "Option name is required" }}
                            type="text"
                            placeholder="Enter the option name"
                            className="w-[40%]"
                            {...form.register(`options.${i}.name`, {
                              required: "Option name is required",
                            })}
                          />
                          {form.formState.errors.options?.[i]?.name && (
                            <div>{form.formState.errors.options[i]?.name.message}</div>
                          )}
                          {/* <FormMessage>
                            {form.formState.errors.options?.[i]?.name && (
                              <span className="text-red-500">
                                {form.formState.errors.options[i].name.message}
                              </span>
                            )}
                          </FormMessage> */}
                          <Input
                            rules={{ required: "Price name is required" }}
                            type="number"
                            placeholder="Enter the amount"
                            className="w-[40%]"
                            {...form.register(`options.${i}.price`, {
                              required: "Price is required",
                            })}
                          />
                          {/* <FormMessage>
                            {form.formState.errors.options?.[i]?.price && (
                              <span className="text-red-500">
                                {form.formState.errors.options[i].price.message}
                              </span>
                            )}
                          </FormMessage> */}
                          {form.formState.errors.options?.[i]?.price && (
                            <div>{form.formState.errors.options[i]?.price.message}</div>
                          )}
                        </div>
                      ))}
                  </div>
                </FormControl>
                {/* <FormMessage /> */}
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
};

export default NewOption;
