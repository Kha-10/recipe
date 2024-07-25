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
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

function SignUpForm() {
  const [errors,setErrors] = useState(null);
  let navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    console.log(data);
    try {
        let res = await axios.post('http://localhost:8000/api/users/register',data,{
            withCredentials : true
        })
        console.log(res);
        if(res.status == 200) {
          navigate('/')
        }
      } catch (error) {
        console.log("Error submitting the form", error);
        setErrors(error.response.data.errors)
      }
  };

  return (
    <div className="space-y-3 max-w-[400px] mx-auto ml-[300px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-white p-5 rounded-lg shadow-sm border border-slate-200"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    autoComplete="username"
                    className="w-full"
                    {...field}
                    {...form.register("username", {
                      required: "Username is required",
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {!!(errors && errors.username) && (
                    <span>{errors.username.msg}</span>
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    className="w-full"
                    {...field}
                    {...form.register("email", {
                      required: "Email is required",
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {!!(errors && errors.email) && (
                    <span>{errors.email.msg}</span>
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="*********"
                    className="w-full"
                    {...field}
                    {...form.register("password", {
                      required: "Password is required",
                    })}
                  />
                </FormControl>
                <FormMessage>
                  {!!(errors && errors.password) && (
                    <span>{errors.password.msg}</span>
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button className="bg-orange-500 text-white">
            Register
          </Button>
        </form>
      </Form>
      <DevTool control={form.control} />
    </div>
  );
}

export default SignUpForm;