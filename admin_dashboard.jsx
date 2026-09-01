import React, { useState, useMemo } from "react";
import {
  LayoutGrid, ShieldAlert, ArrowLeftRight, Users, Percent, Radio,
  Search, Check, X, ChevronDown, TrendingUp, Clock, AlertTriangle,
  Wifi, WifiOff, Eye, Lock, Unlock, Image as ImageIcon, Plus, Pause, Play, MousePointerClick,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ============================================================
// نظام الألوان — نفس هوية تطبيق الموبايل (داكن + زمردي)
// ============================================================
const C = {
  navy: "#0F172A",
  navySoft: "#1E293B",
  emerald: "#10B981",
  emeraldSoft: "#D1FAE5",
  amber: "#F59E0B",
  amberSoft: "#FEF3C7",
  red: "#EF4444",
  redSoft: "#FEE2E2",
  blue: "#3B82F6",
  bg: "#F8F9FA",
  border: "#E2E8F0",
  textMuted: "#64748B",
};

// أرقام مالية بخط بمسافات ثابتة، يفرّقها بصرياً عن نصوص الواجهة
const numStyle = { fontVariantNumeric: "tabular-nums", fontFamily: "'JetBrains Mono', 'Courier New', monospace" };

// ============================================================
// بيانات تجريبية — في الإنتاج الفعلي دي بتيجي من endpoints
// زي GET /admin/stats, GET /admin/reviews/pending... إلخ
// ============================================================
const STATS = {
  totalUsers: 18420,
  activeToday: 3210,
  transactionsToday: 5840,
  volumeToday: 412500000,
  feeRevenueToday: 20625000,
  pendingReviewCount: 7,
};

const VOLUME_TREND = [
  { day: "السبت", volume: 320 }, { day: "الأحد", volume: 289 }, { day: "الاثنين", volume: 410 },
  { day: "الثلاثاء", volume: 356 }, { day: "الأربعاء", volume: 398 }, { day: "الخميس", volume: 445 },
  { day: "الجمعة", volume: 412 },
];

const PENDING_REVIEWS = [
  { id: "TX-88213", user: "عثمان الفاضل", phone: "+249912340012", amount: 185000, reason: "impossible_travel, possible_structuring", risk: "critical", createdAt: "منذ 12 دقيقة" },
  { id: "TX-88209", user: "مريم الطيب", phone: "+249911223344", amount: 62000, reason: "new_recipient_large_amount", risk: "medium", createdAt: "منذ 34 دقيقة" },
  { id: "TX-88198", user: "خالد بشير", phone: "+249900112233", amount: 240000, reason: "dormant_account_reactivation", risk: "medium", createdAt: "منذ ساعة" },
  { id: "TX-88190", user: "سارة موسى", phone: "+249955667788", amount: 500000, reason: "possible_structuring", risk: "critical", createdAt: "منذ ساعتين" },
];

const TRANSACTIONS = [
  { id: "TX-88250", type: "تحويل", user: "أحمد عوض", amount: 45000, fee: 2250, status: "completed", date: "اليوم 14:20" },
  { id: "TX-88249", type: "فاتورة", user: "نور الهدى", amount: 15000, fee: 0, status: "completed", date: "اليوم 14:05" },
  { id: "TX-88248", type: "سحب", user: "عبدالله كرم", amount: 80000, fee: 0, status: "pending", date: "اليوم 13:50" },
  { id: "TX-88247", type: "تحويل خارجي", user: "هبة صديق", amount: 500, fee: 12.5, status: "failed", date: "اليوم 13:30" },
  { id: "TX-88246", type: "تحويل", user: "محمد الحسن", amount: 120000, fee: 6000, status: "completed", date: "اليوم 13:10" },
];

const USERS = [
  { id: "U-4471", name: "عثمان الفاضل", phone: "+249912340012", balance: 340500, status: "active", kyc: "verified" },
  { id: "U-4402", name: "مريم الطيب", phone: "+249911223344", balance: 82000, status: "active", kyc: "verified" },
  { id: "U-4390", name: "خالد بشير", phone: "+249900112233", balance: 12000, status: "frozen", kyc: "verified" },
  { id: "U-4355", name: "سارة موسى", phone: "+249955667788", balance: 610000, status: "active", kyc: "pending" },
];

const FEE_CONFIGS = [
  { type: "transfer", label: "تحويل داخلي", percentage: 5.0, active: true },
  { type: "bill_payment", label: "دفع فواتير", percentage: 0, active: true },
  { type: "withdrawal", label: "سحب", percentage: 0, active: true },
];

const ADS = [
  {
    id: "AD-01", title: "عرض كاش باك 10% على الفواتير", placement: "dashboard_banner",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=60",
    linkType: "external_url", linkTarget: "https://example.com/offer",
    isActive: true, impressions: 24180, clicks: 812, startsAt: "2026-08-20", endsAt: "2026-09-10",
  },
  {
    id: "AD-02", title: "افتح حساب STC Pay من هنا", placement: "dashboard_banner",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=60",
    linkType: "external_url", linkTarget: "https://example.com/stcpay",
    isActive: true, impressions: 18920, clicks: 445, startsAt: "2026-08-15", endsAt: null,
  },
  {
    id: "AD-03", title: "عرض رمضان — انتهى", placement: "dashboard_banner",
    imageUrl: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=600&q=60",
    linkType: "none", linkTarget: null,
    isActive: false, impressions: 51200, clicks: 2103, startsAt: "2026-03-01", endsAt: "2026-04-01",
  },
];

const PROVIDERS = [
  { name: "Zain Sudan", country: "السودان", status: "online", successRate: 98.2 },
  { name: "MTN Sudan", country: "السودان", status: "online", successRate: 96.7 },
  { name: "Sudani", country: "السودان", status: "degraded", successRate: 81.4 },
  { name: "STC Pay", country: "السعودية", status: "online", successRate: 99.1 },
  { name: "Ooredoo Money", country: "قطر", status: "offline", successRate: 0 },
];

// ============================================================
// عناصر مساعدة عامة
// ============================================================
function fmt(n) {
  return Math.round(n).toLocaleString("en-US");
}

function RiskBadge({ level }) {
  const map = {
    critical: { bg: C.redSoft, color: C.red, label: "حرج" },
    medium: { bg: C.amberSoft, color: C.amber, label: "متوسط" },
  };
  const s = map[level] ?? map.medium;
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: { bg: C.emeraldSoft, color: C.emerald, label: "مكتملة" },
    pending: { bg: C.amberSoft, color: C.amber, label: "معلّقة" },
    failed: { bg: C.redSoft, color: C.red, label: "فشلت" },
    active: { bg: C.emeraldSoft, color: C.emerald, label: "نشط" },
    frozen: { bg: C.redSoft, color: C.red, label: "مجمّد" },
    verified: { bg: C.emeraldSoft, color: C.emerald, label: "موثّق" },
    pending_kyc: { bg: C.amberSoft, color: C.amber, label: "قيد التوثيق" },
    online: { bg: C.emeraldSoft, color: C.emerald, label: "متصل" },
    degraded: { bg: C.amberSoft, color: C.amber, label: "أداء ضعيف" },
    offline: { bg: C.redSoft, color: C.red, label: "غير متصل" },
  };
  const s = map[status] ?? { bg: "#F1F5F9", color: C.textMuted, label: status };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function Card({ children, style, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ backgroundColor: "white", border: `1px solid ${C.border}`, ...style }}
    >
      {children}
    </div>
  );
}

// ============================================================
// شاشة النظرة العامة
// ============================================================
function OverviewTab() {
  const statCards = [
    { label: "إجمالي المستخدمين", value: fmt(STATS.totalUsers), icon: Users, color: C.blue },
    { label: "نشطون اليوم", value: fmt(STATS.activeToday), icon: TrendingUp, color: C.emerald },
    { label: "معاملات اليوم", value: fmt(STATS.transactionsToday), icon: ArrowLeftRight, color: C.navy },
    { label: "حجم التداول اليوم", value: `${fmt(STATS.volumeToday)} SDG`, icon: TrendingUp, color: C.emerald },
    { label: "إيرادات الرسوم اليوم", value: `${fmt(STATS.feeRevenueToday)} SDG`, icon: Percent, color: C.amber },
    { label: "قيد المراجعة", value: STATS.pendingReviewCount, icon: ShieldAlert, color: C.red },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: C.textMuted }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: C.navy, ...numStyle }}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-bold mb-4" style={{ color: C.navy }}>حجم التداول — آخر 7 أيام (مليون SDG)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={VOLUME_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: C.textMuted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: C.textMuted }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, direction: "rtl" }} />
            <Line type="monotone" dataKey="volume" stroke={C.emerald} strokeWidth={3} dot={{ fill: C.emerald, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ============================================================
// شاشة مراجعة المعاملات المشبوهة (قلب لوحة التحكم)
// ============================================================
function PendingReviewTab() {
  const [items, setItems] = useState(PENDING_REVIEWS);
  const [selected, setSelected] = useState(null);

  const decide = (id, decision) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected(null);
    // في الإنتاج الفعلي: POST /admin/reviews/{id}/approve أو /reject
  };

  if (items.length === 0) {
    return (
      <Card className="text-center py-16">
        <Check size={40} color={C.emerald} className="mx-auto mb-3" />
        <p className="font-bold" style={{ color: C.navy }}>لا توجد معاملات قيد المراجعة</p>
        <p className="text-sm mt-1" style={{ color: C.textMuted }}>كل المعاملات المشبوهة تمت مراجعتها</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer transition"
            style={{
              borderRight: `4px solid ${item.risk === "critical" ? C.red : C.amber}`,
              backgroundColor: selected?.id === item.id ? "#F8FAFC" : "white",
            }}
          >
            <div onClick={() => setSelected(item)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold" style={{ color: C.navy }}>{item.user}</p>
                  <p className="text-xs" style={{ color: C.textMuted }}>{item.phone} · {item.id}</p>
                </div>
                <RiskBadge level={item.risk} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-lg font-bold" style={{ color: C.navy, ...numStyle }}>{fmt(item.amount)} SDG</p>
                <span className="text-xs flex items-center gap-1" style={{ color: C.textMuted }}>
                  <Clock size={12} /> {item.createdAt}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.reason.split(", ").map((r) => (
                  <span key={r} className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: "#F1F5F9", color: C.textMuted }}>
                    {r}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => { e.stopPropagation(); decide(item.id, "approve"); }}
                  className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1"
                  style={{ backgroundColor: C.emerald, color: "white" }}
                >
                  <Check size={15} /> اعتماد
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); decide(item.id, "reject"); }}
                  className="flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1"
                  style={{ backgroundColor: C.redSoft, color: C.red }}
                >
                  <X size={15} /> رفض وتجميد
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ height: "fit-content", position: "sticky", top: 16 }}>
        {selected ? (
          <div>
            <h4 className="font-bold mb-3" style={{ color: C.navy }}>تفاصيل إضافية</h4>
            <div className="space-y-2 text-sm">
              <Row label="رقم المعاملة" value={selected.id} />
              <Row label="المستخدم" value={selected.user} />
              <Row label="الهاتف" value={selected.phone} />
              <Row label="المبلغ" value={`${fmt(selected.amount)} SDG`} />
              <Row label="مستوى الخطورة" value={selected.risk === "critical" ? "حرج" : "متوسط"} />
            </div>
            <p className="text-xs mt-4 leading-relaxed" style={{ color: C.textMuted }}>
              الاعتماد بينفّذ المعاملة فوراً. الرفض بيلغيها ويرجّع المبلغ للمستخدم تلقائياً، مع تجميد مؤقت للمحفظة لحد ما فريق الامتثال يراجع الحساب بالكامل.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Eye size={28} color={C.textMuted} className="mx-auto mb-2" />
            <p className="text-sm" style={{ color: C.textMuted }}>اختر معاملة لعرض التفاصيل</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 border-b" style={{ borderColor: C.border }}>
      <span style={{ color: C.textMuted }}>{label}</span>
      <span className="font-bold" style={{ color: C.navy, ...numStyle }}>{value}</span>
    </div>
  );
}

// ============================================================
// شاشة كل المعاملات
// ============================================================
function TransactionsTab() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      const matchesFilter = filter === "all" || t.status === filter;
      const matchesQuery = t.user.includes(query) || t.id.includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2" color={C.textMuted} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو رقم المعاملة"
            className="w-full pr-9 pl-3 py-2 rounded-lg text-sm outline-none"
            style={{ border: `1px solid ${C.border}` }}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ border: `1px solid ${C.border}`, color: C.navy }}
        >
          <option value="all">كل الحالات</option>
          <option value="completed">مكتملة</option>
          <option value="pending">معلّقة</option>
          <option value="failed">فشلت</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right" style={{ color: C.textMuted }}>
              <th className="pb-3 font-medium">رقم المعاملة</th>
              <th className="pb-3 font-medium">النوع</th>
              <th className="pb-3 font-medium">المستخدم</th>
              <th className="pb-3 font-medium">المبلغ</th>
              <th className="pb-3 font-medium">الرسوم</th>
              <th className="pb-3 font-medium">الحالة</th>
              <th className="pb-3 font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t" style={{ borderColor: C.border }}>
                <td className="py-3" style={numStyle}>{t.id}</td>
                <td className="py-3">{t.type}</td>
                <td className="py-3 font-medium" style={{ color: C.navy }}>{t.user}</td>
                <td className="py-3" style={numStyle}>{fmt(t.amount)} SDG</td>
                <td className="py-3" style={{ ...numStyle, color: C.textMuted }}>{fmt(t.fee)} SDG</td>
                <td className="py-3"><StatusBadge status={t.status} /></td>
                <td className="py-3" style={{ color: C.textMuted }}>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-sm" style={{ color: C.textMuted }}>لا توجد نتائج مطابقة</p>
        )}
      </div>
    </Card>
  );
}

// ============================================================
// شاشة المستخدمين
// ============================================================
function UsersTab() {
  const [users, setUsers] = useState(USERS);

  const toggleFreeze = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "frozen" ? "active" : "frozen" } : u)));
    // في الإنتاج الفعلي: PATCH /admin/wallets/{id}/freeze أو /unfreeze
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right" style={{ color: C.textMuted }}>
              <th className="pb-3 font-medium">المستخدم</th>
              <th className="pb-3 font-medium">الهاتف</th>
              <th className="pb-3 font-medium">الرصيد</th>
              <th className="pb-3 font-medium">التوثيق</th>
              <th className="pb-3 font-medium">الحالة</th>
              <th className="pb-3 font-medium">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t" style={{ borderColor: C.border }}>
                <td className="py-3 font-medium" style={{ color: C.navy }}>{u.name}</td>
                <td className="py-3" style={numStyle}>{u.phone}</td>
                <td className="py-3" style={numStyle}>{fmt(u.balance)} SDG</td>
                <td className="py-3"><StatusBadge status={u.kyc} /></td>
                <td className="py-3"><StatusBadge status={u.status} /></td>
                <td className="py-3">
                  <button
                    onClick={() => toggleFreeze(u.id)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: u.status === "frozen" ? C.emeraldSoft : C.redSoft,
                      color: u.status === "frozen" ? C.emerald : C.red,
                    }}
                  >
                    {u.status === "frozen" ? <Unlock size={13} /> : <Lock size={13} />}
                    {u.status === "frozen" ? "إلغاء التجميد" : "تجميد"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================
// شاشة إعدادات الرسوم
// ============================================================
function FeesTab() {
  const [configs, setConfigs] = useState(FEE_CONFIGS);

  const updatePercentage = (type, value) => {
    setConfigs((prev) => prev.map((c) => (c.type === type ? { ...c, percentage: value } : c)));
    // في الإنتاج الفعلي: PATCH /admin/fee-configs/{type}
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {configs.map((c) => (
        <Card key={c.type}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold" style={{ color: C.navy }}>{c.label}</p>
            <span
              className="text-xs px-2 py-1 rounded-full font-bold"
              style={{ backgroundColor: c.active ? C.emeraldSoft : "#F1F5F9", color: c.active ? C.emerald : C.textMuted }}
            >
              {c.active ? "مفعّل" : "معطّل"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.5"
              value={c.percentage}
              onChange={(e) => updatePercentage(c.type, parseFloat(e.target.value) || 0)}
              className="w-24 px-3 py-2 rounded-lg text-lg font-bold outline-none"
              style={{ border: `1px solid ${C.border}`, color: C.navy, ...numStyle }}
            />
            <span className="text-lg font-bold" style={{ color: C.textMuted }}>%</span>
          </div>
          <p className="text-xs mt-3" style={{ color: C.textMuted }}>
            التغيير هنا بيُطبّق فوراً على كل {c.label.includes("تحويل") ? "تحويل" : "عملية"} جديدة، بدون الحاجة لنشر تحديث للتطبيق
          </p>
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// شاشة مزودي التحويل الخارجيين
// ============================================================
function ProvidersTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PROVIDERS.map((p) => (
        <Card key={p.name}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: p.status === "online" ? C.emeraldSoft : p.status === "degraded" ? C.amberSoft : C.redSoft }}>
              {p.status === "offline" ? <WifiOff size={18} color={C.red} /> : <Wifi size={18} color={p.status === "online" ? C.emerald : C.amber} />}
            </div>
            <StatusBadge status={p.status} />
          </div>
          <p className="font-bold" style={{ color: C.navy }}>{p.name}</p>
          <p className="text-xs mb-3" style={{ color: C.textMuted }}>{p.country}</p>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: C.textMuted }}>نسبة نجاح التحويلات</span>
            <span className="font-bold" style={{ color: C.navy, ...numStyle }}>{p.successRate}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: "#F1F5F9" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${p.successRate}%`, backgroundColor: p.successRate > 90 ? C.emerald : p.successRate > 50 ? C.amber : C.red }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// شاشة إدارة الإعلانات داخل التطبيق
// ============================================================
function AdsTab() {
  const [ads, setAds] = useState(ADS);
  const [showForm, setShowForm] = useState(false);
  const [newAd, setNewAd] = useState({ title: "", imageUrl: "", linkTarget: "" });

  const toggleActive = (id) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
    // في الإنتاج الفعلي: PATCH /admin/ads/{id}
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newAd.title || !newAd.imageUrl) return;
    const created = {
      id: `AD-${Math.floor(Math.random() * 900 + 100)}`,
      title: newAd.title,
      placement: "dashboard_banner",
      imageUrl: newAd.imageUrl,
      linkType: newAd.linkTarget ? "external_url" : "none",
      linkTarget: newAd.linkTarget || null,
      isActive: true,
      impressions: 0,
      clicks: 0,
      startsAt: new Date().toISOString().slice(0, 10),
      endsAt: null,
    };
    setAds((prev) => [created, ...prev]);
    setNewAd({ title: "", imageUrl: "", linkTarget: "" });
    setShowForm(false);
    // في الإنتاج الفعلي: POST /admin/ads
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: C.emerald }}
        >
          <Plus size={16} /> إعلان جديد
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold block mb-1.5" style={{ color: C.textMuted }}>عنوان الإعلان</label>
              <input
                value={newAd.title}
                onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                placeholder="مثال: عرض كاش باك 10% على الفواتير"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: `1px solid ${C.border}` }}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: C.textMuted }}>رابط الصورة</label>
              <input
                value={newAd.imageUrl}
                onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: `1px solid ${C.border}` }}
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: C.textMuted }}>رابط الوجهة (اختياري)</label>
              <input
                value={newAd.linkTarget}
                onChange={(e) => setNewAd({ ...newAd, linkTarget: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: `1px solid ${C.border}` }}
              />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end mt-1">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ color: C.textMuted }}>
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: C.emerald }}>
                نشر الإعلان
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ads.map((ad) => {
          const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0.0";
          return (
            <Card key={ad.id}>
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: "#F1F5F9" }}>
                  {ad.imageUrl ? (
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={20} color={C.textMuted} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm leading-snug" style={{ color: C.navy }}>{ad.title}</p>
                    <StatusBadge status={ad.isActive ? "active" : "frozen"} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: C.textMuted }}>
                    <span className="flex items-center gap-1"><Eye size={12} /> {fmt(ad.impressions)}</span>
                    <span className="flex items-center gap-1"><MousePointerClick size={12} /> {fmt(ad.clicks)}</span>
                    <span style={numStyle}>CTR {ctr}%</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleActive(ad.id)}
                className="w-full mt-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: ad.isActive ? C.redSoft : C.emeraldSoft,
                  color: ad.isActive ? C.red : C.emerald,
                }}
              >
                {ad.isActive ? <Pause size={13} /> : <Play size={13} />}
                {ad.isActive ? "إيقاف الإعلان" : "تفعيل الإعلان"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// الهيكل الرئيسي — Sidebar + المحتوى
// ============================================================

// ============================================================
// شاشة دخول الأدمن — بريد + كلمة مرور، ثم كود 2FA إجباري
// (لا يوجد "تسجيل حساب جديد" هنا؛ الحسابات تُنشأ من create_owner_account.js
// أو بدعوة من owner موجود بالفعل عبر /admin/auth/invite)
// ============================================================
function AdminLoginGate({ onSuccess }) {
  const [step, setStep] = useState("credentials"); // credentials -> twoFactor
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("من فضلك أدخل البريد وكلمة المرور");
      return;
    }
    setIsLoading(true);
    // في الإنتاج الفعلي: POST /admin/auth/login
    // لو requires_2fa_setup=true (أول دخول للـ owner)، تتحول لشاشة إعداد التطبيق المصادق
    await new Promise((r) => setTimeout(r, 600)); // محاكاة لطلب الشبكة
    setIsLoading(false);
    setStep("twoFactor");
  };

  const handleTotpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (totpCode.length !== 6) {
      setError("أدخل كود التحقق المكوّن من 6 أرقام");
      return;
    }
    setIsLoading(true);
    // في الإنتاج الفعلي: POST /admin/auth/verify-2fa
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    onSuccess();
  };

  return (
    <div dir="rtl" className="flex items-center justify-center" style={{ minHeight: "100vh", backgroundColor: C.navy, fontFamily: "'Tajawal', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet" />
      <div className="w-full max-w-sm p-8 rounded-2xl" style={{ backgroundColor: "white" }}>
        <div className="p-3 rounded-xl inline-block mb-4" style={{ backgroundColor: `${C.emerald}15` }}>
          <ShieldAlert size={24} color={C.emerald} />
        </div>
        <h2 className="text-lg font-bold mb-1" style={{ color: C.navy }}>
          {step === "credentials" ? "دخول لوحة التحكم" : "التحقق بخطوتين"}
        </h2>
        <p className="text-sm mb-6" style={{ color: C.textMuted }}>
          {step === "credentials" ? "هذه اللوحة مخصصة لفريق العمليات والامتثال فقط" : "أدخل الكود من تطبيق المصادقة (Authenticator)"}
        </p>

        {step === "credentials" ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: `1px solid ${C.border}` }}
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: `1px solid ${C.border}` }}
            />
            {error && <p className="text-xs font-bold" style={{ color: C.red }}>{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: C.emerald, opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? "جاري التحقق..." : "متابعة"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTotpSubmit} className="space-y-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              className="w-full px-3 py-3 rounded-lg text-center text-2xl font-bold outline-none"
              style={{ border: `1px solid ${C.border}`, letterSpacing: "0.5em", ...numStyle }}
            />
            {error && <p className="text-xs font-bold" style={{ color: C.red }}>{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: C.emerald, opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? "جاري التأكيد..." : "دخول"}
            </button>
            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="w-full text-xs font-medium"
              style={{ color: C.textMuted }}
            >
              رجوع
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!isAuthenticated) {
    return <AdminLoginGate onSuccess={() => setIsAuthenticated(true)} />;
  }


  const NAV = [
    { id: "overview", label: "نظرة عامة", icon: LayoutGrid },
    { id: "review", label: "مراجعة الاحتيال", icon: ShieldAlert, badge: STATS.pendingReviewCount },
    { id: "transactions", label: "المعاملات", icon: ArrowLeftRight },
    { id: "users", label: "المستخدمون", icon: Users },
    { id: "fees", label: "الرسوم", icon: Percent },
    { id: "providers", label: "مزودو التحويل", icon: Radio },
    { id: "ads", label: "الإعلانات", icon: ImageIcon },
  ];

  const TAB_LABELS = {
    overview: "نظرة عامة",
    review: "مراجعة المعاملات المشبوهة",
    transactions: "كل المعاملات",
    users: "إدارة المستخدمين",
    fees: "إعدادات الرسوم",
    providers: "حالة مزودي التحويل",
    ads: "إدارة الإعلانات داخل التطبيق",
  };

  return (
    <div dir="rtl" style={{ backgroundColor: C.bg, minHeight: "100vh", fontFamily: "'Tajawal', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet" />

      <div className="flex" style={{ minHeight: "100vh" }}>
        {/* الشريط الجانبي */}
        <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col" style={{ backgroundColor: C.navy }}>
          <div className="p-5 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="p-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <ShieldAlert size={20} color={C.emerald} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">لوحة تحكم المحفظة</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>فريق العمليات والامتثال</p>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {NAV.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
                  style={{
                    backgroundColor: isActive ? "rgba(16,185,129,0.12)" : "transparent",
                    color: isActive ? C.emerald : "rgba(255,255,255,0.65)",
                  }}
                >
                  <item.icon size={18} />
                  <span className="flex-1 text-right">{item.label}</span>
                  {item.badge ? (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: C.red, color: "white" }}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <Lock size={16} />
              تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: C.navy }}>{TAB_LABELS[activeTab]}</h1>
          </div>

          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "review" && <PendingReviewTab />}
          {activeTab === "transactions" && <TransactionsTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "fees" && <FeesTab />}
          {activeTab === "providers" && <ProvidersTab />}
          {activeTab === "ads" && <AdsTab />}
        </main>
      </div>
    </div>
  );
}
