import React from "react";
import { Field } from "@/components/ui/field";
import { signup } from "@/queries/signup";
import { Button, Fieldset, Flex, Input, Spinner } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/router";

export interface SignupForm {
  username: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AxiosResponse {
  data: unknown[];
  errors: string[];
  meta: unknown[];
}

export const Signup = () => {
  const { register, handleSubmit } = useForm<SignupForm>({
    defaultValues: {
      username: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      email: "",
    },
  });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const { mutate, data, isLoading } = useMutation({
    mutationFn: signup,
    onError: (error) => {
      const axiosResponse = (error as AxiosError).response?.data;
      const errorMessages = (axiosResponse as AxiosResponse).errors;
      setErrorMessages(errorMessages);
    },
  });

  const router = useRouter();

  if (data) {
    const token = data.data.data.token;
    sessionStorage.setItem("sessionToken", token);
    router.push("/");
  }

  const onSubmit = (values: SignupForm) => {
    setErrorMessages([]);
    console.log(values);
    mutate(values);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justify={"center"} direction="column" align="center" h="100vh">
          <Fieldset.Root size="lg" maxW="md" gap={4}>
            {errorMessages.length > 0 && (
              <Alert status="error">{errorMessages.join(", ")}</Alert>
            )}
            <Fieldset.Content mb={4}>
              <Field label="Username">
                <Input {...register("username")} />
              </Field>
              <Field label="Password">
                <Input type="password" {...register("password")} />
              </Field>
              <Field label="Confirm Password">
                <Input type="password" {...register("confirm_password")} />
              </Field>
              <Field label="First Name">
                <Input {...register("first_name")} />
              </Field>
              <Field label="Last Name">
                <Input {...register("last_name")} />
              </Field>
              <Field label="Email address">
                <Input type="email" {...register("email")} />
              </Field>
            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start" disabled={isLoading}>
              {isLoading && <Spinner />}
              Signup
            </Button>
          </Fieldset.Root>
        </Flex>
      </form>
    </>
  );
};

export default Signup;
