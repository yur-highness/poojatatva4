import React, { useState } from 'react';
import { Check, Coins, ShoppingBag } from 'lucide-react';
import type{
  CartLine,
  Order,
  PageId,
  Product,
  ProfileState,
  WalletState,
} from '../types';
import { coinsToRupees, formatMoney, maxRedeemable } from '../data/storeData';

/* ---------- STATUS TEXT HELPER ---------- */
export const StatusLabel: React.FC<{ status: string }> = ({ status }) => {
  const colorMap: Record<string, string> = {
    Delivered: 'text-[var(--sage)]',
    Completed: 'text-[var(--sage)]',
    Confirmed: 'text-[var(--sage)]',
    Scheduled: 'text-[var(--clay-2)]',
    Processing: 'text-[var(--clay-2)]',
    'Order received': 'text-[var(--clay-2)]',
    Shipped: 'text-[var(--ink-2)]',
    Cancelled: 'text-[var(--crimson)]',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${colorMap[status] || 'text-[var(--ink-2)]'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};

/* ---------- CHECKOUT PAGE ---------- */
interface CheckoutPageProps {
  cart: CartLine[];
  products: Product[];
  wallet: WalletState;
  profile: ProfileState;
  onOpenBag: () => void;
  onGoShop: () => void;
  onPlaceOrder: (payload: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: string;
    redeemedCoins: number;
  }) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  products,
  wallet,
  profile,
  onOpenBag,
  onGoShop,
  onPlaceOrder,
}) => {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on delivery (demo)');
  const [redeemCoins, setRedeemCoins] = useState(0);

  const subtotal = cart.reduce((sum, line) => {
    const p = products.find((item) => item.id === line.id);
    return sum + (p ? p.price * line.qty : 0);
  }, 0);

  const cap = maxRedeemable(subtotal, wallet.coins);
  const effectiveCoins = Math.min(redeemCoins, cap);
  const payable = Math.max(0, subtotal - coinsToRupees(effectiveCoins));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;
    onPlaceOrder({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      paymentMethod,
      redeemedCoins: effectiveCoins,
    });
  };

  return (
    <section className="mx-auto w-full max-w-[1220px] px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-12 lg:px-12">
      <div className="pb-6">
        <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
          <span>Almost there</span>
        </p>
        <h1 className="font-serif-display text-[clamp(30px,7vw,52px)] font-normal leading-[1.04] text-[var(--ink)]">
          Checkout
        </h1>
        <p className="mt-2.5 text-[14px] text-[var(--muted)] sm:text-[14.5px]">
          Delivery details for your demo order. Nothing is charged and no message is sent.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2.5 text-[12px] text-[var(--muted)]">
        <span className="inline-flex items-center gap-2 text-[var(--ink)]">
          <b className="grid h-5 w-5 place-items-center rounded-full bg-[var(--clay)] text-[var(--gold-ink)]">
            <Check className="h-3 w-3" />
          </b>
          Bag
        </span>
        <span className="h-px w-6 bg-[var(--line-2)]" />
        <span className="inline-flex items-center gap-2 text-[var(--ink)]">
          <b className="grid h-5 w-5 place-items-center rounded-full border border-[var(--clay)] text-[10.5px] text-[var(--clay)]">
            2
          </b>
          Delivery
        </span>
        <span className="h-px w-6 bg-[var(--line-2)]" />
        <span className="inline-flex items-center gap-2">
          <b className="grid h-5 w-5 place-items-center rounded-full border border-[var(--line-2)] text-[10.5px]">
            3
          </b>
          Done
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.35fr_0.75fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7"
        >
          <h2 className="text-[16px] font-semibold text-[var(--ink)]">Delivery information</h2>
          <p className="mt-0.5 text-[12.5px] text-[var(--muted)]">
            We only ask for what the courier needs.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="checkoutName"
                className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Full name
              </label>
              <input
                id="checkoutName"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="min-h-[46px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="checkoutPhone"
                  className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Mobile number
                </label>
                <input
                  id="checkoutPhone"
                  required
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="min-h-[46px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="checkoutEmail"
                  className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Email
                </label>
                <input
                  id="checkoutEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-h-[46px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="checkoutAddress"
                className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Delivery address
              </label>
              <textarea
                id="checkoutAddress"
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, street, locality"
                className="w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] p-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="checkoutCity"
                  className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  City and PIN code
                </label>
                <input
                  id="checkoutCity"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City, PIN code"
                  className="min-h-[46px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Payment method
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="select-clean min-h-[46px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                >
                  <option>Cash on delivery (demo)</option>
                  <option>UPI (demo only)</option>
                  <option>Card (demo only)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!cart.length}
            className="btn-gold mt-6 min-h-[46px] w-full rounded-xl px-5 text-[14px] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Place demo order
          </button>
          <p className="mt-2.5 text-[12px] text-[var(--muted)]">
            Demo checkout. Payment gateways and shipping are not connected.
          </p>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-[calc(var(--header)+20px)]">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15.5px] font-semibold text-[var(--ink)]">Your order</h3>
              <button
                type="button"
                onClick={onOpenBag}
                className="text-[13px] font-medium text-[var(--ink-2)] hover:text-[var(--clay)]"
              >
                Edit bag
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="grid justify-items-center gap-2 py-6 text-center text-[var(--muted)]">
                <ShoppingBag className="h-7 w-7 text-[var(--ink-2)]" />
                <p className="text-[13.5px]">Your bag is empty.</p>
                <button
                  type="button"
                  onClick={onGoShop}
                  className="mt-1 rounded-lg border border-[var(--line-2)] px-3.5 py-1.5 text-[12.5px] text-[var(--ink)] hover:border-[var(--clay)]"
                >
                  Browse products
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--line)]">
                {cart.map((line) => {
                  const p = products.find((item) => item.id === line.id);
                  if (!p) return null;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 py-2.5 text-[13.5px] text-[var(--ink-2)]"
                    >
                      <span>
                        {p.name} × {line.qty}
                      </span>
                      <strong className="font-semibold text-[var(--ink)] tabular-nums">
                        {formatMoney(p.price * line.qty)}
                      </strong>
                    </div>
                  );
                })}
                {effectiveCoins > 0 && (
                  <div className="flex items-center justify-between gap-3 py-2.5 text-[13.5px] text-[var(--sage)]">
                    <span>Pooja coins · {effectiveCoins}</span>
                    <strong className="font-semibold tabular-nums">
                      −{formatMoney(coinsToRupees(effectiveCoins))}
                    </strong>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 rounded-xl border border-[var(--clay)]/25 bg-[var(--clay)]/[0.05] p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-[13px] font-semibold text-[var(--ink)]">
                  Use Pooja coins
                </strong>
                <span className="text-[11.5px] text-[var(--muted)] tabular-nums">
                  {wallet.coins} available · up to {cap}
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={cap}
                  value={effectiveCoins}
                  onChange={(e) => {
                    const v = Math.floor(Number(e.target.value) || 0);
                    setRedeemCoins(Math.max(0, Math.min(cap, v)));
                  }}
                  aria-label="Coins to redeem"
                  className="min-h-[36px] w-24 rounded-lg border border-[var(--line-2)] bg-[#051E22] px-2.5 text-right text-[13px] tabular-nums focus:border-[var(--clay)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setRedeemCoins(cap)}
                  className="min-h-[32px] rounded-lg border border-[var(--line-2)] bg-[#B82E1E] px-3 text-[11.5px] font-semibold text-[#FDF2DA] hover:border-[#FDF2DA]"
                >
                  Use max
                </button>
                <span className="ml-auto text-[12px] text-[var(--muted)] tabular-nums">
                  −{formatMoney(coinsToRupees(effectiveCoins))}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
              <span className="text-[14.5px] text-[var(--ink-2)]">Total</span>
              <strong className="text-[21px] font-semibold text-[var(--ink)] tabular-nums">
                {formatMoney(payable)}
              </strong>
            </div>
            <p className="mt-2.5 text-[12px] text-[var(--muted)]">Free delivery on this order.</p>
          </div>
        </aside>
      </div>
    </section>
  );
};

/* ---------- SUCCESS PAGE ---------- */
export const OrderSuccessPage: React.FC<{
  orderId: string;
  copy: string;
  onNavigate: (page: PageId) => void;
  onGoShop: () => void;
}> = ({ orderId, copy, onNavigate, onGoShop }) => (
  <section className="mx-auto grid w-full max-w-[1220px] place-items-center px-4 py-14 text-center sm:px-10 sm:py-28">
    <span className="mb-5 grid h-16 w-16 place-items-center rounded-full border border-[var(--sage)]/35 bg-[var(--sage)]/12 text-[var(--sage)]">
      <Check className="h-7 w-7" />
    </span>
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
      Order received
    </p>
    <h1 className="font-serif-display text-balance text-[clamp(34px,4.6vw,52px)] font-normal leading-[1.03] text-[var(--ink)]">
      Your order is in,
      <br />
      and we have it.
    </h1>
    <p className="mt-4 max-w-[44ch] text-[14.5px] leading-relaxed text-[var(--muted)]">{copy}</p>
    <span className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--clay-2)] tabular-nums">
      {orderId}
    </span>
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onClick={() => onNavigate('c-orders')}
        className="btn-gold min-h-[44px] rounded-xl px-5 text-[14px]"
      >
        View my orders
      </button>
      <button
        type="button"
        onClick={onGoShop}
        className="min-h-[44px] rounded-xl border border-[var(--line-2)] bg-[var(--surface)] px-5 text-[14px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
      >
        Keep shopping
      </button>
    </div>
  </section>
);

/* ---------- ORDERS PAGE ---------- */
export const OrdersPage: React.FC<{ orders: Order[]; onGoShop: () => void }> = ({
  orders,
  onGoShop,
}) => (
  <section className="mx-auto w-full max-w-[1220px] px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-12 lg:px-12">
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6 sm:pb-8">
      <div>
        <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
          <span>Your account</span>
        </p>
        <h1 className="font-serif-display text-[clamp(30px,7vw,52px)] font-normal leading-[1.04] text-[var(--ink)]">
          My orders
        </h1>
        <p className="mt-2.5 max-w-[50ch] text-[14px] text-[var(--muted)] sm:text-[14.5px]">
          Live demo orders placed in this session, plus earlier ones showing fulfillment states.
        </p>
      </div>
      <button
        type="button"
        onClick={onGoShop}
        className="min-h-[40px] rounded-xl border border-[var(--line-2)] bg-[var(--surface)] px-4 text-[13.5px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
      >
        Shop again
      </button>
    </div>

    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-[var(--line)] text-left text-[10.5px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
              <th className="px-3 pb-3">Order</th>
              <th className="px-3 pb-3">Date</th>
              <th className="px-3 pb-3">Items</th>
              <th className="px-3 pb-3 text-right">Amount</th>
              <th className="px-3 pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-[#125660]">
                <td className="px-3 py-3.5 font-semibold text-[var(--ink)] tabular-nums">
                  {order.id}
                </td>
                <td className="px-3 py-3.5 text-[var(--ink-2)] tabular-nums">{order.date}</td>
                <td className="px-3 py-3.5 text-[var(--ink-2)]">
                  <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    {order.kind} ·
                  </span>
                  {order.items}
                </td>
                <td className="px-3 py-3.5 text-right font-medium text-[var(--ink)] tabular-nums">
                  {formatMoney(order.amount)}
                </td>
                <td className="px-3 py-3.5">
                  <StatusLabel status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

/* ---------- ACCOUNT PAGE ---------- */
export const AccountPage: React.FC<{
  wallet: WalletState;
  profile: ProfileState;
  onSaveProfile: (next: ProfileState) => void;
  onNavigate: (page: PageId) => void;
  onToast: (msg: string) => void;
}> = ({ wallet, profile, onSaveProfile, onNavigate, onToast }) => {
  const [form, setForm] = useState<ProfileState>(profile);

  const copyReferral = async () => {
    const text = `Use my PoojaTatva code ${wallet.code} for ₹100 off your first pooja.`;
    try {
      await navigator.clipboard.writeText(text);
      onToast('Referral code copied');
    } catch {
      onToast(`Your code is ${wallet.code}`);
    }
  };

  const shareReferral = async () => {
    const text = `Use my PoojaTatva code ${wallet.code} for ₹100 off your first pooja.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'PoojaTatva', text });
        return;
      } catch {
        // fallback to copy
      }
    }
    copyReferral();
  };

  return (
    <section className="mx-auto w-full max-w-[1220px] px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-12 lg:px-12">
      <div className="pb-6 sm:pb-8">
        <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
          <span>Your details</span>
        </p>
        <h1 className="font-serif-display text-[clamp(30px,7vw,52px)] font-normal leading-[1.04] text-[var(--ink)]">
          My account
        </h1>
        <p className="mt-2.5 max-w-[50ch] text-[14px] text-[var(--muted)] sm:text-[14.5px]">
          Pooja coins, referrals, delivery defaults and support.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl border border-[#FDF2DA]/35 bg-[radial-gradient(90%_120%_at_100%_0%,rgba(247,202,107,0.22),transparent_62%),linear-gradient(155deg,#B82E1E,#083339)] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Pooja coins
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <strong className="font-serif-display text-[36px] font-normal leading-none text-[var(--clay-2)] tabular-nums sm:text-[42px]">
                    {wallet.coins.toLocaleString('en-IN')}
                  </strong>
                  <span className="text-[12px] uppercase tracking-[0.1em] text-[var(--muted)]">
                    coins
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] text-[var(--ink-2)]">
                  Worth {formatMoney(coinsToRupees(wallet.coins))} off your next booking or order.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--clay-2)]">
                <Coins className="h-4 w-4" />1 coin = ₹1
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--clay)]/20 pt-4">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Earned all time
                </span>
                <strong className="mt-0.5 block text-[16px] font-semibold text-[var(--ink)] tabular-nums">
                  {wallet.lifetimeEarned.toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Used so far
                </span>
                <strong className="mt-0.5 block text-[16px] font-semibold text-[var(--ink)] tabular-nums">
                  {wallet.lifetimeSpent.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
            <h3 className="text-[16px] font-semibold text-[var(--ink)]">Refer and earn</h3>
            <p className="mt-1 text-[13px] text-[var(--muted)]">
              They get ₹100 off their first pooja. You get 200 coins when they book.
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
              <code className="min-w-[140px] flex-1 rounded-xl border border-dashed border-[var(--clay)]/45 bg-[var(--clay)]/[0.07] py-2.5 text-center text-[14px] font-semibold tracking-[0.14em] text-[var(--clay-2)]">
                {wallet.code}
              </code>
              <button
                type="button"
                onClick={copyReferral}
                className="min-h-[42px] shrink-0 rounded-xl border border-[var(--line-2)] px-4 text-[13px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
              >
                Copy code
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[12px] text-[var(--muted)]">
                Your code works on any first booking above ₹101.
              </p>
              <button
                type="button"
                onClick={shareReferral}
                className="text-[12.5px] font-medium text-[var(--clay-2)] hover:underline"
              >
                Share link
              </button>
            </div>

            <ul className="mt-4 divide-y divide-[var(--line)] border-t border-[var(--line)]">
              {wallet.referrals.map((ref) => (
                <li key={ref.name} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <strong className="block text-[13.5px] font-medium text-[var(--ink)]">
                      {ref.name}
                    </strong>
                    <span className="text-[11.5px] text-[var(--muted)]">
                      {ref.date} · {ref.status}
                    </span>
                  </div>
                  <span
                    className={`text-[12.5px] font-semibold tabular-nums ${
                      ref.coins > 0 ? 'text-[var(--sage)]' : 'text-[var(--muted)]'
                    }`}
                  >
                    {ref.coins > 0 ? `+${ref.coins}` : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <h3 className="text-[16px] font-semibold text-[var(--ink)]">Coin history</h3>
            <p className="mt-0.5 text-[12.5px] text-[var(--muted)]">Every earn and redemption</p>
            <ul className="mt-3 divide-y divide-[var(--line)]">
              {wallet.ledger.map((row, idx) => (
                <li key={`${row.label}-${idx}`} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <strong className="block text-[13.5px] font-medium text-[var(--ink)]">
                      {row.label}
                    </strong>
                    <span className="text-[11.5px] text-[var(--muted)]">{row.date}</span>
                  </div>
                  <span
                    className={`text-[12.5px] font-semibold tabular-nums ${
                      row.coins > 0 ? 'text-[var(--sage)]' : 'text-[var(--muted)]'
                    }`}
                  >
                    {row.coins > 0 ? `+${row.coins}` : row.coins} coins
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <h3 className="text-[16px] font-semibold text-[var(--ink)]">Profile</h3>
            <p className="mt-0.5 text-[12.5px] text-[var(--muted)]">
              Used to prefill checkout in this demo.
            </p>
            <div className="mt-4 space-y-3.5">
              <div>
                <label
                  htmlFor="profileName"
                  className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Name
                </label>
                <input
                  id="profileName"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="min-h-[42px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3 text-[14.5px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="profilePhone"
                  className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Mobile
                </label>
                <input
                  id="profilePhone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="Your mobile number"
                  className="min-h-[42px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3 text-[14.5px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="profileEmail"
                  className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Email
                </label>
                <input
                  id="profileEmail"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Your email"
                  className="min-h-[42px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3 text-[14.5px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => onSaveProfile(form)}
                className="btn-gold min-h-[42px] rounded-xl px-5 text-[13.5px]"
              >
                Save profile
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--ink)]">Help and support</h3>
              <p className="text-[12.5px] text-[var(--muted)]">
                An order, product question or service booking.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('c-support')}
              className="min-h-[36px] shrink-0 rounded-lg border border-[var(--line-2)] px-3.5 text-[12.5px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
            >
              Contact
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--ink)]">Returns and refunds</h3>
              <p className="text-[12.5px] text-[var(--muted)]">Damaged, wrong or missing items.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('c-returns')}
              className="min-h-[36px] shrink-0 rounded-lg border border-[var(--line-2)] px-3.5 text-[12.5px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
            >
              Start a return
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--ink)]">Saved addresses</h3>
              <p className="text-[12.5px] text-[var(--muted)]">One address saved for this demo.</p>
            </div>
            <span className="text-[12.5px] font-medium text-[var(--ink-2)]">Home · Mumbai</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- RETURNS PAGE ---------- */
export const ReturnsPage: React.FC<{ onSubmitTicket: (type: string) => void }> = ({
  onSubmitTicket,
}) => {
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('Arrived damaged');
  const [detail, setDetail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitTicket(`Return request (${orderId || 'Order'})`);
    setOrderId('');
    setDetail('');
  };

  return (
    <section className="mx-auto w-full max-w-[1220px] px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-12 lg:px-12">
      <div className="pb-6 sm:pb-8">
        <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
          <span>We will sort it out</span>
        </p>
        <h1 className="font-serif-display text-[clamp(30px,7vw,52px)] font-normal leading-[1.04] text-[var(--ink)]">
          Returns and refunds
        </h1>
        <p className="mt-2.5 max-w-[50ch] text-[14px] text-[var(--muted)] sm:text-[14.5px]">
          Tell us what went wrong and the team replies within one working day.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-[620px] space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6"
      >
        <div>
          <label
            htmlFor="returnOrder"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
          >
            Order number
          </label>
          <input
            id="returnOrder"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="PT-1001"
            className="min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="returnReason"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
          >
            What happened
          </label>
          <select
            id="returnReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="select-clean min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
          >
            <option>Arrived damaged</option>
            <option>Wrong item received</option>
            <option>Something is missing</option>
            <option>Not as described</option>
            <option>Something else</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="returnDetail"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
          >
            Details
          </label>
          <textarea
            id="returnDetail"
            rows={4}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="A short description helps us fix it faster"
            className="w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] p-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
          />
        </div>
        <button type="submit" className="btn-gold min-h-[44px] rounded-xl px-5 text-[14px]">
          Submit return request
        </button>
      </form>
    </section>
  );
};

/* ---------- SUPPORT PAGE ---------- */
export const SupportPage: React.FC<{ onSubmitTicket: (type: string) => void }> = ({
  onSubmitTicket,
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('Order enquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitTicket(`Support ticket · ${topic}`);
    setName('');
    setContact('');
    setMessage('');
  };

  return (
    <section className="mx-auto w-full max-w-[1220px] px-4 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-12 lg:px-12">
      <div className="pb-6 sm:pb-8">
        <p className="mb-2.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-px w-6 bg-[var(--line-2)]" aria-hidden="true" />
          <span>Customer care</span>
        </p>
        <h1 className="font-serif-display text-[clamp(30px,7vw,52px)] font-normal leading-[1.04] text-[var(--ink)]">
          Contact support
        </h1>
        <p className="mt-2.5 max-w-[50ch] text-[14px] text-[var(--muted)] sm:text-[14.5px]">
          Real replies, from 9am to 7pm IST, Monday to Saturday.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-[620px] space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="supportName"
              className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
            >
              Your name
            </label>
            <input
              id="supportName"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="supportContact"
              className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
            >
              Email or mobile
            </label>
            <input
              id="supportContact"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="How we reply"
              className="min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="supportTopic"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
          >
            Topic
          </label>
          <select
            id="supportTopic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="select-clean min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
          >
            <option>Order enquiry</option>
            <option>Product information</option>
            <option>Spiritual service</option>
            <option>Payment issue</option>
            <option>Something else</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="supportMessage"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
          >
            Message
          </label>
          <textarea
            id="supportMessage"
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help"
            className="w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] p-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
          />
        </div>
        <button type="submit" className="btn-gold min-h-[44px] rounded-xl px-5 text-[14px]">
          Send message
        </button>
      </form>
    </section>
  );
};
