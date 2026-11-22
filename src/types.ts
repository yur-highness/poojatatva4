export type Tone = 'sand' | 'clay' | 'sage' | 'stone' | 'rose';

export type ArtName =
  | 'diya'
  | 'thali'
  | 'mala'
  | 'incense'
  | 'kalash'
  | 'gift'
  | 'bell'
  | 'lotus'
  | 'namaste'
  | 'prasad'
  | 'jal'
  | 'vessel'
  | 'video';

export interface Product {
  id: number;
  name: string;
  category: 'Pooja Essentials' | 'Spiritual Wellness' | 'Gifts';
  price: number;
  old: number;
  art: ArtName;
  image?: string;
  tone: Tone;
  desc: string;
  stock: number;
}

export interface Service {
  name: string;
  k: string;
  price: number;
  meta: string;
  art: ArtName;
  image?: string;
  tone: Tone;
  desc: string;
}

export interface CartLine {
  id: number;
  qty: number;
}

export interface Order {
  id: string;
  kind: 'Service' | 'Product';
  date: string;
  items: string;
  amount: number;
  coinsUsed?: number;
  status: string;
  person?: string;
  phone?: string;
  city?: string;
  when?: string;
}

export interface Ticket {
  type: string;
  date: string;
  status: string;
}

export interface ReferralEntry {
  name: string;
  date: string;
  status: string;
  coins: number;
}

export interface CoinLedgerEntry {
  label: string;
  date: string;
  coins: number;
}

export interface WalletState {
  code: string;
  coins: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  referrals: ReferralEntry[];
  ledger: CoinLedgerEntry[];
}

export interface ProfileState {
  name: string;
  phone: string;
  email: string;
}

export type RoleName =
  | 'Super Admin'
  | 'Operations Admin'
  | 'Marketing Admin'
  | 'Finance Admin'
  | 'Customer';

export type AdminSection =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'returns'
  | 'customers'
  | 'marketing'
  | 'hr'
  | 'spiritual'
  | 'finance'
  | 'reports'
  | 'settings';

export type AdminAction =
  | 'order_update'
  | 'inventory_edit'
  | 'product_add'
  | 'campaign_edit'
  | 'finance_view'
  | 'staff_manage'
  | 'settings_edit';

export type PageId =
  | 'c-home'
  | 'c-services'
  | 'c-shop'
  | 'c-checkout'
  | 'c-success'
  | 'c-orders'
  | 'c-account'
  | 'c-returns'
  | 'c-support'
  | 'admin-app';

export type RitualSoundKind = 'bell' | 'conch' | 'chime' | 'water';

export interface RitualMeta {
  kind: 'pooja' | 'pandit' | 'prasad' | 'jal';
  art: ArtName;
  sound: RitualSoundKind;
  copy: string;
}
