"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setToken } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLoginMutation } from "@/service/Api/login";
import { setCredentials } from "@/service/store/features/authSlice";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [login, { data, error, isSuccess, isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (values: any) => {
    try {
      const res = await login(values).unwrap();
      dispatch(
        setCredentials({
          user: res.user,
          access_token: res.access_token,
        })
      );
      router.push("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex w-[700px] h-[400px]">
      {/* Left side - Form */}
      <div className="w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-gray-500 mb-4">Login to your Acme Inc account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Email</label>
            <Input placeholder="m@example.com" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label>Password</label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Login
          </Button>
        </form>
      </div>

      {/* Right side - NASA image */}
      <div className="w-1/2 relative">
        <img
          src="/images/login-photo.jpeg"
          alt="NASA"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
} //cityslicka
