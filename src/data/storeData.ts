import type{
  AdminAction,
  AdminSection,
  Order,
  Product,
  RitualMeta,
  RoleName,
  Service,
  WalletState,
} from '../types';

export const formatMoney = (n: number): string => '₹' + Number(n).toLocaleString('en-IN');

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Brass Diya Pair',
    category: 'Pooja Essentials',
    price: 399,
    old: 499,
    art: 'diya',
    image: '/src/assets/images/brass_diya_pair_1795337828154.jpg',
    tone: 'sand',
    desc: 'Two hand-finished lamps, weighted for daily use.',
    stock: 42,
  },
  {
    id: 2,
    name: 'Pooja Thali Set',
    category: 'Pooja Essentials',
    price: 799,
    old: 999,
    art: 'thali',
    image: '/src/assets/images/pooja_thali_set_1795337829411.jpg',
    tone: 'clay',
    desc: 'Five bowls, one centre lamp, a matte brass finish.',
    stock: 18,
  },
  {
    id: 3,
    name: 'Rudraksha Mala',
    category: 'Spiritual Wellness',
    price: 599,
    old: 699,
    art: 'mala',
    image: '/src/assets/images/rudraksha_mala_1795337828820.jpg',
    tone: 'stone',
    desc: '108 beads, knotted between each one.',
    stock: 35,
  },
  {
    id: 4,
    name: 'Incense Collection',
    category: 'Pooja Essentials',
    price: 249,
    old: 299,
    art: 'incense',
    image: '/src/assets/images/incense_collection_1795337828543.jpg',
    tone: 'sage',
    desc: 'Four scents, charcoal-free, 60 sticks.',
    stock: 60,
  },
  {
    id: 5,
    name: 'Copper Kalash',
    category: 'Pooja Essentials',
    price: 649,
    old: 799,
    art: 'kalash',
    image: '/src/assets/images/copper_kalash_1795337828324.jpg',
    tone: 'rose',
    desc: 'Hammered copper with a coconut and leaf rest.',
    stock: 21,
  },
  {
    id: 6,
    name: 'Divine Gift Box',
    category: 'Gifts',
    price: 999,
    old: 1199,
    art: 'gift',
    image: '/src/assets/images/divine_gift_box_1795337828537.jpg',
    tone: 'sand',
    desc: 'Diya, incense and a mala in one reusable box.',
    stock: 12,
  },
  {
    id: 7,
    name: 'Sandalwood Mala',
    category: 'Spiritual Wellness',
    price: 499,
    old: 599,
    art: 'mala',
    image: '/src/assets/images/sandalwood_mala_1795337828979.jpg',
    tone: 'sage',
    desc: 'Sandalwood beads that keep their scent.',
    stock: 28,
  },
  {
    id: 8,
    name: 'Pooja Bell',
    category: 'Pooja Essentials',
    price: 349,
    old: 449,
    art: 'bell',
    image: '/src/assets/images/pooja_bell_1795337829152.jpg',
    tone: 'stone',
    desc: 'A clear ring that does not rattle.',
    stock: 31,
  },
];

export const SERVICES: Service[] = [
  {
    name: 'Aaj Ki Pooja',
    k: 'Daily devotion',
    price: 101,
    meta: '45 min · live on video',
    art: 'namaste',
    image: '/src/assets/images/aaj_ki_pooja_1795337828522.jpg',
    tone: 'sand',
    desc: 'A short daily pooja for your home, streamed live if you cannot be there.',
  },
  {
    name: 'Pandit Booking',
    k: 'Personal ritual',
    price: 1100,
    meta: '2 to 3 hours · at your venue',
    art: 'kalash',
    image: '/src/assets/images/pandit_booking_1795337829624.jpg',
    tone: 'stone',
    desc: 'A pandit for a griha pravesh, satyanarayan katha or ceremony, matched to your language.',
  },
  {
    name: 'Kamakhya Prasad',
    k: 'Sacred prasad',
    price: 251,
    meta: 'Ships in 48 hours',
    art: 'prasad',
    image: '/src/assets/images/kamakhya_prasad_1795337828717.jpg',
    tone: 'rose',
    desc: 'Temple prasad sent within 48 hours of offering, in sealed food-grade packaging.',
  },
  {
    name: 'Ganga Jal Video',
    k: 'Video queue',
    price: 151,
    meta: '15 min video · sealed jal',
    art: 'jal',
    image: '/src/assets/images/ganga_jal_video_1795337830353.jpg',
    tone: 'sage',
    desc: 'Watch your jal collected at the ghat, signed and sealed on camera before dispatch.',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SV-2043',
    kind: 'Service',
    date: '24 Nov 2026',
    items: 'Aaj Ki Pooja · 6:30 pm',
    amount: 101,
    status: 'Confirmed',
    person: 'Meera Iyer',
    city: 'Chennai',
    when: '24 Nov 2026 · 6:30 pm',
  },
  {
    id: 'PT-1001',
    kind: 'Product',
    date: '17 Nov 2026',
    items: 'Brass Diya Pair',
    amount: 399,
    status: 'Delivered',
  },
  {
    id: 'PT-1002',
    kind: 'Product',
    date: '16 Nov 2026',
    items: 'Rudraksha Mala',
    amount: 599,
    status: 'Processing',
  },
  {
    id: 'PT-1003',
    kind: 'Product',
    date: '15 Nov 2026',
    items: 'Pooja Thali Set',
    amount: 799,
    status: 'Shipped',
  },
  {
    id: 'SV-2041',
    kind: 'Service',
    date: '22 Nov 2026',
    items: 'Ganga Jal Video · 9:00 am',
    amount: 151,
    status: 'Scheduled',
    person: 'Rohit Sharma',
    city: 'Pune',
    when: '22 Nov 2026 · 9:00 am',
  },
  {
    id: 'SV-2039',
    kind: 'Service',
    date: '19 Nov 2026',
    items: 'Pandit Booking · 8:00 am',
    amount: 1100,
    status: 'Completed',
    person: 'Ananya Das',
    city: 'Kolkata',
    when: '19 Nov 2026 · 8:00 am',
  },
];

export const COIN_RULES = {
  coinValue: 1,
  maxRedeemPercent: 50,
  earnPerRupee: 0.02,
  referrerBonus: 200,
  refereeBonus: 100,
};

export const INITIAL_WALLET: WalletState = {
  code: 'MEERA200',
  coins: 640,
  lifetimeEarned: 1240,
  lifetimeSpent: 600,
  referrals: [
    { name: 'Rohit Sharma', date: '12 Nov 2026', status: 'Joined', coins: 200 },
    { name: 'Ananya Das', date: '04 Nov 2026', status: 'First booking', coins: 200 },
    { name: 'Kavita Rao', date: '28 Oct 2026', status: 'Invite sent', coins: 0 },
  ],
  ledger: [
    { label: 'Referral · Ananya Das', date: '04 Nov 2026', coins: 200 },
    { label: 'Booking · Pandit Booking', date: '19 Nov 2026', coins: 22 },
    { label: 'Redeemed at checkout', date: '22 Nov 2026', coins: -150 },
  ],
};

export const coinsToRupees = (coins: number): number =>
  Math.max(0, Math.floor(coins)) * COIN_RULES.coinValue;

export const maxRedeemable = (payableRupees: number, availableCoins: number): number =>
  Math.min(availableCoins, Math.floor((payableRupees * COIN_RULES.maxRedeemPercent) / 100));

export const earnCoins = (payableRupees: number): number =>
  Math.round(payableRupees * COIN_RULES.earnPerRupee);

export const RITUAL_CONFIG: Record<string, RitualMeta> = {
  'Aaj Ki Pooja': {
    kind: 'pooja',
    art: 'diya',
    sound: 'bell',
    copy: 'Your pooja is booked. The confirmation and recording stay in My orders.',
  },
  'Pandit Booking': {
    kind: 'pandit',
    art: 'kalash',
    sound: 'conch',
    copy: 'Your pandit is booked. The confirmation stays in My orders.',
  },
  'Kamakhya Prasad': {
    kind: 'prasad',
    art: 'prasad',
    sound: 'chime',
    copy: 'Your prasad is booked. It ships within 48 hours of the offering, sealed.',
  },
  'Ganga Jal Video': {
    kind: 'jal',
    art: 'vessel',
    sound: 'water',
    copy: 'Your Ganga Jal video is booked. We collect and film on your chosen date.',
  },
};

export const ROLE_PERMISSIONS: Record<
  RoleName,
  { pages: AdminSection[]; actions: AdminAction[]; note: string }
> = {
  'Super Admin': {
    pages: [
      'dashboard',
      'orders',
      'products',
      'returns',
      'customers',
      'marketing',
      'hr',
      'spiritual',
      'finance',
      'reports',
      'settings',
    ],
    actions: [
      'order_update',
      'inventory_edit',
      'product_add',
      'campaign_edit',
      'finance_view',
      'staff_manage',
      'settings_edit',
    ],
    note: 'Founder access. Every module, every action, including settings and finance.',
  },
  'Operations Admin': {
    pages: ['dashboard', 'orders', 'products', 'returns', 'customers', 'spiritual'],
    actions: ['order_update', 'inventory_edit', 'product_add'],
    note: 'Operations access. Orders, products, returns, customers and spiritual services.',
  },
  'Marketing Admin': {
    pages: ['dashboard', 'marketing', 'customers', 'reports'],
    actions: ['campaign_edit'],
    note: 'Marketing access. Campaigns, customer list and reports. Orders are read only.',
  },
  'Finance Admin': {
    pages: ['dashboard', 'orders', 'finance', 'reports'],
    actions: ['finance_view'],
    note: 'Finance access. Read-only orders, settlements and reports.',
  },
  Customer: {
    pages: [],
    actions: [],
    note: 'Customer access. Storefront, bag, checkout and personal account.',
  },
};

export const ADMIN_META: Record<AdminSection, [string, string, string]> = {
  dashboard: [
    'Overview',
    'Founder dashboard',
    'Sales, orders and the handful of things that need a decision today.',
  ],
  orders: ['Commerce', 'Orders', 'Every order, its state and the next action.'],
  products: ['Commerce', 'Products and stock', 'Catalogue, pricing and what is running low.'],
  returns: [
    'Commerce',
    'Returns and reviews',
    'Refunds to settle and feedback worth reading.',
  ],
  customers: [
    'Commerce',
    'Customers',
    'Who buys, who repeats and who is waiting on an answer.',
  ],
  marketing: ['Growth', 'Marketing', 'Channels, spend and the next campaign.'],
  hr: ['Growth', 'Team and HR', 'Who does what, and what is still open.'],
  spiritual: ['Growth', 'Spiritual services', 'Paid bookings, confirmed and scheduled.'],
  finance: ['Management', 'Finance and legal', 'Settlements, expenses and compliance.'],
  reports: ['Management', 'Reports', 'The numbers, in a form you can send on.'],
  settings: ['Management', 'Settings and security', 'Workspace defaults and access control.'],
};
