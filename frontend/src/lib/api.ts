import { Summary } from "@/types/api";
import { ListChildrenResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Credenciais Inválidas");
  }

  return response.json();
}

export async function getSummary(
  token: string
): Promise<Summary> {
  const response = await fetch(
    `${API_URL}/summary`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load summary");
  }

  return response.json();
}

export async function getChildren(
  token: string,
  query: URLSearchParams
): Promise<ListChildrenResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/children?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load children");
  }

  return response.json();
}