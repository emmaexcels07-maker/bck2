import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop Products",
  description: "Browse our products",
};

export default function ShopPage({ searchParams }) {
  return <ShopClient searchParams={searchParams} />;
}
