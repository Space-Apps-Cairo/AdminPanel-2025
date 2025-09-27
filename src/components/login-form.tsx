"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/service/Api/login";
import { setCredentials } from "@/service/store/features/authSlice";
import { toast } from "sonner";
import { LoginRequest } from "@/types/auth.types";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (values: LoginRequest) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setCredentials({ user: res.user, access_token: res.access_token, role: res.user.role }));
      toast.success("Login Successfully");
      router.push("/");
    } catch (err: any) {
      toast.error("Login failed", { description: err?.message });
      console.error("Login failed", err);
    }
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Welcome back</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </>
  );
}
