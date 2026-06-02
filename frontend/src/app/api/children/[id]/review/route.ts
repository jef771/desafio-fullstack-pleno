import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const token =
    (await cookies()).get("token")?.value;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/children/${id}/review`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 204) {
    return new Response(null, {
      status: 204,
    });
  }

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}