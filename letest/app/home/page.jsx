"use client";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/LogoutButton";

export default function Home() {
  return (
    <div className="p-4 flex justify-end">
      <LogoutButton />
    </div>
  );
}
export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO SECTION */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to ShopEase</h1>
        <p className="text-xl mb-6">Find the best deals on your favorite products.</p>
        

        <button
          onClick={() => router.push("/shop")}
          className="px-6 py-3 bg-white text-blue-600 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Start Shopping
        </button>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-600">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Electronics", "Fashion", "Home & Kitchen"].map((cat) => (
            <div
              key={cat}
              onClick={() => router.push(`/shop?category=${cat.toLowerCase()}`)}
              className="bg-white p-6 shadow-lg rounded-lg cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition"
            >
              <h3 className="text-xl font-semibold">{cat}</h3>
              <p className="text-gray-900 mt-2">Explore the best in {cat}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
