import AdminDashboard from "./AdminClient";

// Adding metadata is best practice for Next.js App Router pages
export const metadata = {
  title: "Admin Dashboard | Store Management",
  description: "Secure administrative control panel.",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <AdminDashboard />
    </div>
  );
}