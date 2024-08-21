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
import axios from "../helper/axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/authContext";

function SignInForm() {
  const [error, setError] = useState(null);
  let navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {dispatch} = useContext(AuthContext)
  const onSubmit = async (data) => {
    try {
      setError(null);
      let res = await axios.post(
        "/api/users/login",
        data,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      if (res.status == 200) {
        dispatch({type : 'LOGIN',payload : res.data.user})
        navigate("/");
      }
    } catch (error) {
      console.log("Error submitting the form", error);
      setError(error.response?.data?.error);
    }
  };

  return (
    <div className="space-y-3 max-w-[400px] mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-white p-5 rounded-lg shadow-sm border border-slate-200"
        >
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
                    autoComplete="email"
                    {...field}
                    {...form.register("email", {
                      required: "Email is required",
                    })}
                  />
                </FormControl>
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
                  {!!error && (
                    <span>{error}</span>
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-between">
            <Button className="bg-orange-500 text-white">Login</Button>
            <span className="text-sm text-gray-400">
              Don't have an account?
              <Link to={'/sign-up'} className=" text-orange-400 ml-1">Sign up</Link>
            </span>
          </div>
        </form>
      </Form>
      <DevTool control={form.control} />
    </div>
  );
}

export default SignInForm;
