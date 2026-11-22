import React, { useEffect, useState } from 'react';
import { AlertCircle, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import type{ CartLine, Order, Product, Tone, WalletState } from '../types';
import {
  RITUAL_CONFIG,
  SERVICES,
  coinsToRupees,
  formatMoney,
  maxRedeemable,
} from '../data/storeData';
import { playRitualSound, unlockAudio } from '../lib/audio';
import { ArtSvg } from './ArtSvg';

/* ---------- SLIDE-OVER SHOPPING BAG ---------- */
interface BagDrawerProps {
  open: boolean;
  cart: CartLine[];
  products: Product[];
  onClose: () => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  onGoShop: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  open,
  cart,
  products,
  onClose,
  onChangeQty,
  onRemoveItem,
  onCheckout,
  onGoShop,
}) => {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const subtotal = cart.reduce((sum, line) => {
    const p = products.find((item) => item.id === line.id);
    return sum + (p ? p.price * line.qty : 0);
  }, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#062529]/55 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bagTitle"
    >
      <div className="flex h-dvh w-full max-w-[430px] flex-col border-l border-[var(--line)] bg-[var(--paper)] shadow-[-40px_0_70px_-40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h2 id="bagTitle" className="font-serif-display text-[24px] font-normal text-[var(--ink)]">
            Your bag
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {cart.length === 0 ? (
            <div className="grid justify-items-center gap-2.5 py-20 text-center text-[var(--muted)]">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-2)]">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="font-serif-display text-[22px] text-[var(--ink)]">Your bag is empty</h3>
              <p className="max-w-[32ch] text-[13.5px]">
                Add a diya, a thali or something for the shelf.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoShop();
                }}
                className="mt-2 min-h-[38px] rounded-xl border border-[var(--line-2)] px-4 text-[13px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
              >
                Browse the collection
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
                    className="grid grid-cols-[62px_1fr_auto] items-center gap-3.5 py-4"
                  >
                    <div
                      className={`relative grid h-[70px] w-[62px] place-items-center overflow-hidden rounded-xl border border-[var(--line)] tone-${p.tone}`}
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <ArtSvg name={p.art} className="w-[64%] text-[var(--sage)]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-serif-display block truncate text-[18px] leading-tight text-[var(--ink)]">
                        {p.name}
                      </span>
                      <span className="mt-1 block text-[13px] font-semibold text-[var(--ink-2)] tabular-nums">
                        {formatMoney(p.price * line.qty)}
                      </span>
                    </div>
                    <div className="grid justify-items-end gap-1.5">
                      <div className="inline-flex items-center overflow-hidden rounded-lg border border-[var(--line-2)] bg-[var(--surface)]">
                        <button
                          type="button"
                          onClick={() => onChangeQty(p.id, -1)}
                          aria-label={`Remove one ${p.name}`}
                          className="grid h-7 w-7 place-items-center text-[var(--ink-2)] hover:bg-[var(--paper-2)]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[24px] text-center text-[12.5px] tabular-nums">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onChangeQty(p.id, 1)}
                          aria-label={`Add one ${p.name}`}
                          className="grid h-7 w-7 place-items-center text-[var(--ink-2)] hover:bg-[var(--paper-2)]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(p.id)}
                        className="text-[11px] text-[var(--muted)] hover:text-[var(--crimson)]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--line)] bg-[var(--surface)] px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[14.5px] text-[var(--ink-2)]">Subtotal</span>
            <strong className="text-[20px] font-semibold text-[var(--ink)] tabular-nums">
              {formatMoney(subtotal)}
            </strong>
          </div>
          <p className="mt-1 text-center text-[11.5px] text-[var(--muted)]">
            Delivery is calculated at checkout. GST included.
          </p>
          <button
            type="button"
            disabled={!cart.length}
            onClick={() => {
              onClose();
              onCheckout();
            }}
            className="btn-gold mt-3 min-h-[44px] w-full rounded-xl text-[14px] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Continue to checkout
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoShop();
            }}
            className="mt-1.5 min-h-[36px] w-full text-[13px] font-medium text-[var(--muted)] hover:text-[var(--clay)]"
          >
            Keep shopping
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- SERVICE BOOKING MODAL ---------- */
interface ServiceBookingModalProps {
  serviceName: string | null;
  wallet: WalletState;
  onClose: () => void;
  onConfirmBooking: (payload: {
    serviceName: string;
    price: number;
    person: string;
    phone: string;
    city: string;
    date: string;
    slot: string;
    note: string;
    redeemedCoins: number;
  }) => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  serviceName,
  wallet,
  onClose,
  onConfirmBooking,
}) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [person, setPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState(tomorrow);
  const [slot, setSlot] = useState('6:30 pm');
  const [note, setNote] = useState('');
  const [payMethod, setPayMethod] = useState('UPI (demo)');
  const [redeemCoins, setRedeemCoins] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!serviceName) return;
    setPerson('');
    setPhone('');
    setCity('');
    setDate(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    setSlot('6:30 pm');
    setNote('');
    setRedeemCoins(0);
    setErrors({});
    setSubmitting(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [serviceName, onClose]);

  if (!serviceName) return null;

  const service = SERVICES.find((s) => s.name === serviceName) || SERVICES[0];
  const ritualMeta = RITUAL_CONFIG[service.name] || RITUAL_CONFIG['Aaj Ki Pooja'];
  const cap = maxRedeemable(service.price, wallet.coins);
  const effectiveCoins = Math.min(redeemCoins, cap);
  const payable = Math.max(0, service.price - coinsToRupees(effectiveCoins));

  const validate = () => {
    const next: Record<string, string> = {};
    if (person.trim().length < 2) next.person = 'Enter the name we should book under.';
    if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''))) {
      next.phone = 'Enter a 10-digit Indian mobile number.';
    }
    if (city.trim().length < 2) next.city = 'Which city is the pooja in?';
    if (!date) next.date = 'Select a preferred date.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    unlockAudio();
    if (!validate() || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onConfirmBooking({
        serviceName: service.name,
        price: service.price,
        person: person.trim(),
        phone: phone.trim(),
        city: city.trim(),
        date,
        slot,
        note: note.trim(),
        redeemedCoins: effectiveCoins,
      });
    }, 750);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#062529]/65 p-3.5 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="serviceTitle"
    >
      <div className="flex max-h-[calc(100dvh-28px)] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.85)]">
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--clay)]/25 bg-[var(--clay)]/10">
              <ArtSvg name={ritualMeta.art} className="w-7 text-[var(--sage)]" />
            </span>
            <div>
              <h2 id="serviceTitle" className="font-serif-display text-[26px] font-normal leading-tight text-[var(--ink)]">
                {service.name}
              </h2>
              <p className="mt-1 text-[12.5px] text-[var(--muted)]">
                Choose a date and time, then pay. Confirmed instantly.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-3.5 overflow-y-auto px-5 py-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper-2)] px-4 py-3">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.11em] text-[var(--muted)]">
                  {service.meta}
                </span>
                <strong className="mt-0.5 block text-[21px] font-semibold text-[var(--ink)] tabular-nums">
                  {formatMoney(service.price)}
                </strong>
              </div>
              <span className="text-[12px] font-medium text-[var(--sage)]">
                Instant confirmation
              </span>
            </div>

            <div>
              <label
                htmlFor="servicePerson"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Your name
              </label>
              <input
                id="servicePerson"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                placeholder="Full name"
                className={`min-h-[44px] w-full rounded-xl border bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:outline-none ${
                  errors.person ? 'border-[var(--crimson)]' : 'border-[var(--line-2)] focus:border-[var(--clay)]'
                }`}
              />
              {errors.person && (
                <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[var(--clay-2)]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.person}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="servicePhone"
                  className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Mobile number
                </label>
                <input
                  id="servicePhone"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className={`min-h-[44px] w-full rounded-xl border bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:outline-none ${
                    errors.phone ? 'border-[var(--crimson)]' : 'border-[var(--line-2)] focus:border-[var(--clay)]'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[var(--clay-2)]">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="serviceCity"
                  className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  City
                </label>
                <input
                  id="serviceCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className={`min-h-[44px] w-full rounded-xl border bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:outline-none ${
                    errors.city ? 'border-[var(--crimson)]' : 'border-[var(--line-2)] focus:border-[var(--clay)]'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[var(--clay-2)]">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="serviceDate"
                  className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Date
                </label>
                <input
                  id="serviceDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="serviceSlot"
                  className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
                >
                  Time slot
                </label>
                <select
                  id="serviceSlot"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="select-clean min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
                >
                  <option>6:30 am</option>
                  <option>9:00 am</option>
                  <option>12:00 pm</option>
                  <option>6:30 pm</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="serviceNote"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Anything we should know
              </label>
              <textarea
                id="serviceNote"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Occasion, language, number of people"
                className="w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] p-3 text-[14.5px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="servicePay"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Payment method
              </label>
              <select
                id="servicePay"
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="select-clean min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
              >
                <option>UPI (demo)</option>
                <option>Card (demo)</option>
                <option>Netbanking (demo)</option>
              </select>
            </div>

            <div className="rounded-xl border border-[var(--clay)]/25 bg-[var(--clay)]/[0.05] p-3.5">
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
          </div>

          <div className="border-t border-[var(--line)] bg-[var(--surface)] px-5 pb-4 pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold min-h-[44px] w-full rounded-xl text-[14px] disabled:opacity-60"
            >
              {submitting ? 'Processing payment…' : `Pay ${formatMoney(payable)} & confirm`}
            </button>
            <p className="mt-2 text-center text-[11.5px] text-[var(--muted)]">
              Demo payment. No real money is charged.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- RITUAL CONFIRMATION MODAL ---------- */
interface RitualConfirmModalProps {
  order: Order | null;
  serviceName: string | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const RitualConfirmModal: React.FC<RitualConfirmModalProps> = ({
  order,
  serviceName,
  onClose,
  onViewOrders,
}) => {
  useEffect(() => {
    if (!order || !serviceName) return;
    const cfg = RITUAL_CONFIG[serviceName] || RITUAL_CONFIG['Aaj Ki Pooja'];
    playRitualSound(cfg.sound);
    const timer = window.setTimeout(onClose, 7000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [order, serviceName, onClose]);

  if (!order || !serviceName) return null;
  const cfg = RITUAL_CONFIG[serviceName] || RITUAL_CONFIG['Aaj Ki Pooja'];

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-3.5 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ritualTitle"
    >
      <div className="w-full max-w-[540px] overflow-hidden rounded-[22px] border border-[var(--line-2)] bg-[#062529] shadow-[0_60px_120px_-40px_#000]">
        <div className="relative h-[240px] overflow-hidden bg-[radial-gradient(80%_80%_at_50%_42%,#B82E1E,#062529_78%)] sm:h-[290px]">
          {cfg.kind === 'jal' ? (
            <>
              <span className="scene-glow jal-glow" />
              <span className="jal-stream" />
              <span className="jal-drop" />
              <span className="jal-drop d2" />
              <span className="jal-drop d3" />
              <span className="jal-surface" />
              <span className="ripple r1" />
              <span className="ripple r2" />
              <span className="ripple r3" />
              <ArtSvg
                name={cfg.art}
                className="absolute left-1/2 top-[62%] w-[140px] -translate-x-1/2 -translate-y-1/2 text-[var(--sage)] drop-shadow-[0_14px_26px_rgba(0,0,0,0.65)]"
              />
            </>
          ) : cfg.kind === 'prasad' ? (
            <>
              <span className="scene-glow" />
              <span className="petal p1" />
              <span className="petal p2" />
              <span className="petal p3" />
              <span className="petal p4" />
              <span className="petal p5" />
              <ArtSvg
                name={cfg.art}
                className="absolute left-1/2 top-[58%] w-[140px] -translate-x-1/2 -translate-y-1/2 text-[var(--sage)] drop-shadow-[0_14px_26px_rgba(0,0,0,0.65)]"
              />
            </>
          ) : (
            <>
              <span className="scene-glow" />
              <span className="halo h1" />
              <span className="halo h2" />
              <span className="halo h3" />
              <span className="ember e1" />
              <span className="ember e2" />
              <span className="ember e3" />
              <ArtSvg
                name={cfg.art}
                className="absolute left-1/2 top-[52%] w-[160px] -translate-x-1/2 -translate-y-1/2 text-[var(--sage)] drop-shadow-[0_14px_26px_rgba(0,0,0,0.65)]"
              />
            </>
          )}
        </div>

        <div className="px-6 py-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Booking confirmed
          </p>
          <h2 id="ritualTitle" className="font-serif-display mt-1 text-[30px] font-normal text-[var(--ink)]">
            {serviceName}
          </h2>
          <span className="mt-2 inline-block text-[11px] font-semibold tracking-[0.12em] text-[var(--clay-2)] tabular-nums">
            {order.id}
          </span>
          <p className="mx-auto mt-2.5 max-w-[42ch] text-[13px] leading-relaxed text-[var(--muted)]">
            Booked for {order.when}. Payment received, and the confirmation is in My orders.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="btn-gold min-h-[42px] rounded-xl px-5 text-[13.5px]"
            >
              View my orders
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] rounded-xl border border-[var(--line-2)] px-5 text-[13.5px] font-medium text-[var(--ink)] hover:border-[var(--clay)]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- ADD PRODUCT MODAL (ADMIN) ---------- */
interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSaveProduct: (payload: {
    name: string;
    price: number;
    category: Product['category'];
    stock: number;
    tone: Tone;
    desc: string;
  }) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSaveProduct,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Product['category']>('Pooja Essentials');
  const [stock, setStock] = useState('12');
  const [tone, setTone] = useState<Tone>('sand');
  const [desc, setDesc] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(price);
    if (!name.trim() || !Number.isFinite(numPrice) || numPrice <= 0) return;
    onSaveProduct({
      name: name.trim(),
      price: numPrice,
      category,
      stock: Number(stock) || 0,
      tone,
      desc: desc.trim() || 'Newly added to the catalogue.',
    });
    setName('');
    setPrice('');
    setDesc('');
    setStock('12');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#062529]/65 p-3.5 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="productModalTitle"
    >
      <div className="w-full max-w-[500px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="productModalTitle" className="font-serif-display text-[26px] font-normal text-[var(--ink)]">
              Add a product
            </h2>
            <p className="mt-1 text-[13px] text-[var(--muted)]">
              It appears in the catalogue and storefront right away.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label
              htmlFor="prodName"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
            >
              Product name
            </label>
            <input
              id="prodName"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brass camphor holder"
              className="min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="prodPrice"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Price in ₹
              </label>
              <input
                id="prodPrice"
                required
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="499"
                className="min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="prodCat"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Category
              </label>
              <select
                id="prodCat"
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="select-clean min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
              >
                <option>Pooja Essentials</option>
                <option>Spiritual Wellness</option>
                <option>Gifts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="prodStock"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Opening stock
              </label>
              <input
                id="prodStock"
                inputMode="numeric"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="prodTone"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
              >
                Display tone
              </label>
              <select
                id="prodTone"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="select-clean min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
              >
                <option value="sand">Sand</option>
                <option value="clay">Clay</option>
                <option value="sage">Sage</option>
                <option value="stone">Stone</option>
                <option value="rose">Rose</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="prodDesc"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]"
            >
              Short description
            </label>
            <input
              id="prodDesc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="One line for the card"
              className="min-h-[44px] w-full rounded-xl border border-[var(--line-2)] bg-[#051E22] px-3.5 text-[15px] text-[var(--ink)] focus:border-[var(--clay)] focus:outline-none"
            />
          </div>

          <button type="submit" className="btn-gold mt-2 min-h-[44px] w-full rounded-xl text-[14px]">
            Add to catalogue
          </button>
        </form>
      </div>
    </div>
  );
};
