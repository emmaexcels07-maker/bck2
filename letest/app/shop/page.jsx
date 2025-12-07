import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading shop…</div>}>
      <ShopClient />
    </Suspense>
  );
}
