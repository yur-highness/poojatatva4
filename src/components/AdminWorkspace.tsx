import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Box,
  Coins,
  IndianRupee,
  LayoutGrid,
  Megaphone,
  Plus,
  Receipt,
  RotateCcw,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import type{
  AdminAction,
  AdminSection,
  Order,
  Product,
  ProfileState,
  RoleName,
  Ticket,
  WalletState,
} from '../types';
import { ADMIN_META, ROLE_PERMISSIONS, formatMoney } from '../data/storeData';
import { ArtSvg } from './ArtSvg';
import { StatusLabel } from './CheckoutAndOrders';

interface AdminWorkspaceProps {
  role: RoleName;
  activeSection: AdminSection;
  orders: Order[];
  products: Product[];
  tickets: Ticket[];
  campaigns: string[];
  wallet: WalletState;
  profile: ProfileState;
  onChangeRole: (role: RoleName) => void;
  onSelectSection: (section: AdminSection) => void;
  onAdvanceOrder: (id: string) => void;
  onSaveStock: (id: number, stock: number) => void;
  onOpenAddProduct: () => void;
  onCreateCampaign: (name: string) => void;
  onToast: (msg: string) => void;
}

const Sparkline: React.FC<{ values: number[] }> = ({ values }) => {
  const w = 120;
  const h = 26;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = w / (values.length - 1);
  const points = values.map((v, i) => [
    i * step,
    h - 1 - ((v - min) / (max - min || 1)) * (h - 2),
  ]);
  const d = points
    .map((p, i) => {
      if (i === 0) return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
      const prev = points[i - 1];
      const mid = ((prev[0] + p[0]) / 2).toFixed(1);
      return `C${mid} ${prev[1].toFixed(1)} ${mid} ${p[1].toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      className="mt-2 block h-[26px] w-full text-[var(--clay)]"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="anim-spark-line"
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const KpiBox: React.FC<{
  label: string;
  value: string;
  delta: string;
  note: string;
  spark: number[];
}> = ({ label, value, delta, note, spark }) => (
  <div className="min-w-0 p-4">
    <span className="block text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
      {label}
    </span>
    <strong className="mt-2 block truncate text-[24px] font-semibold tracking-[-0.025em] text-[var(--ink)] tabular-nums">
      {value}
    </strong>
    <span
      className={`text-[11.5px] font-semibold ${
        delta.startsWith('-') ? 'text-[var(--crimson)]' : 'text-[var(--sage)]'
      }`}
    >
      {delta} <span className="font-normal text-[var(--muted)]">{note}</span>
    </span>
    <Sparkline values={spark} />
  </div>
);

const SalesChart: React.FC = () => {
  const values = [42, 64, 52, 78, 60, 88, 72, 96, 68, 84, 100, 90];
  const w = 660;
  const h = 230;
  const padX = 12;
  const padTop = 14;
  const padBottom = 24;
  const max = Math.max(...values) * 1.08;
  const step = (w - padX * 2) / (values.length - 1);
  const points = values.map((v, i) => [
    padX + i * step,
    h - padBottom - (v / max) * (h - padBottom - padTop),
  ]);
  const line = points
    .map((p, i) => {
      if (i === 0) return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
      const prev = points[i - 1];
      const mid = ((prev[0] + p[0]) / 2).toFixed(1);
      return `C${mid} ${prev[1].toFixed(1)} ${mid} ${p[1].toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    })
    .join(' ');
  const area = `${line} L${w - padX} ${h - padBottom} L${padX} ${h - padBottom} Z`;
  const months = 'JFMAMJJASOND'.split('');

  return (
    <svg
      className="block h-auto w-full overflow-visible"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Monthly sales across twelve months, sample data"
    >
      <defs>
        <linearGradient id="ptChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--clay)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--clay)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = padTop + t * (h - padBottom - padTop);
        return (
          <line
            key={t}
            x1={padX}
            x2={w - padX}
            y1={y}
            y2={y}
            stroke="var(--line)"
            strokeWidth="1"
          />
        );
      })}
      <path d={area} fill="url(#ptChartFill)" />
      <path
        className="anim-draw-line"
        d={line}
        fill="none"
        stroke="var(--clay)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="3.5"
        fill="var(--clay)"
        stroke="var(--surface)"
        strokeWidth="2"
      />
      <text
        x={points[points.length - 1][0]}
        y={points[points.length - 1][1] - 10}
        textAnchor="middle"
        fontSize="10"
        fill="var(--muted)"
      >
        ₹38.4k
      </text>
      {months.map((m, i) => (
        <text
          key={`${m}-${i}`}
          x={points[i][0]}
          y={h - 6}
          textAnchor="middle"
          fontSize="9.5"
          fill="var(--muted)"
        >
          {m}
        </text>
      ))}
    </svg>
  );
};

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  role,
  activeSection,
  orders,
  products,
  tickets,
  campaigns,
  wallet,
  profile,
  onChangeRole,
  onSelectSection,
  onAdvanceOrder,
  onSaveStock,
  onOpenAddProduct,
  onCreateCampaign,
  onToast,
}) => {
  const [stockDrafts, setStockDrafts] = useState<Record<number, string>>({});
  const [campaignDraft, setCampaignDraft] = useState('');

  const perms = ROLE_PERMISSIONS[role];
  const canAccess = (s: AdminSection) => perms.pages.includes(s);
  const can = (a: AdminAction) => perms.actions.includes(a);

  const meta = ADMIN_META[activeSection] || ADMIN_META.dashboard;

  const navGroups: Array<{
    group: string;
    items: Array<{
      id: AdminSection;
      label: string;
      Icon: React.ComponentType<{ className?: string }>;
    }>;
  }> = [
    {
      group: 'Overview',
      items: [{ id: 'dashboard', label: 'Dashboard', Icon: LayoutGrid }],
    },
    {
      group: 'Commerce',
      items: [
        { id: 'orders', label: 'Orders', Icon: Receipt },
        { id: 'products', label: 'Products and stock', Icon: Box },
        { id: 'returns', label: 'Returns and reviews', Icon: RotateCcw },
        { id: 'customers', label: 'Customers', Icon: Users },
      ],
    },
    {
      group: 'Growth',
      items: [
        { id: 'marketing', label: 'Marketing', Icon: Megaphone },
        { id: 'hr', label: 'Team and HR', Icon: Users },
        { id: 'spiritual', label: 'Spiritual services', Icon: Sparkles },
      ],
    },
    {
      group: 'Management',
      items: [
        { id: 'finance', label: 'Finance and legal', Icon: IndianRupee },
        { id: 'reports', label: 'Reports', Icon: BarChart3 },
        { id: 'settings', label: 'Settings and security', Icon: Settings },
      ],
    },
  ];

  const downloadCSV = (rows: Array<Array<string | number>>, filename: string) => {
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportOrders = () => {
    downloadCSV(
      [['Order', 'Date', 'Items', 'Amount', 'Status'], ...orders.map((o) => [o.id, o.date, o.items, o.amount, o.status])],
      'poojatatva-orders.csv'
    );
    onToast('Orders exported as CSV');
  };

  const downloadReport = (kind: 'sales' | 'inventory' | 'marketing' | 'finance') => {
    const dataMap = {
      sales: [
        ['Month', 'Sales'],
        ...'JFMAMJJASOND'.split('').map((m, i) => [
          m,
          [42000, 64000, 52000, 78000, 60000, 88000, 72000, 96000, 68000, 84000, 100000, 90000][i],
        ]),
      ],
      inventory: [
        ['Product', 'Category', 'Stock', 'Price'],
        ...products.map((p) => [p.name, p.category, p.stock, p.price]),
      ],
      marketing: [
        ['Channel', 'Share'],
        ['Instagram', 82],
        ['Meta ads', 67],
        ['Google', 54],
        ['WhatsApp', 76],
      ],
      finance: [
        ['Area', 'Amount'],
        ['Gross revenue', 248650],
        ['Settlements', 192400],
        ['Expenses', 42800],
        ['Unreconciled', 13450],
      ],
    };
    downloadCSV(dataMap[kind], `poojatatva-${kind}.csv`);
    onToast(`${kind[0].toUpperCase() + kind.slice(1)} report downloaded`);
  };

  const customerCoinRows = [
    {
      name: profile.name || 'Meera Iyer',
      city: 'Chennai',
      code: wallet.code,
      coins: wallet.coins,
      earned: wallet.lifetimeEarned,
      used: wallet.lifetimeSpent,
      referrals: wallet.referrals.filter((r) => r.coins > 0).length,
    },
    { name: 'Rohit Sharma', city: 'Pune', code: 'ROHIT150', coins: 380, earned: 720, used: 340, referrals: 2 },
    { name: 'Ananya Das', city: 'Kolkata', code: 'ANANYA90', coins: 210, earned: 560, used: 350, referrals: 1 },
    { name: 'Kavita Rao', city: 'Hyderabad', code: 'KAVITA70', coins: 95, earned: 395, used: 300, referrals: 1 },
    { name: 'Vikram Nair', city: 'Bengaluru', code: 'VIKRAM60', coins: 0, earned: 180, used: 180, referrals: 0 },
  ];

  const renderOrderTable = (rows: Order[]) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[580px] border-collapse text-[13.5px]">
        <thead>
          <tr className="border-b border-[var(--line)] text-left text-[10.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
            <th className="px-3 pb-2.5">Order</th>
            <th className="px-3 pb-2.5">Date</th>
            <th className="px-3 pb-2.5">Items</th>
            <th className="px-3 pb-2.5 text-right">Amount</th>
            <th className="px-3 pb-2.5">Status</th>
            <th className="px-3 pb-2.5">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {rows.map((order) => (
            <tr key={order.id} className="hover:bg-[#125660]">
              <td className="px-3 py-3 font-semibold text-[var(--ink)] tabular-nums">{order.id}</td>
              <td className="px-3 py-3 text-[var(--ink-2)] tabular-nums">{order.date}</td>
              <td className="px-3 py-3 text-[var(--ink-2)]">{order.items}</td>
              <td className="px-3 py-3 text-right font-medium text-[var(--ink)] tabular-nums">
                {formatMoney(order.amount)}
              </td>
              <td className="px-3 py-3">
                <StatusLabel status={order.status} />
              </td>
              <td className="px-3 py-3">
                {order.kind === 'Service' ? (
                  <span className="text-[12px] font-medium text-[var(--sage)]">Paid</span>
                ) : can('order_update') ? (
                  <button
                    type="button"
                    onClick={() => onAdvanceOrder(order.id)}
                    className="min-h-[32px] rounded-lg border border-[var(--line-2)] px-3 text-[12px] font-medium text-[var(--ink-2)] hover:border-[var(--clay)] hover:text-[var(--clay-2)]"
                  >
                    Advance
                  </button>
                ) : (
                  <span className="text-[12px] text-[var(--muted)]">View only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="grid min-h-[calc(100dvh-var(--header))] grid-cols-1 lg:grid-cols-[242px_1fr]">
      {/* SIDEBAR RAIL */}
      <aside className="sticky top-[var(--header)] z-30 border-b border-[var(--line)] bg-[var(--paper-2)] px-3 py-2.5 lg:h-[calc(100dvh-var(--header))] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-5">
        <div className="hidden px-2.5 pb-4 lg:block">
          <span className="block text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Workspace
          </span>
          <span className="font-serif-display block text-[21px] text-[var(--ink)]">
            PoojaTatva
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto lg:block lg:space-y-4" aria-label="Admin sections">
          {navGroups.map((g) => {
            const visibleItems = g.items.filter((i) => canAccess(i.id));
            if (visibleItems.length === 0) return null;
            return (
              <div key={g.group} className="flex gap-1 lg:block">
                <div className="hidden px-2.5 pb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)] lg:block">
                  {g.group}
                </div>
                <div className="flex gap-1 lg:block lg:space-y-0.5">
                  {visibleItems.map(({ id, label, Icon }) => {
                    const active = activeSection === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onSelectSection(id)}
                        className={`relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-[12.5px] font-medium transition-colors lg:w-full ${
                          active
                            ? 'bg-[#B82E1E] text-[#FDF2DA] shadow-[inset_0_0_0_1px_rgba(253,242,218,0.28)]'
                            : 'text-[var(--ink-2)] hover:bg-[#125660] hover:text-[var(--ink)]'
                        }`}
                      >
                        {active && (
                          <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-[var(--clay)]" />
                        )}
                        <Icon
                          className={`h-4 w-4 ${active ? 'text-[var(--clay)]' : 'opacity-70'}`}
                        />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1.5 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              <span className="h-px w-5 bg-[var(--line-2)]" />
              <span>{meta[0]}</span>
            </p>
            <h1 className="font-serif-display text-[clamp(28px,3.2vw,40px)] font-normal leading-tight text-[var(--ink)]">
              {meta[1]}
            </h1>
            <p className="mt-1 max-w-[60ch] text-[13.5px] text-[var(--muted)]">{meta[2]}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="roleSelect">
              Demo role
            </label>
            <select
              id="roleSelect"
              value={role}
              onChange={(e) => onChangeRole(e.target.value as RoleName)}
              className="select-clean min-h-[36px] rounded-lg border border-[var(--line-2)] bg-[var(--surface)] px-3 text-[12.5px] text-[var(--ink-2)] focus:border-[var(--clay)] focus:outline-none"
            >
              <option>Super Admin</option>
              <option>Operations Admin</option>
              <option>Marketing Admin</option>
              <option>Finance Admin</option>
              <option>Customer</option>
            </select>
            <span className="text-[12px] text-[var(--muted)]">Demo workspace</span>
          </div>
        </div>

        <p className="my-4 rounded-xl border border-[var(--line)] bg-[var(--paper-2)] px-3.5 py-2.5 text-[12.5px] text-[var(--ink-2)]">
          {perms.note}
        </p>

        {/* SECTION CONTENT */}
        {activeSection === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <KpiBox
                label="Sales · 30 days"
                value="₹2,48,650"
                delta="+12.8%"
                note="vs last month"
                spark={[42, 48, 45, 58, 54, 66, 61, 74, 70, 82]}
              />
              <KpiBox
                label="Orders"
                value="129"
                delta="+8.2%"
                note="vs last month"
                spark={[22, 24, 21, 28, 26, 31, 29, 34, 32, 37]}
              />
              <KpiBox
                label="Customers"
                value="1,284"
                delta="+16.4%"
                note="new this month"
                spark={[30, 34, 33, 38, 41, 44, 43, 49, 52, 56]}
              />
              <KpiBox
                label="Average order"
                value="₹1,927"
                delta="+6.1%"
                note="vs last month"
                spark={[16, 17, 16, 18, 17, 19, 18, 20, 19, 20]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_0.85fr]">
              <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Sales</h3>
                    <p className="text-[12.5px] text-[var(--muted)]">
                      Last twelve months, sample data
                    </p>
                  </div>
                  <span className="text-[11.5px] font-medium text-[var(--muted)]">Demo</span>
                </div>
                <SalesChart />
                <div className="mt-3 flex flex-wrap gap-8 border-t border-[var(--line)] pt-3.5">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                      Best month
                    </span>
                    <span className="mt-0.5 block text-[13.5px] font-semibold text-[var(--ink)]">
                      November · ₹38.4k
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                      Repeat rate
                    </span>
                    <span className="mt-0.5 block text-[13.5px] font-semibold text-[var(--ink)] tabular-nums">
                      38%
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                      Returns
                    </span>
                    <span className="mt-0.5 block text-[13.5px] font-semibold text-[var(--ink)] tabular-nums">
                      1.2%
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Needs attention</h3>
                  <span className="text-[12px] font-semibold text-[var(--clay-2)] tabular-nums">
                    4 items
                  </span>
                </div>
                <ul className="divide-y divide-[var(--line)]">
                  {[
                    {
                      title: '3 orders await dispatch',
                      sub: 'Oldest is 19 hours old',
                      section: 'orders' as AdminSection,
                    },
                    {
                      title: '2 returns to review',
                      sub: 'One damaged in transit',
                      section: 'returns' as AdminSection,
                    },
                    {
                      title: '3 services booked today',
                      sub: 'Aaj Ki Pooja at 6:30 pm',
                      section: 'spiritual' as AdminSection,
                    },
                    {
                      title: '2 products running low',
                      sub: 'Gift box and copper kalash',
                      section: 'products' as AdminSection,
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <strong className="block text-[13px] font-medium text-[var(--ink)]">
                          {item.title}
                        </strong>
                        <span className="text-[12px] text-[var(--muted)]">{item.sub}</span>
                      </div>
                      {canAccess(item.section) && (
                        <button
                          type="button"
                          onClick={() => onSelectSection(item.section)}
                          className="text-[12.5px] font-medium text-[var(--clay-2)] hover:underline"
                        >
                          Open
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Recent orders</h3>
                  <p className="text-[12.5px] text-[var(--muted)]">
                    Latest activity across the store
                  </p>
                </div>
                {canAccess('orders') && (
                  <button
                    type="button"
                    onClick={() => onSelectSection('orders')}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-2)] hover:text-[var(--clay)]"
                  >
                    <span>All orders</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {renderOrderTable(orders.slice(0, 5))}
            </section>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <KpiBox
                label="All orders"
                value={String(orders.length)}
                delta="+9"
                note="this week"
                spark={[8, 9, 7, 11, 10, 12, 11, 13, 12, 14]}
              />
              <KpiBox
                label="New"
                value={String(orders.filter((o) => o.status === 'Order received').length)}
                delta="+2"
                note="awaiting review"
                spark={[3, 4, 2, 5, 3, 4, 2, 4, 3, 4]}
              />
              <KpiBox
                label="In progress"
                value={String(
                  orders.filter((o) => ['Processing', 'Shipped'].includes(o.status)).length
                )}
                delta="-1"
                note="with the studio"
                spark={[4, 5, 4, 6, 5, 4, 5, 3, 4, 4]}
              />
              <KpiBox
                label="Delivered"
                value={String(orders.filter((o) => o.status === 'Delivered').length)}
                delta="+6"
                note="this month"
                spark={[12, 14, 13, 15, 14, 16, 15, 17, 16, 18]}
              />
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Order queue</h3>
                  <p className="text-[12.5px] text-[var(--muted)]">
                    Advance an order to move it through fulfillment
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportOrders}
                  className="min-h-[34px] rounded-lg border border-[var(--line-2)] px-3.5 text-[12.5px] font-medium text-[var(--ink-2)] hover:border-[var(--clay)]"
                >
                  Export CSV
                </button>
              </div>
              {renderOrderTable(orders)}
            </section>
          </div>
        )}

        {activeSection === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif-display text-[24px] font-normal text-[var(--ink)]">
                  Catalogue
                </h2>
                <p className="text-[12.5px] text-[var(--muted)]">
                  {products.length} products · display tone, price and stock
                </p>
              </div>
              {can('product_add') ? (
                <button
                  type="button"
                  onClick={onOpenAddProduct}
                  className="btn-gold inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3.5 text-[13px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add product</span>
                </button>
              ) : (
                <span className="text-[12px] text-[var(--muted)]">View only</span>
              )}
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-left text-[10.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                      <th className="px-3 pb-2.5">Product</th>
                      <th className="px-3 pb-2.5">Category</th>
                      <th className="px-3 pb-2.5 text-right">Price</th>
                      <th className="px-3 pb-2.5">Stock</th>
                      <th className="px-3 pb-2.5">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#125660]">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg tone-${p.tone}`}
                            >
                              <ArtSvg name={p.art} className="w-5 text-[var(--sage)]" />
                            </span>
                            <span className="font-semibold text-[var(--ink)]">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-[var(--ink-2)]">{p.category}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{formatMoney(p.price)}</td>
                        <td className="px-3 py-3 tabular-nums">
                          {p.stock <= 15 ? (
                            <span className="font-medium text-[var(--amber)]">{p.stock} left</span>
                          ) : (
                            p.stock
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {can('inventory_edit') ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                value={stockDrafts[p.id] ?? String(p.stock)}
                                onChange={(e) =>
                                  setStockDrafts((d) => ({ ...d, [p.id]: e.target.value }))
                                }
                                aria-label={`Stock for ${p.name}`}
                                className="min-h-[34px] w-16 rounded-lg border border-[var(--line-2)] bg-[#051E22] px-2 text-[12.5px] tabular-nums focus:border-[var(--clay)] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  onSaveStock(
                                    p.id,
                                    Number(stockDrafts[p.id] ?? p.stock)
                                  )
                                }
                                className="min-h-[34px] rounded-lg border border-[var(--line-2)] px-3 text-[12px] font-medium text-[var(--ink-2)] hover:border-[var(--clay)]"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span className="text-[12px] text-[var(--muted)]">View only</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'returns' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <KpiBox
                label="Open requests"
                value={String(tickets.length)}
                delta="0"
                note="this week"
                spark={[2, 3, 2, 4, 3, 3, 4, 3, 2, 3]}
              />
              <KpiBox
                label="Refunds pending"
                value="2"
                delta="-1"
                note="to settle"
                spark={[4, 3, 4, 3, 3, 2, 3, 2, 2, 2]}
              />
              <KpiBox
                label="Reviews"
                value="38"
                delta="+6"
                note="this month"
                spark={[26, 28, 30, 29, 33, 34, 33, 36, 37, 38]}
              />
              <KpiBox
                label="Average rating"
                value="4.8"
                delta="+0.1"
                note="out of 5"
                spark={[4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.8, 4.8, 4.8, 4.8]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">
                      Customer requests
                    </h3>
                    <p className="text-[12.5px] text-[var(--muted)]">
                      Returns, refunds and product issues
                    </p>
                  </div>
                  <span className="text-[12px] text-[var(--muted)]">Live</span>
                </div>
                {tickets.length === 0 ? (
                  <p className="text-[13px] text-[var(--muted)]">
                    Nothing open. Customer requests from the storefront land here.
                  </p>
                ) : (
                  <ul className="divide-y divide-[var(--line)]">
                    {tickets.map((t, i) => (
                      <li key={i} className="flex items-center justify-between py-2.5">
                        <div>
                          <strong className="block text-[13px] font-medium text-[var(--ink)]">
                            {t.type}
                          </strong>
                          <span className="text-[11.5px] text-[var(--muted)]">{t.date}</span>
                        </div>
                        <span className="text-[12px] font-medium text-[var(--clay-2)]">
                          {t.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <h3 className="mb-2 text-[15.5px] font-semibold text-[var(--ink)]">
                  Recent reviews
                </h3>
                <ul className="divide-y divide-[var(--line)]">
                  {[
                    {
                      score: '5.0',
                      quote: '“The thali is heavier than I expected, in a good way.”',
                      item: 'Pooja Thali Set · verified',
                    },
                    {
                      score: '5.0',
                      quote: '“Packed so well I kept the box.”',
                      item: 'Brass Diya Pair · verified',
                    },
                    {
                      score: '3.0',
                      quote: '“Lovely mala, delivery was a day late.”',
                      item: 'Rudraksha Mala · verified',
                    },
                  ].map((rev) => (
                    <li key={rev.quote} className="flex items-start gap-3 py-3">
                      <span className="text-[12.5px] font-semibold text-[var(--clay-2)] tabular-nums">
                        {rev.score}
                      </span>
                      <div>
                        <strong className="block text-[13px] font-medium text-[var(--ink)]">
                          {rev.quote}
                        </strong>
                        <span className="text-[11.5px] text-[var(--muted)]">{rev.item}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        {activeSection === 'customers' && (
          <div className="space-y-4">
            {(() => {
              const totalCoins = customerCoinRows.reduce((s, r) => s + r.coins, 0);
              const totalUsed = customerCoinRows.reduce((s, r) => s + r.used, 0);
              const totalEarned = customerCoinRows.reduce((s, r) => s + r.earned, 0);
              const avg = Math.round(totalCoins / customerCoinRows.length);
              return (
                <>
                  <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                    <KpiBox
                      label="Coins outstanding"
                      value={totalCoins.toLocaleString('en-IN')}
                      delta={`₹${totalCoins.toLocaleString('en-IN')}`}
                      note="unredeemed liability"
                      spark={[820, 900, 880, 960, 1020, 1100, 1060, 1180, 1240, 1310]}
                    />
                    <KpiBox
                      label="Coins redeemed"
                      value={totalUsed.toLocaleString('en-IN')}
                      delta={`${Math.round((totalUsed / totalEarned) * 100)}%`}
                      note="of coins earned"
                      spark={[240, 300, 340, 380, 420, 460, 500, 540, 580, 620]}
                    />
                    <KpiBox
                      label="Average balance"
                      value={avg.toLocaleString('en-IN')}
                      delta={String(customerCoinRows.length)}
                      note="active accounts"
                      spark={[120, 140, 150, 160, 170, 165, 175, 180, 172, 176]}
                    />
                    <KpiBox
                      label="Referral joins"
                      value={String(customerCoinRows.reduce((s, r) => s + r.referrals, 0))}
                      delta="+2"
                      note="this month"
                      spark={[2, 3, 3, 4, 4, 5, 5, 6, 6, 6]}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.9fr]">
                    <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">
                            Coins by customer
                          </h3>
                          <p className="text-[12.5px] text-[var(--muted)]">
                            Balance, earned and redeemed per account
                          </p>
                        </div>
                        <span className="text-[12px] text-[var(--muted)]">
                          {customerCoinRows.length} accounts
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[540px] border-collapse text-[13.5px]">
                          <thead>
                            <tr className="border-b border-[var(--line)] text-left text-[10.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                              <th className="px-2 pb-2.5">Customer</th>
                              <th className="px-2 pb-2.5">Code</th>
                              <th className="px-2 pb-2.5 text-right">Balance</th>
                              <th className="px-2 pb-2.5 text-right">Earned</th>
                              <th className="px-2 pb-2.5 text-right">Used</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--line)]">
                            {customerCoinRows.map((row) => (
                              <tr key={row.code}>
                                <td className="px-2 py-3">
                                  <strong className="block text-[var(--ink)]">{row.name}</strong>
                                  <span className="text-[11.5px] text-[var(--muted)]">{row.city}</span>
                                </td>
                                <td className="px-2 py-3 font-medium text-[var(--ink-2)]">
                                  {row.code}
                                </td>
                                <td className="px-2 py-3 text-right font-semibold text-[var(--clay-2)] tabular-nums">
                                  <span className="inline-flex items-center gap-1">
                                    <Coins className="h-3.5 w-3.5" />
                                    {row.coins.toLocaleString('en-IN')}
                                  </span>
                                </td>
                                <td className="px-2 py-3 text-right tabular-nums">
                                  {row.earned.toLocaleString('en-IN')}
                                </td>
                                <td className="px-2 py-3 text-right tabular-nums">
                                  {row.used.toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                      <h3 className="mb-1 text-[15.5px] font-semibold text-[var(--ink)]">
                        Top customers
                      </h3>
                      <p className="mb-3 text-[12.5px] text-[var(--muted)]">By lifetime value</p>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[260px] border-collapse text-[13.5px]">
                          <thead>
                            <tr className="border-b border-[var(--line)] text-left text-[10.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                              <th className="pb-2">Customer</th>
                              <th className="pb-2 text-right">Orders</th>
                              <th className="pb-2 text-right">Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--line)]">
                            {[
                              ['Meera Iyer', 'Chennai', '9', '₹7,420'],
                              ['Rohit Sharma', 'Pune', '7', '₹5,180'],
                              ['Ananya Das', 'Kolkata', '6', '₹4,930'],
                              ['Kavita Rao', 'Hyderabad', '5', '₹3,860'],
                            ].map(([n, c, o, v]) => (
                              <tr key={n}>
                                <td className="py-2.5">
                                  <strong className="block text-[var(--ink)]">{n}</strong>
                                  <span className="text-[11.5px] text-[var(--muted)]">{c}</span>
                                </td>
                                <td className="py-2.5 text-right tabular-nums">{o}</td>
                                <td className="py-2.5 text-right font-medium tabular-nums">{v}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {activeSection === 'marketing' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <KpiBox
                label="Campaign reach"
                value="42.8K"
                delta="+9.6%"
                note="last 30 days"
                spark={[26, 28, 27, 31, 34, 36, 35, 39, 41, 42]}
              />
              <KpiBox
                label="Ad spend"
                value="₹18,400"
                delta="+4.2%"
                note="last 30 days"
                spark={[12, 13, 12, 15, 14, 16, 15, 17, 18, 18]}
              />
              <KpiBox
                label="Store visits"
                value="8,920"
                delta="+11.3%"
                note="last 30 days"
                spark={[4, 4.6, 5.2, 5, 6.1, 6.4, 6.8, 7.6, 8.2, 8.9]}
              />
              <KpiBox
                label="Conversion"
                value="3.8%"
                delta="+0.4%"
                note="visits to orders"
                spark={[2.8, 3, 3.1, 3.2, 3.1, 3.4, 3.5, 3.6, 3.7, 3.8]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Channels</h3>
                <p className="mb-4 text-[12.5px] text-[var(--muted)]">Share of new customers</p>
                <div className="space-y-3">
                  {[
                    ['Instagram', 82],
                    ['Meta ads', 67],
                    ['Google', 54],
                    ['WhatsApp', 76],
                  ].map(([label, pct]) => (
                    <div key={String(label)} className="grid grid-cols-[86px_1fr_38px] items-center gap-3 text-[12.5px]">
                      <span className="text-[var(--muted)]">{label}</span>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--paper-2)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--sage)] to-[var(--clay)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <strong className="text-right font-semibold text-[var(--ink-2)] tabular-nums">
                        {pct}%
                      </strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Campaign planner</h3>
                <p className="mb-3 text-[12.5px] text-[var(--muted)]">Draft a festive push</p>
                {can('campaign_edit') ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={campaignDraft}
                      onChange={(e) => setCampaignDraft(e.target.value)}
                      placeholder="Diwali collection"
                      className="min-h-[40px] flex-1 rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3 text-[14px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!campaignDraft.trim()) {
                          onToast('Name the campaign first');
                          return;
                        }
                        onCreateCampaign(campaignDraft.trim());
                        setCampaignDraft('');
                      }}
                      className="btn-gold min-h-[40px] shrink-0 rounded-xl px-4 text-[13px]"
                    >
                      Create draft
                    </button>
                  </div>
                ) : (
                  <span className="text-[12px] text-[var(--muted)]">View only access</span>
                )}
                <div className="mt-4 divide-y divide-[var(--line)]">
                  {campaigns.length === 0 ? (
                    <p className="text-[12.5px] text-[var(--muted)]">No drafts yet.</p>
                  ) : (
                    campaigns.map((c, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 text-[13px]">
                        <span className="text-[var(--ink)]">{c}</span>
                        <span className="text-[11.5px] font-medium text-[var(--muted)]">Draft</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeSection === 'hr' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <KpiBox label="Team members" value="12" delta="+1" note="this quarter" spark={[9, 9, 10, 10, 10, 11, 11, 11, 12, 12]} />
              <KpiBox label="Operations" value="5" delta="0" note="steady" spark={[5, 5, 5, 5, 5, 5, 5, 5, 5, 5]} />
              <KpiBox label="Marketing" value="4" delta="+1" note="hiring content" spark={[3, 3, 3, 3, 4, 4, 4, 4, 4, 4]} />
              <KpiBox label="Finance" value="3" delta="0" note="steady" spark={[2, 2, 2, 3, 3, 3, 3, 3, 3, 3]} />
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Responsibilities</h3>
                  <p className="text-[12.5px] text-[var(--muted)]">Who owns what</p>
                </div>
                {can('staff_manage') && (
                  <button
                    type="button"
                    onClick={() => onToast('Invite flow is outside this demo')}
                    className="min-h-[34px] rounded-lg border border-[var(--line-2)] px-3.5 text-[12.5px] font-medium text-[var(--ink-2)] hover:border-[var(--clay)]"
                  >
                    Invite member
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] border-collapse text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-left text-[10.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                      <th className="px-3 pb-2.5">Department</th>
                      <th className="px-3 pb-2.5">Roles</th>
                      <th className="px-3 pb-2.5">Core responsibility</th>
                      <th className="px-3 pb-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {[
                      ['Operations', 'Ops admin, packers, delivery', 'Orders, stock, dispatch', 'Active'],
                      ['Marketing', 'Marketing admin, content, care', 'Campaigns, social, support', 'Active'],
                      ['Finance', 'Finance admin, accountant', 'Accounts, settlements, compliance', 'Active'],
                      ['Spiritual services', 'Coordinator, pandit network', 'Bookings and confirmations', 'Part time'],
                    ].map(([dept, roles, resp, st]) => (
                      <tr key={dept}>
                        <td className="px-3 py-3 font-semibold text-[var(--ink)]">{dept}</td>
                        <td className="px-3 py-3 text-[var(--ink-2)]">{roles}</td>
                        <td className="px-3 py-3 text-[var(--muted)]">{resp}</td>
                        <td className="px-3 py-3">
                          <StatusLabel status={st === 'Active' ? 'Confirmed' : 'Scheduled'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'spiritual' && (() => {
          const bookings = orders.filter((o) => o.kind === 'Service');
          const rev = bookings.reduce((s, o) => s + o.amount, 0);
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                <KpiBox label="Service bookings" value={String(bookings.length)} delta="+1" note="all time" spark={[2, 3, 3, 4, 4, 5, 5, 6, 6, 7]} />
                <KpiBox
                  label="Upcoming"
                  value={String(bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Scheduled').length)}
                  delta="+2"
                  note="this week"
                  spark={[2, 2, 3, 3, 3, 4, 4, 4, 5, 5]}
                />
                <KpiBox label="Service revenue" value={formatMoney(rev)} delta="+₹1,100" note="paid online" spark={[400, 600, 800, 900, 1200, 1400, 1600, 1800, 2000, 2200]} />
                <KpiBox label="Next slot" value="6:30 pm" delta="+3h" note="from now" spark={[6, 6, 6, 6, 6, 6, 6, 6, 6, 6]} />
              </div>

              <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Bookings</h3>
                    <p className="text-[12.5px] text-[var(--muted)]">
                      Paid and confirmed. No callback queue.
                    </p>
                  </div>
                  <span className="text-[12px] font-medium text-[var(--sage)]">
                    {bookings.length} booked
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-left text-[10.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                        <th className="px-3 pb-2.5">Booking</th>
                        <th className="px-3 pb-2.5">Service</th>
                        <th className="px-3 pb-2.5">Customer</th>
                        <th className="px-3 pb-2.5">Slot</th>
                        <th className="px-3 pb-2.5 text-right">Paid</th>
                        <th className="px-3 pb-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {bookings.map((b) => (
                        <tr key={b.id}>
                          <td className="px-3 py-3 font-semibold text-[var(--ink)] tabular-nums">{b.id}</td>
                          <td className="px-3 py-3 text-[var(--ink-2)]">{b.items.split(' · ')[0]}</td>
                          <td className="px-3 py-3">
                            <span className="block text-[var(--ink)]">{b.person || 'Guest'}</span>
                            <span className="text-[11.5px] text-[var(--muted)]">{b.city || ''}</span>
                          </td>
                          <td className="px-3 py-3 text-[var(--ink-2)]">{b.when || b.date}</td>
                          <td className="px-3 py-3 text-right font-medium tabular-nums">
                            {formatMoney(b.amount)}
                          </td>
                          <td className="px-3 py-3">
                            <StatusLabel status={b.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          );
        })()}

        {activeSection === 'finance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <KpiBox label="Gross revenue" value="₹2,48,650" delta="+12.8%" note="last 30 days" spark={[42, 48, 45, 58, 54, 66, 61, 74, 70, 82]} />
              <KpiBox label="Settlements" value="₹1,92,400" delta="+9.1%" note="cleared" spark={[30, 34, 33, 40, 38, 45, 44, 50, 48, 55]} />
              <KpiBox label="Expenses" value="₹42,800" delta="+3.4%" note="last 30 days" spark={[18, 20, 19, 22, 21, 23, 22, 24, 23, 25]} />
              <KpiBox label="Unreconciled" value="₹13,450" delta="-2" note="needs a pass" spark={[20, 19, 18, 19, 17, 18, 16, 15, 14, 13]} />
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <h3 className="mb-1 text-[15.5px] font-semibold text-[var(--ink)]">
                Finance operations
              </h3>
              <p className="mb-4 text-[12.5px] text-[var(--muted)]">
                Workflows and the tools they need
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-left text-[10.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                      <th className="px-2 pb-2.5">Area</th>
                      <th className="px-2 pb-2.5">Workflow</th>
                      <th className="px-2 pb-2.5">Integration</th>
                      <th className="px-2 pb-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {[
                      ['Payments', 'Settlements and reconciliation', 'Razorpay / Cashfree', 'Not connected'],
                      ['Shipping', 'Charges and COD reconciliation', 'Shiprocket', 'Not connected'],
                      ['Accounting', 'Books, GST and invoices', 'Tally / Zoho Books', 'Not connected'],
                    ].map(([a, w, i, s]) => (
                      <tr key={a}>
                        <td className="px-2 py-3 font-semibold text-[var(--ink)]">{a}</td>
                        <td className="px-2 py-3 text-[var(--ink-2)]">{w}</td>
                        <td className="px-2 py-3 text-[var(--muted)]">{i}</td>
                        <td className="px-2 py-3 text-[12px] text-[var(--amber)]">{s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <KpiBox label="Sales report" value="Ready" delta="0" note="updated today" spark={[1, 2, 2, 3, 3, 3, 4, 4, 4, 4]} />
              <KpiBox label="Inventory report" value="Ready" delta="0" note="updated today" spark={[1, 2, 2, 2, 3, 3, 3, 4, 4, 4]} />
              <KpiBox label="Marketing report" value="Ready" delta="0" note="updated today" spark={[1, 1, 2, 2, 2, 3, 3, 3, 4, 4]} />
              <KpiBox label="Finance report" value="Ready" delta="0" note="updated today" spark={[1, 1, 1, 2, 2, 2, 3, 3, 3, 3]} />
            </div>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Business reports</h3>
              <p className="mb-4 text-[12.5px] text-[var(--muted)]">
                Founder summary, sales by period, product performance, acquisition, campaign ROI,
                returns and settlement.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {(['sales', 'inventory', 'marketing', 'finance'] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => downloadReport(kind)}
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-[var(--line-2)] px-4 text-[13px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span className="capitalize">{kind} report</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-[var(--muted)]">
                Downloads a CSV built from the sample data in this session.
              </p>
            </section>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Workspace</h3>
              <p className="mb-4 text-[12.5px] text-[var(--muted)]">Applies to the whole store</p>
              <div className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]">
                    Store name
                  </label>
                  <input
                    defaultValue="PoojaTatva"
                    disabled={!can('settings_edit')}
                    className="min-h-[42px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3 text-[14px] text-[var(--ink)] disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]">
                    Support email
                  </label>
                  <input
                    defaultValue="care@poojatatva.com"
                    disabled={!can('settings_edit')}
                    className="min-h-[42px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3 text-[14px] text-[var(--ink)] disabled:opacity-60"
                  />
                </div>
                {can('settings_edit') && (
                  <button
                    type="button"
                    onClick={() => onToast('Settings saved for this demo')}
                    className="btn-gold min-h-[40px] rounded-xl px-4 text-[13.5px]"
                  >
                    Save settings
                  </button>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
              <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">
                Security and access
              </h3>
              <p className="mb-3 text-[12.5px] text-[var(--muted)]">Demo safeguards</p>
              <div className="divide-y divide-[var(--line)]">
                {[
                  ['Two-step login', 'Required for admin roles', 'Demo only'],
                  ['Role permissions', 'Enforced in the interface', 'Active'],
                  ['Audit log', 'Last export 2 days ago', 'View'],
                  ['Data backup', 'Daily at 02:00 IST', 'Check'],
                ].map(([t, sub, action]) => (
                  <div key={t} className="flex items-center justify-between py-3">
                    <div>
                      <strong className="block text-[13px] font-medium text-[var(--ink)]">
                        {t}
                      </strong>
                      <span className="text-[12px] text-[var(--muted)]">{sub}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToast(`${t} is active in this workspace`)}
                      className="text-[12.5px] font-medium text-[var(--clay-2)] hover:underline"
                    >
                      {action}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
