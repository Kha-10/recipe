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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      type: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
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
    form.setValue(`options.${index}.type`, "number");
  };

  const handleBlur = (event, index) => {
    const value = event.target.value;
    if (!value) return value;
    const formattedValue = new Intl.NumberFormat().format(value);
    form.setValue(`options.${index}.price`, formattedValue);
    form.setValue(`options.${index}.type`, "text");
  };
  const onSubmit = async (data) => {
    const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    let res;
    if (id) {
      res = await axios.patch("/api/optionGroups/" + id, filteredData);
    } else {
      res = await axios.post("/api/optionGroups/", filteredData);
    }
    if (res.status == 200) {
      navigate("/menus/optionGroups");
    }
  };

  useEffect(() => {
    const getMenu = async () => {
      try {
        const url = `/api/optionGroups/${id}`;
        const res = await axios.get(url);

        if (res.status === 200 && res.data) {
          const {
            title,
            options = [],
            type,
            fixedOptionValue,
            exactly,
            between,
          } = res.data;

          form.setValue("title", title);
          replace(options);

          if (type) form.setValue("type", type);
          if (fixedOptionValue)
            form.setValue("fixedOptionValue", fixedOptionValue);
          if (exactly !== undefined) form.setValue("exactly", exactly);
          if (between !== undefined) form.setValue("between", between);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
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
    options.length > 0 &&
    options[options.length - 1].name &&
    options[options.length - 1].price;

  const fixedOptionRange = ["Exactly", "Between"];

  useEffect(() => {
    if (form.getValues("fixedOptionValue") == "Between") {
      form.setValue("between", options.length);
    }
  }, [form.watch("fixedOptionValue")]);

  useEffect(() => {
    if (form.getValues("type") == "rule1") {
      if (!form.getValues("fixedOptionValue")) {
        form.setValue("fixedOptionValue", "Exactly");
        form.setValue("exactly", 1);
        form.setValue("between", null);
        form.setValue("upto", null);
      } else if (form.getValues("fixedOptionValue") == "Exactly") {
        form.setValue("between", null);
      } else if (form.getValues("fixedOptionValue") == "Between") {
        form.setValue("between", options.length);
        form.setValue("upto", null);
      }
    }
    if (form.getValues("type") == "rule2") {
      form.setValue("upto", form.getValues("options").length);
      form.setValue("fixedOptionValue", null);
      form.setValue("exactly", null);
      form.setValue("between", null);
    }
  }, [
    form.watch("type"),
    form.watch("options"),
    form.watch("fixedOptionValue"),
  ]);

  return (
    <div className="space-y-3 max-w-screen-lg mx-auto mt-3">
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
                        // allFilled &&
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
                    <div className="space-y-6 px-2">
                      {fields.length > 0 &&
                        fields.map((item, index) => (
                          <div key={item.id} className="space-y-2">
                            <div>
                              <div className="w-[40%] flex items-center justify-between">
                                <FormLabel>Option name</FormLabel>
                                {options.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      remove(index)
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="red"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="white"
                                      className="size-5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
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
                                name={`options.${index}.price`}
                                rules={{
                                  required: "Price is required",
                                }}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
                                  <Input
                                    value={value}
                                    type={form.watch(`options.${index}.type`)}
                                    onFocus={(e) => handleFocus(e, index)}
                                    onBlur={(e) => {
                                      onBlur();
                                      handleBlur(e, index);
                                    }}
                                    onChange={(e) => {
                                      onChange(e.target.value);
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
                              {form.formState.errors.options?.[index]
                                ?.price && (
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
                    </div>
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Selection rules</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="rule1" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Your customer select
                      </FormLabel>
                    </FormItem>
                    {form.watch("type") == "rule1" && (
                      <div className="flex items-center gap-3">
                        <FormField
                          control={form.control}
                          name="fixedOptionValue"
                          rules={{ required: "fixedOptionValue is required" }}
                          render={({ field }) => (
                            <FormItem className="w-[20%]">
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl className="w-[100%]">
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={fixedOptionRange[0]}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {!!fixedOptionRange.length &&
                                    fixedOptionRange.map((opt, i) => (
                                      <div key={i}>
                                        <SelectItem value={opt}>
                                          {opt}
                                        </SelectItem>
                                      </div>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage>
                                {form.formState.errors.category && (
                                  <span>
                                    {form.formState.errors.category.message}
                                  </span>
                                )}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="exactly"
                          render={({ field }) => (
                            <FormItem className="w-[8%]">
                              <FormControl>
                                <Input
                                  type="number"
                                  value={field.value}
                                  className="w-[100%]"
                                  {...field}
                                  {...form.register("exactly", {
                                    required: "Option group name is required",
                                  })}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {form.getValues("fixedOptionValue") == "Between" && (
                          <FormField
                            control={form.control}
                            name="between"
                            render={({ field }) => (
                              <FormItem className="w-[8%]">
                                <FormControl>
                                  <Input
                                    type="number"
                                    value={options.length}
                                    placeholder={options.length}
                                    className="w-[100%]"
                                    {...field}
                                    {...form.register("between", {
                                      required: "You must set at least one",
                                    })}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="rule2" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Optional for your customer to select
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("type") == "rule2" && (
            <FormField
              control={form.control}
              name="upto"
              render={({ field }) => (
                <FormItem className="w-[8%]">
                  <FormLabel className="font-normal">Up to</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      placeholder={field.value}
                      className="w-[100%]"
                      {...field}
                      {...form.register("upto", {
                        required: "Option group name is required",
                      })}
                    />
                  </FormControl>
                  <FormMessage />
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
};

export default NewOption;
