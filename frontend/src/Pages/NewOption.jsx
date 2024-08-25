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
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
      options: [{ name: "", price: "", type: "number" }],
      mode: "onTouched",
      shouldUnregister: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const navigate = useNavigate();

  const { id } = useParams();

  //   const [inputType, setInputType] = useState("number");

  //   const formatNumber = (value) => {
  //     if (!value) return value;
  //     return parseInt(value).toLocaleString();
  //   };

  //   const unformatNumber = (value) => {
  //     if (!value) return value;
  //     return value.split(",").join("");
  //   };

  const handleFocus = (event, index) => {
    const value = event.target.value;
    if (!value) return value;
    const formattedValue = value.split(",").join("");
    form.setValue(`options.${index}.price`, formattedValue);
    // setInputType("number");
    return form.setValue(`options.${index}.type`, "number");
  };

  const handleBlur = (event, index) => {
    const value = event.target.value;
    if (!value) return value;
    console.log(value);
    const formattedValue = new Intl.NumberFormat().format(value);
    form.setValue(`options.${index}.price`, formattedValue);
    form.setValue(`options.${index}.type`, "text");
  };
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

  const options = form.getValues("options");
  const allFilled =
    options[options.length - 1].name && options[options.length - 1].price;

  console.log(form.formState.errors.options);

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
            render={() => {
              return (
                <FormItem>
                  <div className="w-[40%] flex items-center justify-between">
                    <FormLabel>Options</FormLabel>
                    <Button
                      type="button"
                      onClick={() => {
                        allFilled &&
                          append(
                            { name: "", price: "" },
                            { shouldFocus: false }
                          );
                      }}
                      className="w-[100px] bg-transparent px-0 py-0 text-orange-400 text-xs hover:bg-transparent"
                    >
                      Add new opition
                    </Button>
                  </div>
                  <FormControl>
                    <div className="space-y-6 px-4">
                      {fields.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div>
                            <FormLabel>Option name</FormLabel>
                            <Input
                              type="text"
                              placeholder="Enter the option name"
                              className="w-[40%] mt-2"
                              {...form.register(`options.${index}.name`, {
                                required: "Option name is required",
                              })}
                            />
                            {form.formState.errors.options?.[index]?.name && (
                              <p className="text-sm text-red-500 font-medium mt-2">
                                {
                                  form.formState.errors.options[index]?.name
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div>
                            <FormLabel>Additional price</FormLabel>
                            <Controller
                              control={form.control}
                              name={`options.${index}.price`} // Correct path for the specific price field
                              rules={{
                                required: "Price is required", // You can also add a custom error message
                              }}
                              render={({
                                field: { onChange, onBlur, value },
                              }) => (
                                <Input
                                  value={value} // Use the value provided by Controller
                                  type={form.watch(`options.${index}.type`)} // Assuming this is managed elsewhere
                                  onFocus={(e) => handleFocus(e, index)}
                                  onBlur={(e) => {
                                    onBlur(); // Trigger the onBlur event provided by Controller
                                    handleBlur(e, index);
                                  }}
                                  onChange={(e) => {
                                    onChange(e.target.value); // Trigger the onChange event provided by Controller
                                    form.setValue(
                                      `options.${index}.price`,
                                      e.target.value
                                    );
                                  }}
                                  placeholder="Enter the amount"
                                  className="w-[40%] mt-2"
                                />
                              )}
                            />
                            {form.formState.errors.options?.[index]?.price && (
                              <p className="text-sm text-red-500 font-medium mt-2">
                                {
                                  form.formState.errors.options[index].price
                                    .message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {/* {!!optionLists &&
                        optionLists.map((option, i) => (
                          <div key={i} className="space-y-2">
                            <Input
                              type="text"
                              placeholder="Enter the option name"
                              className="w-[40%]"
                              {...form.register(`options.${i}.name`, {
                                required: "Option name is required",
                              })}
                            />
                            {form.formState.errors.options?.[i]?.name && (
                              <div>
                                {form.formState.errors.options[i]?.name.message}
                              </div>
                            )}
                            <Controller
                              name={`options.${i}.price`}
                              control={form.control}
                              rules={{ required: "Price is required" }}
                              render={({ field }) => (
                                <Input
                                  value={field.value}
                                  type={inputType}
                                  onFocus={() => {
                                    setInputType("number");
                                    form.setValue(
                                      "options.0.price",
                                      unformatNumber(field.value)
                                    );
                                  }}
                                  onBlur={() => {
                                    setInputType("text");
                                    form.setValue(
                                      `options.0.price`,
                                      formatNumber(field.value)
                                    );
                                  }}
                                  onChange={(e) => {
                                    field.onChange(e); 
                                  }}
                                  placeholder="Enter the amount"
                                  className="w-[40%]"
                                />
                              )}
                            />

                            {form.formState.errors.options?.[i]?.price && (
                              <div>
                                {
                                  form.formState.errors.options[i]?.price
                                    .message
                                }
                              </div>
                            )}
                          </div>
                        ))} */}
                    </div>
                  </FormControl>
                </FormItem>
              );
            }}
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
