import  { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type{
  AdminSection,
  CartLine,
  Order,
  PageId,
  Product,
  ProfileState,
  RoleName,
  Ticket,
  Tone,
  WalletState,
} from './types';
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_WALLET,
  ROLE_PERMISSIONS,
  coinsToRupees,
  earnCoins,
} from './data/storeData';
import { stopAmbientSound, toggleAmbientSound } from './lib/audio';
import { ArtSvg } from './components/ArtSvg';
import { SacredArchClipDefs } from './components/SacredFrameCard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileTabbar } from './components/MobileTabbar';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ServicesPage } from './components/ServicesPage';
import {
  AccountPage,
  CheckoutPage,
  OrderSuccessPage,
  OrdersPage,
  ReturnsPage,
  SupportPage,
} from './components/CheckoutAndOrders';
import {
  AddProductModal,
  BagDrawer,
  RitualConfirmModal,
  ServiceBookingModal,
} from './components/Modals';
import { AdminWorkspace } from './components/AdminWorkspace';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const bgMandalaRef = useRef<HTMLImageElement | null>(null);
  const [loaderDone, setLoaderDone] = useState(false);
  const [activePage, setActivePage] = useState<PageId>('c-home');
  const [isScrolled, setIsScrolled] = useState(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET);
  const [profile, setProfile] = useState<ProfileState>({
    name: '',
    phone: '',
    email: '',
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [bagOpen, setBagOpen] = useState(false);
  const [bookingServiceName, setBookingServiceName] = useState<string | null>(null);
  const [ritualConfirm, setRitualConfirm] = useState<{
    order: Order;
    serviceName: string;
  } | null>(null);
  const [addProductOpen, setAddProductOpen] = useState(false);

  const [successInfo, setSuccessInfo] = useState<{ id: string; copy: string }>({
    id: 'PT-1004',
    copy: 'We will call to confirm delivery before anything leaves the studio.',
  });

  const [role, setRole] = useState<RoleName>('Super Admin');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [soundOn, setSoundOn] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  useEffect(() => {
    const t = window.setTimeout(() => setLoaderDone(true), 650);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const img = bgMandalaRef.current;
    if (!img) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1.08, rotation: 0, yPercent: 0 },
        {
          scale: 1.16,
          rotation: 14,
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.4,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [activePage]);

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const navigate = useCallback(
    (page: PageId) => {
      if (page === 'admin-app' && role === 'Customer') {
        showToast('Customer accounts cannot open the admin workspace.');
        return;
      }
      setBagOpen(false);
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [role, showToast]
  );

  const goShop = useCallback(() => {
    setCategoryFilter('all');
    navigate('c-shop');
  }, [navigate]);

  const filterShop = useCallback(
    (cat: string) => {
      setCategoryFilter(cat);
      navigate('c-shop');
    },
    [navigate]
  );

  const switchView = useCallback(
    (view: 'customer' | 'admin') => {
      if (view === 'admin') {
        if (role === 'Customer') {
          showToast('Customer accounts cannot open the admin workspace.');
          return;
        }
        const allowed = ROLE_PERMISSIONS[role].pages;
        if (!allowed.includes(adminSection)) {
          setAdminSection(allowed[0] || 'dashboard');
        }
        navigate('admin-app');
      } else {
        navigate('c-home');
      }
    },
    [role, adminSection, navigate, showToast]
  );

  const handleToggleSound = async () => {
    try {
      const next = await toggleAmbientSound();
      setSoundOn(next);
      if (next) showToast('Ambient sound on');
    } catch {
      setSoundOn(false);
      showToast('Sound could not start. Check site permissions.');
    }
  };

  const addCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { id, qty: 1 }];
    });
    showToast('Added to your bag');
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  };

  const applyWalletTransaction = (redeemed: number, earned: number, earnLabel: string) => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setWallet((prev) => {
      const actualSpend = Math.min(Math.floor(redeemed), prev.coins);
      const nextLedger = [...prev.ledger];
      if (actualSpend > 0) {
        nextLedger.unshift({ label: 'Redeemed at checkout', date: today, coins: -actualSpend });
      }
      if (earned > 0) {
        nextLedger.unshift({ label: earnLabel, date: today, coins: earned });
      }
      return {
        ...prev,
        coins: prev.coins - actualSpend + earned,
        lifetimeSpent: prev.lifetimeSpent + actualSpend,
        lifetimeEarned: prev.lifetimeEarned + earned,
        ledger: nextLedger,
      };
    });
  };

  const handlePlaceOrder = (payload: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: string;
    redeemedCoins: number;
  }) => {
    if (!cart.length) return;
    const subtotal = cart.reduce((sum, line) => {
      const p = products.find((item) => item.id === line.id);
      return sum + (p ? p.price * line.qty : 0);
    }, 0);
    const itemsLabel = cart
      .map((line) => {
        const p = products.find((item) => item.id === line.id);
        return p ? `${p.name} × ${line.qty}` : '';
      })
      .filter(Boolean)
      .join(', ');

    const payable = Math.max(0, subtotal - coinsToRupees(payload.redeemedCoins));
    const id = 'PT-' + (1001 + orders.filter((o) => o.kind === 'Product').length);
    const newOrder: Order = {
      id,
      kind: 'Product',
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      items: itemsLabel,
      amount: payable,
      coinsUsed: payload.redeemedCoins,
      status: 'Order received',
    };

    setOrders((prev) => [newOrder, ...prev]);
    applyWalletTransaction(payload.redeemedCoins, earnCoins(payable), `Order · ${id}`);
    setProfile({ name: payload.name, phone: payload.phone, email: payload.email });
    setSuccessInfo({
      id,
      copy: `Thank you, ${payload.name}. We will call ${payload.phone} to confirm delivery before anything leaves the studio.`,
    });
    setCart([]);
    navigate('c-success');
  };

  const handleConfirmBooking = (payload: {
    serviceName: string;
    price: number;
    person: string;
    phone: string;
    city: string;
    date: string;
    slot: string;
    note: string;
    redeemedCoins: number;
  }) => {
    const whenDate = new Date(payload.date + 'T12:00:00');
    const whenLabel = whenDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const payable = Math.max(0, payload.price - coinsToRupees(payload.redeemedCoins));
    const id = 'SV-' + (2044 + orders.filter((o) => o.kind === 'Service').length);
    const newOrder: Order = {
      id,
      kind: 'Service',
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      items: `${payload.serviceName} · ${payload.slot}`,
      amount: payable,
      coinsUsed: payload.redeemedCoins,
      status: 'Confirmed',
      person: payload.person,
      phone: payload.phone,
      city: payload.city,
      when: `${whenLabel} · ${payload.slot}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    applyWalletTransaction(
      payload.redeemedCoins,
      earnCoins(payable),
      `Booking · ${payload.serviceName}`
    );
    setBookingServiceName(null);
    setRitualConfirm({ order: newOrder, serviceName: payload.serviceName });
    showToast(`Booking confirmed · ${id}`);
  };

  const handleRoleChange = (nextRole: RoleName) => {
    setRole(nextRole);
    if (nextRole === 'Customer') {
      setAdminSection('dashboard');
      navigate('c-home');
      showToast('Switched to the customer view');
      return;
    }
    const allowed = ROLE_PERMISSIONS[nextRole].pages;
    if (!allowed.includes(adminSection)) {
      setAdminSection(allowed[0] || 'dashboard');
    }
    showToast(`Signed in as ${nextRole}`);
  };

  const handleAdvanceOrder = (id: string) => {
    const states = ['Order received', 'Processing', 'Shipped', 'Delivered'];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id || o.kind === 'Service') return o;
        const nextStatus = states[Math.min(states.indexOf(o.status) + 1, states.length - 1)];
        showToast(`${id} moved to ${nextStatus.toLowerCase()}`);
        return { ...o, status: nextStatus };
      })
    );
  };

  const handleSaveStock = (id: number, stock: number) => {
    if (!Number.isFinite(stock) || stock < 0) {
      showToast('Enter a valid stock number');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const clean = Math.floor(stock);
        showToast(`${p.name} stock set to ${clean}`);
        return { ...p, stock: clean };
      })
    );
  };

  const handleAddProduct = (payload: {
    name: string;
    price: number;
    category: Product['category'];
    stock: number;
    tone: Tone;
    desc: string;
  }) => {
    const nextId = Math.max(...products.map((p) => p.id)) + 1;
    setProducts((prev) => [
      ...prev,
      {
        id: nextId,
        name: payload.name,
        category: payload.category,
        price: payload.price,
        old: payload.price,
        art: 'diya',
        tone: payload.tone,
        desc: payload.desc,
        stock: payload.stock,
      },
    ]);
    showToast(`${payload.name} added to the catalogue`);
  };

  const totalBagCount = cart.reduce((sum, l) => sum + l.qty, 0);

  return (
    <div className="relative min-h-dvh text-[var(--ink)] pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
      <SacredArchClipDefs />
      {/* MAIN SACRED MANDALA BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#062529]"
      >
        <img
          ref={bgMandalaRef}
          src="/assets/aistudio/download__4__4e2b2c6e.jpeg"
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-[0.18] grayscale-[0.55] brightness-95 will-change-transform"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(204,62,38,0.28)_0%,rgba(8,51,57,0.78)_52%,rgba(6,37,41,0.96)_100%)]" />
      </div>

      <div className="relative z-10">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-[var(--clay)] focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-[var(--gold-ink)]"
      >
        Skip to content
      </a>

      {/* ELEGANT INTRO LOADER */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[900] grid place-items-center bg-[var(--paper)] transition-all duration-500 ${
          loaderDone ? 'pointer-events-none invisible opacity-0' : 'opacity-100'
        }`}
      >
        <div className="grid justify-items-center gap-3">
          <ArtSvg name="lotus" className="h-12 w-12 text-[var(--clay)]" />
          <span className="font-serif-display text-[22px] tracking-[0.02em] text-[var(--ink)]">
            PoojaTatva
          </span>
          <span className="h-px w-24 overflow-hidden bg-[var(--line)]">
            <span className="block h-full w-full origin-left bg-[var(--clay)] transition-transform duration-700" />
          </span>
        </div>
      </div>

      <Header
        activePage={activePage}
        isScrolled={isScrolled}
        cartCount={totalBagCount}
        soundOn={soundOn}
        onNavigate={navigate}
        onGoShop={goShop}
        onSwitchView={switchView}
        onToggleSound={handleToggleSound}
        onOpenBag={() => setBagOpen(true)}
      />

      <main id="main">
        {activePage === 'c-home' && (
          <HomePage
            products={products}
            onAddCart={addCart}
            onOpenService={(name) => setBookingServiceName(name)}
            onNavigate={navigate}
            onGoShop={goShop}
            onFilterShop={filterShop}
          />
        )}

        {activePage === 'c-shop' && (
          <ShopPage
            products={products}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            onAddCart={addCart}
          />
        )}

        {activePage === 'c-services' && (
          <ServicesPage onOpenService={(name) => setBookingServiceName(name)} />
        )}

        {activePage === 'c-checkout' && (
          <CheckoutPage
            cart={cart}
            products={products}
            wallet={wallet}
            profile={profile}
            onOpenBag={() => setBagOpen(true)}
            onGoShop={goShop}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activePage === 'c-success' && (
          <OrderSuccessPage
            orderId={successInfo.id}
            copy={successInfo.copy}
            onNavigate={navigate}
            onGoShop={goShop}
          />
        )}

        {activePage === 'c-orders' && <OrdersPage orders={orders} onGoShop={goShop} />}

        {activePage === 'c-account' && (
          <AccountPage
            wallet={wallet}
            profile={profile}
            onSaveProfile={(next) => {
              setProfile(next);
              showToast('Profile saved for this demo session');
            }}
            onNavigate={navigate}
            onToast={showToast}
          />
        )}

        {activePage === 'c-returns' && (
          <ReturnsPage
            onSubmitTicket={(type) => {
              setTickets((prev) => [
                {
                  type,
                  date: new Date().toLocaleDateString('en-IN'),
                  status: 'Open',
                },
                ...prev,
              ]);
              showToast('Return request submitted. We reply within one working day.');
            }}
          />
        )}

        {activePage === 'c-support' && (
          <SupportPage
            onSubmitTicket={(type) => {
              setTickets((prev) => [
                {
                  type,
                  date: new Date().toLocaleDateString('en-IN'),
                  status: 'Open',
                },
                ...prev,
              ]);
              showToast('Support ticket submitted. We reply within one working day.');
            }}
          />
        )}

        {activePage === 'admin-app' && (
          <AdminWorkspace
            role={role}
            activeSection={adminSection}
            orders={orders}
            products={products}
            tickets={tickets}
            campaigns={campaigns}
            wallet={wallet}
            profile={profile}
            onChangeRole={handleRoleChange}
            onSelectSection={(sec) => {
              if (!ROLE_PERMISSIONS[role].pages.includes(sec)) {
                showToast(`Access denied. ${sec} is not available to ${role}.`);
                return;
              }
              setAdminSection(sec);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAdvanceOrder={handleAdvanceOrder}
            onSaveStock={handleSaveStock}
            onOpenAddProduct={() => setAddProductOpen(true)}
            onCreateCampaign={(name) => {
              setCampaigns((prev) => [name, ...prev]);
              showToast('Campaign draft created');
            }}
            onToast={showToast}
          />
        )}
      </main>

      {activePage !== 'admin-app' && (
        <Footer onNavigate={navigate} onGoShop={goShop} onFilterShop={filterShop} />
      )}

      <MobileTabbar activePage={activePage} onNavigate={navigate} onGoShop={goShop} />

      <BagDrawer
        open={bagOpen}
        cart={cart}
        products={products}
        onClose={() => setBagOpen(false)}
        onChangeQty={changeQty}
        onRemoveItem={removeItem}
        onCheckout={() => navigate('c-checkout')}
        onGoShop={goShop}
      />

      <ServiceBookingModal
        serviceName={bookingServiceName}
        wallet={wallet}
        onClose={() => setBookingServiceName(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      <RitualConfirmModal
        order={ritualConfirm?.order || null}
        serviceName={ritualConfirm?.serviceName || null}
        onClose={() => setRitualConfirm(null)}
        onViewOrders={() => navigate('c-orders')}
      />

      <AddProductModal
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        onSaveProduct={handleAddProduct}
      />

      {/* SUBTLE TOAST */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-20 left-1/2 z-[200] -translate-x-1/2 rounded-full border border-[#FDF2DA]/35 bg-[#B82E1E] px-5 py-2.5 text-center text-[13px] font-semibold text-[#FDF2DA] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.85)] transition-all duration-300 md:bottom-6 ${
          toastMsg ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        {toastMsg || ''}
      </div>
      </div>
    </div>
  );
}
