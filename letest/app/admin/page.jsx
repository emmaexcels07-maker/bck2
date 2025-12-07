import { Suspense } from "react";
import AdminClient from "./AdminClient.jsx";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading admin...</div>}>
      <AdminClient />
    </Suspense>
  );
}
