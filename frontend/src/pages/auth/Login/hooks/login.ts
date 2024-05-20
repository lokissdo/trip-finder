import { backend_dev } from "../../../../service";

export const LoginHooks = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const url = backend_dev.user + `/login`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  return await result;
};
