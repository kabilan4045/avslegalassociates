import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import SignOutButton from "@/components/SignOutButton";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  amount: number;
  payment_id: string;
  status: string;
  created_at: string;
  query: string;
}

function formatAmount(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const PLANS = [
  "Legal Doubt Clearance",
  "Quick Legal Consultation",
  "Detailed Legal Consultation",
  "Detailed Case Analysis",
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; from?: string; to?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/dashboard/login");

  const params = await searchParams;
  const { plan: planFilter, from: fromFilter, to: toFilter } = params;

  let bookings: Booking[] = [];
  let fetchError = false;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (planFilter) query = query.eq("plan", planFilter);
    if (fromFilter) query = query.gte("created_at", fromFilter);
    if (toFilter) query = query.lte("created_at", toFilter + "T23:59:59");

    const { data, error } = await query;
    if (error) fetchError = true;
    else bookings = (data as Booking[]) ?? [];
  } else {
    fetchError = true;
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const allForSummary = fetchError ? [] : bookings;

  const totalRevenue = allForSummary.reduce((s, b) => s + (b.amount || 0), 0);
  const totalBookings = allForSummary.length;
  const thisMonthCount = allForSummary.filter((b) => b.created_at >= monthStart).length;

  const summaryCards = [
    { label: "Total Revenue", value: formatAmount(totalRevenue), color: "bg-emerald-50 text-emerald-700" },
    { label: "Total Bookings", value: String(totalBookings), color: "bg-blue-50 text-blue-700" },
    { label: "This Month", value: String(thisMonthCount), color: "bg-violet-50 text-violet-700" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">AVS Legal — Admin</h1>
          <p className="text-xs text-slate-400 mt-0.5">Booking Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{session.user?.email}</span>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {summaryCards.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{c.label}</p>
              <p className={`text-3xl font-black rounded-xl px-3 py-1 inline-block ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <form method="GET" className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-end shadow-sm">
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</label>
            <select
              name="plan"
              defaultValue={planFilter || ""}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white outline-none focus:border-slate-900"
            >
              <option value="">All Plans</option>
              {PLANS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">From</label>
            <input
              type="date"
              name="from"
              defaultValue={fromFilter || ""}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white outline-none focus:border-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">To</label>
            <input
              type="date"
              name="to"
              defaultValue={toFilter || ""}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white outline-none focus:border-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors"
          >
            Filter
          </button>
          {(planFilter || fromFilter || toFilter) && (
            <a
              href="/dashboard"
              className="px-5 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Clear
            </a>
          )}
        </form>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {fetchError ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-sm">Supabase is not configured. Fill in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">SUPABASE_URL</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">SUPABASE_SERVICE_ROLE_KEY</code> in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>.</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-sm">No bookings found{planFilter || fromFilter || toFilter ? " for the selected filters" : ""}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Name", "Email", "Phone", "Plan", "Amount", "Payment ID", "Status", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{b.name || "—"}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.email || "—"}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{b.phone || "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {b.plan || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap">
                        {b.amount ? formatAmount(b.amount) : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {b.payment_id || "—"}
                        </code>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                          b.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {b.status || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {b.created_at ? formatDate(b.created_at) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""} shown
        </p>
      </main>
    </div>
  );
}
