import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/dashboard/login");

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">AVS Legal — Admin</h1>
          <p className="text-xs text-slate-400 mt-0.5">Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{session.user?.email}</span>
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-slate-500 text-sm">
          View bookings on your{" "}
          <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Cal.com dashboard</a>
          {" "}and payments on your{" "}
          <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Razorpay dashboard</a>.
        </p>
      </main>
    </div>
  );
}
