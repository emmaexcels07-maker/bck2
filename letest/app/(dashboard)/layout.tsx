// app/(dashboard)/layout.tsx
import DashboardLayout from "../components/DashboardLayout";

export default function RootDashboardLayout({ children }: { children: React.ReactNode }) {
    // In a real app, verify the session here or via a Hook
    const user = { role: "admin" }; // Mock: Get this from your Auth Context/Session

    return (
        <DashboardLayout user={user}>
            {children}
        </DashboardLayout>
    );
}