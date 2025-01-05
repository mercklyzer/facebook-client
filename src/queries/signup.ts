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
