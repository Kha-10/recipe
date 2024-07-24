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

function SignUpForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    console.log(data);
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
                    className="w-full"
                    {...field}
                    {...form.register("username", {
                      required: "Username is required",
                    })}
                  />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
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
                    placeholder="*********"
                    className="w-full"
                    {...field}
                    {...form.register("password", {
                      required: "Password is required",
                    })}
                  />
                </FormControl>
                <FormMessage />
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