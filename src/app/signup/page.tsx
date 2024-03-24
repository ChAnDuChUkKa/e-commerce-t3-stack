"use client";

import { api } from "@/trpc/react";
import { type FormEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import OTPInput from "../_components/otp";

export type SignUpForm = {
  name: string;
  emailId: string;
  password: string;
};

const SignUp = () => {
  const router = useRouter();

  const userId = Cookies.get("userId");

  useEffect(() => {
    if (userId) {
      router.push("/categories");
    }
  }, [router, userId]);

  const [formState, setFormState] = useState<number>(1);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [otp, setOTP] = useState<string[]>(new Array(8).fill(""));
  const [showOtpError, setShowOtpError] = useState<boolean>(false);

  const handleOTPChange = (value: string[]) => {
    setOTP(value);
  };
  // let formState=1

  const signupFormSchema = yup.object({
    name: yup.string().required("*Required"),
    emailId: yup.string().required("*Required"),
    password: yup.string().required("*Required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      name: "",
      emailId: "",
      password: "",
    },
    resolver: yupResolver(signupFormSchema),
  });

  const validateEmail = api.user.validateEmail.useMutation();
  const createUser = api.user.createUser.useMutation();

  const validateOtp = () => {
    const isOtpFilled = otp.every((otpInput) => otpInput !== "");
    if (isOtpFilled) {
      setShowOtpError(false);
      createUser.mutate({
        name: watch("name"),
        email: watch("emailId"),
        password: watch("password"),
      });
    } else {
      setShowOtpError(true);
    }
  };

  const submitForm = () => {
     validateEmail.mutate({
      email: watch("emailId"),
    });

// if(data == undefined) {
//   setFormState((formState) => formState + 1);
// }
    // if (data?.status!=="error") {
    //   setFormState((formState) => formState + 1);
    // }
  };


  useEffect(() => {
    console.log({data: validateEmail.data})
    if(validateEmail.isSuccess && validateEmail.data == null && formState==1) {
      setFormState(formState+1);
    }
  }, [validateEmail, formState])



  useEffect(() => {
    if (createUser.data) {
      Cookies.set("userId", createUser.data.id.toString());
      console.log({ router });
      router.push("/categories");
    }
  }, [createUser, router]);

  const handleCreateUser = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    validateOtp();
  };

  return (
    <>
      {formState === 1 && (
        <form
          className="form-container mx-auto my-4 flex flex-col gap-4 bg-white px-10 py-4"
          onSubmit={handleSubmit(submitForm)}
        >
          <h1 className="text-center text-xl font-bold">Create Your Account</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input type="text" {...register("name")} />
            {errors.name && (
              <p className="text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input type="email" {...register("emailId")} />
            {errors.emailId && (
              <p className="text-red-400">{errors.emailId.message}</p>
            )}
          </div>
          {validateEmail.error && (
            <p className="text-red-400">{validateEmail.error.message}</p>
          )}
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="submit-button px-auto py-4">
            Create Account
          </button>
          <p className="mb-10 text-center text-slate-500">
            Have an Account?{" "}
            <Link href="/login">
              <span className="cursor-pointer text-slate-900">LOGIN</span>
            </Link>
          </p>
        </form>
      )}

      {formState === 2 && (
        <form
          className="form-container mx-auto my-4 flex flex-col gap-4 bg-white px-10 py-4"
          onSubmit={(e: FormEvent<HTMLElement>) => handleCreateUser(e)}
        >
          <h1 className="text-center text-xl font-bold">Verify your email</h1>
          <div className="flex flex-col text-center">
            <h2 className="text-center text-lg font-semibold">
              Enter the 8 digit code you have received on
            </h2>
            {watch("emailId")}
          </div>
          <OTPInput onChange={handleOTPChange} />
          {showOtpError && <p className="text-red-400">*Required</p>}
          {createUser.error && (
            <p className="text-red-400">{createUser.error.message}</p>
          )}
          <button type="submit" className="submit-button px-auto py-4">
            VERIFY
          </button>
        </form>
      )}
    </>
  );
};

export default SignUp;
