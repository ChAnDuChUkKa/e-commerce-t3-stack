"use client"; // This is a client component
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ObjectSchema } from "yup";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"

export type Login = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // const userId = Cookies.get("userId");
  // if (userId) {
  //   router.push("/categories");
  // }

  const toggleShow = () => {
    setShowPassword((password) => !password);
  };

  const LoginFormSchema: ObjectSchema<Login> = yup.object({
    email: yup.string().required("*Required"),
    password: yup.string().required("*Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Login>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LoginFormSchema),
  });

  const loginUser = api.user.loginUser.useMutation();

  useEffect(() => {
    if(loginUser.isSuccess) {
      Cookies.set("userId",loginUser.data.id.toString())
      router.push("/categories");
    }
  }, [loginUser, router])
  
  const submitLoginForm = async() => {
    loginUser.mutate({
      email: getValues("email"),
      password: getValues("password"),
    });

    // if (loginUser.isSuccess && loginUser.data) {
      
    // }
  };

  return (
    <form
      className="form-container mx-auto my-4 flex flex-col gap-4 bg-white px-10 py-4"
      onSubmit={handleSubmit(submitLoginForm)}
    >
      <h1 className="text-center text-xl font-bold">Login</h1>
      <div className="flex flex-col text-center">
        <h2 className="text-center text-lg font-semibold">
          Welcome back to ECOMMERCE
        </h2>
        <p>The next gen business marketplace</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <div className="login-password flex flex-row justify-between">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-100 login-password-input border-none"
          />
          <button type="button" className="px-3" onClick={() => toggleShow()}>
            {showPassword ? "Close" : "Show"}
          </button>
        </div>
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit" className="submit-button px-auto py-4">
        LOGIN
      </button>
      <p className="mb-10 text-center text-slate-500">
        Don’t have an Account?{" "}
        <Link href="/signup">
          {" "}
          <span className="cursor-pointer text-slate-900">SIGNUP</span>
        </Link>
      </p>
    </form>
  );
};

export default Login;
