import { LoginForm } from "@/pages/login";
import { SignupForm } from "@/pages/signup";
import axios from "axios";

export const signup = async (data: SignupForm) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/signup`,
    {
      user: data,
    }
  );
};

export const login = async (data: LoginForm) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/login`,
    {
      user: data,
    }
  );
};
