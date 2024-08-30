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

function AddItems() {
  const [itemData, setItemData] = useState("");
  const [files, setFiles] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const form = useForm({
    defaultValues: {
      picture: "",
      title: "",
      priceInput: { price: "", type: "number" },
      category: "",
      availability: false,
      daterange: {
        from: new Date(),
        to: addDays(new Date(), 20),
      },
    },
  });

  const date = form.watch("daterange");

  const navigate = useNavigate();

  const { id } = useParams();

  const handleFocus = (event) => {
    const value = event.target.value;
    if (!value) return value;
    const formattedValue = value.split(",").join("");
    form.setValue('priceInput.price', formattedValue);
    // setInputType("number");
    form.setValue('priceInput.type', "number");
  };

  const handleBlur = (event, index) => {
    const value = event.target.value;
    if (!value) return value;
    const formattedValue = new Intl.NumberFormat().format(value);
    form.setValue('priceInput.price', formattedValue);
    form.setValue('priceInput.type', "text");
  };

  const onSubmit = async (data) => {
    data.price = form.getValues('priceInput.price')
    delete data.picture;
    if (!data.availability) {
      delete data.daterange;
    }

    try {
      let res;
      if (id) {
        if (!files) {
          data.imgUrl = itemData;
        }
        res = await axios.patch("/api/recipes/" + id, data);
      } else {
        res = await axios.post("/api/recipes/", data);
      }
      console.log(res);
      let formData = new FormData();
      formData.set("photo", files);

      let uploadRes;
      if (files) {
        uploadRes = await axios.post(
          `/api/recipes/${res.data._id}/upload`,
          formData,
          {
            headers: {
              Accept: "multipart/form-data",
            },
          }
        );
      }
      // else {
      //   uploadRes = await axios.post(
      //     `/api/recipes/${res.data._id}/upload`,res.data.photo);
      // }
      // console.log("uploadRes", uploadRes);
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
        if (res.status == 200) {
          setPreview(import.meta.env.VITE_AWS_URL + "/" + res.data.photo);
          setItemData(res.data.photo);
          form.setValue("title", res.data.title);
          form.setValue('priceInput.price', res.data.price);
          form.setValue("category", res.data.category?._id);
          form.setValue("picture", res.data.photo);
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
    let file = e.target.files[0];
    setFiles(file);

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      setPreview(e.target.result);
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 max-w-screen-lg mx-auto mt-3">
      <h1 className="text-xl font-semibold">{id ? "Edit item" : "Add item"}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-white p-5 rounded-lg shadow-sm border border-slate-200"
        >
          <FormField
            control={form.control}
            name="picture"
            rules={{ required: "Photo is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Photo</FormLabel>
                <FormControl>
                  <Input
                    id="picture"
                    type="file"
                    onChange={(e) => {
                      addPhoto(e);
                      field.onChange(e.target.files[0]);
                    }}
                    ref={field.ref}
                    className="w-[40%]"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.picture && (
                    <span>{form.formState.errors.picture.message}</span>
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
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
                    className="w-[40%]"
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
          {/* <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter the amount"
                    className="w-[40%]"
                    {...field}
                    {...form.register("price", {
                      required: "Price is required",
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <Controller
            control={form.control}
            name={`priceInput.price`}
            rules={{
              required: "Price is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                type={form.watch(`priceInput.type`)}
                onFocus={(e) => handleFocus(e)}
                onBlur={(e) => {
                  onBlur();
                  handleBlur(e);
                }}
                onChange={(e) => {
                  onChange(e.target.value);
                  form.setValue(`priceInput.price`, e.target.value);
                }}
                placeholder="Enter the amount"
                className="w-[40%] mt-2"
              />
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
                  <FormControl className="w-[40%]">
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
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-900">
                    Available at specified dates
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          {form.getValues("availability") && (
            <FormField
              control={form.control}
              name="daterange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date - End Date</FormLabel>
                  <FormControl>
                    <div className={cn("grid gap-2")}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "LLL dd, y")} -{" "}
                                  {format(date.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(selectedDate) => {
                              field.onChange(selectedDate);
                            }}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          )}
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
