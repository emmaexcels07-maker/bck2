import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const token = cookies().get("token")?.value;

  if (!token) redirect("/signin");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) redirect("/signin");

  const data = await res.json();

  if (data.user.role !== "admin") {
    redirect("/");
  }

  return <div>Admin Dashboard</div>;
}
