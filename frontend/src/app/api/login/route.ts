import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return Response.json(
      { error: "Credenciais Inválidas" },
      { status: 401 }
    );
  }

  const data = await response.json();

  const cookieStore = await cookies();

  cookieStore.set("token", data.token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return Response.json({
    success: true,
  });
}