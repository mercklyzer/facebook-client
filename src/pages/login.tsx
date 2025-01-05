import React, { useEffect } from "react";
import { Field } from "@/components/ui/field";
import { login } from "@/queries/users";
import { Button, Fieldset, Flex, Input, Spinner } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/router";
import { AxiosResponse } from "@/types/axios";
import { useRedirect } from "@/hooks/useRedirect";
import Link from "next/link";

export interface LoginForm {
  username_or_email: string;
  password: string;
}

export const Login = () => {
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      username_or_email: "",
      password: "",
    },
  });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const { mutate, data, isLoading } = useMutation({
    mutationFn: login,
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

  useEffect(() => {
    if (!!sessionStorage.getItem("sessionToken")) {
      router.push("/");
    }
  }, []);

  const onSubmit = (values: LoginForm) => {
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
              <Field label="Username or Email">
                <Input {...register("username_or_email")} />
              </Field>
              <Field label="Password">
                <Input type="password" {...register("password")} />
              </Field>
            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start" disabled={isLoading}>
              {isLoading && <Spinner />}
              Login
            </Button>

            <Link href="/signup">Sign up</Link>
          </Fieldset.Root>
        </Flex>
      </form>
    </>
  );
};

export default Login;
