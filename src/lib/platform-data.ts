/**
 * Mock platform data for the Kwetu Connection owner console.
 * Replace with real backend reads once the router/RADIUS backend is connected.
 */

export type TenantStatus = "active" | "trial" | "suspended" | "onboarding";
export type RouterStatus = "online" | "offline" | "degraded";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  owner: string;
  country: string;
  currency: string;
  status: TenantStatus;
  plan: string;
  locations: number;
  routers: number;
  subscribers: number;
  monthlyRevenue: number;
  joined: string;
}

export interface RouterUnit {
  id: string;
  name: string;
  tenant: string;
  location: string;
  vpnIp: string;
  model: string;
  routerOs: string;
  status: RouterStatus;
  cpu: number;
  memory: number;
  uptime: string;
  lastSeen: string;
  activeSessions: number;
}

export interface Subscriber {
  id: string;
  phone: string;
  tenant: string;
  location: string;
  plan: string;
  status: "online" | "expired" | "active";
  dataUsedMb: number;
  expiresIn: string;
}

export interface Payment {
  id: string;
  reference: string;
  tenant: string;
  method: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}

export const tenants: Tenant[] = [
  {
    id: "t_kwetunet",
    name: "KWETUNET",
    slug: "kwetunet",
    owner: "Daniel Mwangi",
    country: "Kenya",
    currency: "KES",
    status: "active",
    plan: "Growth",
    locations: 4,
    routers: 7,
    subscribers: 1842,
    monthlyRevenue: 412500,
    joined: "2025-02-14",
  },
  {
    id: "t_abcwifi",
    name: "ABC WiFi",
    slug: "abc-wifi",
    owner: "Grace Otieno",
    country: "Kenya",
    currency: "KES",
    status: "active",
    plan: "Starter",
    locations: 1,
    routers: 2,
    subscribers: 386,
    monthlyRevenue: 78400,
    joined: "2025-06-02",
  },
  {
    id: "t_joeconnect",
    name: "Joe Connect",
    slug: "joe-connect",
    owner: "Joseph Baraka",
    country: "Tanzania",
    currency: "TZS",
    status: "trial",
    plan: "Trial",
    locations: 2,
    routers: 3,
    subscribers: 154,
    monthlyRevenue: 0,
    joined: "2026-09-08",
  },
  {
    id: "t_lakeside",
    name: "Lakeside Hotspot",
    slug: "lakeside",
    owner: "Mercy Achieng",
    country: "Kenya",
    currency: "KES",
    status: "onboarding",
    plan: "Starter",
    locations: 1,
    routers: 1,
    subscribers: 0,
    monthlyRevenue: 0,
    joined: "2026-09-25",
  },
  {
    id: "t_zuriwave",
    name: "Zuri Wave",
    slug: "zuri-wave",
    owner: "Ali Hassan",
    country: "Uganda",
    currency: "UGX",
    status: "suspended",
    plan: "Growth",
    locations: 3,
    routers: 4,
    subscribers: 611,
    monthlyRevenue: 96200,
    joined: "2025-11-19",
  },
];

export const routers: RouterUnit[] = [
  {
    id: "r_001",
    name: "KWT-CBD-01",
    tenant: "KWETUNET",
    location: "Nairobi CBD",
    vpnIp: "10.77.0.11",
    model: "hAP ac²",
    routerOs: "7.14.3",
    status: "online",
    cpu: 24,
    memory: 61,
    uptime: "18d 04h",
    lastSeen: "12s ago",
    activeSessions: 143,
  },
  {
    id: "r_002",
    name: "KWT-KASA-02",
    tenant: "KWETUNET",
    location: "Kasarani",
    vpnIp: "10.77.0.12",
    model: "RB4011",
    routerOs: "7.15.1",
    status: "online",
    cpu: 41,
    memory: 55,
    uptime: "6d 11h",
    lastSeen: "8s ago",
    activeSessions: 208,
  },
  {
    id: "r_003",
    name: "KWT-RUAI-03",
    tenant: "KWETUNET",
    location: "Ruai",
    vpnIp: "10.77.0.13",
    model: "hEX S",
    routerOs: "7.13.5",
    status: "degraded",
    cpu: 88,
    memory: 92,
    uptime: "2d 09h",
    lastSeen: "1m ago",
    activeSessions: 77,
  },
  {
    id: "r_004",
    name: "ABC-MAIN-01",
    tenant: "ABC WiFi",
    location: "Main Branch",
    vpnIp: "10.77.1.11",
    model: "hAP ax²",
    routerOs: "7.15.1",
    status: "online",
    cpu: 17,
    memory: 38,
    uptime: "31d 02h",
    lastSeen: "5s ago",
    activeSessions: 52,
  },
  {
    id: "r_005",
    name: "JOE-MWZ-01",
    tenant: "Joe Connect",
    location: "Mwanza",
    vpnIp: "10.77.2.11",
    model: "hEX",
    routerOs: "7.12.1",
    status: "offline",
    cpu: 0,
    memory: 0,
    uptime: "—",
    lastSeen: "3h 12m ago",
    activeSessions: 0,
  },
  {
    id: "r_006",
    name: "ZW-KLA-01",
    tenant: "Zuri Wave",
    location: "Kampala Central",
    vpnIp: "10.77.3.11",
    model: "RB5009",
    routerOs: "7.14.3",
    status: "offline",
    cpu: 0,
    memory: 0,
    uptime: "—",
    lastSeen: "2d 05h ago",
    activeSessions: 0,
  },
];

export const subscribers: Subscriber[] = [
  {
    id: "s_01",
    phone: "+254 712 448 201",
    tenant: "KWETUNET",
    location: "Nairobi CBD",
    plan: "6 Hours",
    status: "online",
    dataUsedMb: 742,
    expiresIn: "3h 12m",
  },
  {
    id: "s_02",
    phone: "+254 733 118 907",
    tenant: "KWETUNET",
    location: "Kasarani",
    plan: "24 Hours",
    status: "online",
    dataUsedMb: 1980,
    expiresIn: "14h 03m",
  },
  {
    id: "s_03",
    phone: "+254 701 552 330",
    tenant: "ABC WiFi",
    location: "Main Branch",
    plan: "1 Hour",
    status: "expired",
    dataUsedMb: 214,
    expiresIn: "—",
  },
  {
    id: "s_04",
    phone: "+255 765 901 442",
    tenant: "Joe Connect",
    location: "Mwanza",
    plan: "24 Hours",
    status: "active",
    dataUsedMb: 88,
    expiresIn: "22h 41m",
  },
  {
    id: "s_05",
    phone: "+256 774 220 118",
    tenant: "Zuri Wave",
    location: "Kampala Central",
    plan: "6 Hours",
    status: "expired",
    dataUsedMb: 1120,
    expiresIn: "—",
  },
  {
    id: "s_06",
    phone: "+254 720 664 715",
    tenant: "KWETUNET",
    location: "Ruai",
    plan: "1 Hour",
    status: "online",
    dataUsedMb: 121,
    expiresIn: "26m",
  },
];

export const payments: Payment[] = [
  {
    id: "p_01",
    reference: "MOCK-8FD21A",
    tenant: "KWETUNET",
    method: "M-Pesa (mock)",
    amount: 150,
    currency: "KES",
    status: "paid",
    createdAt: "Today 14:22",
  },
  {
    id: "p_02",
    reference: "MOCK-71C0E4",
    tenant: "KWETUNET",
    method: "M-Pesa (mock)",
    amount: 50,
    currency: "KES",
    status: "paid",
    createdAt: "Today 14:19",
  },
  {
    id: "p_03",
    reference: "MOCK-33B9D7",
    tenant: "ABC WiFi",
    method: "Card (mock)",
    amount: 300,
    currency: "KES",
    status: "pending",
    createdAt: "Today 14:05",
  },
  {
    id: "p_04",
    reference: "MOCK-02AA19",
    tenant: "Joe Connect",
    method: "M-Pesa (mock)",
    amount: 2000,
    currency: "TZS",
    status: "failed",
    createdAt: "Today 13:47",
  },
  {
    id: "p_05",
    reference: "MOCK-55EE03",
    tenant: "KWETUNET",
    method: "Voucher",
    amount: 300,
    currency: "KES",
    status: "paid",
    createdAt: "Today 13:31",
  },
  {
    id: "p_06",
    reference: "MOCK-9A1C66",
    tenant: "Zuri Wave",
    method: "Card (mock)",
    amount: 12000,
    currency: "UGX",
    status: "refunded",
    createdAt: "Yesterday 19:58",
  },
];

export const revenueSeries = [
  { day: "Mon", revenue: 41200, sessions: 820 },
  { day: "Tue", revenue: 38700, sessions: 774 },
  { day: "Wed", revenue: 52400, sessions: 1015 },
  { day: "Thu", revenue: 47900, sessions: 943 },
  { day: "Fri", revenue: 68300, sessions: 1288 },
  { day: "Sat", revenue: 79100, sessions: 1502 },
  { day: "Sun", revenue: 61500, sessions: 1176 },
];

export const platformStats = {
  totalTenants: tenants.length,
  activeTenants: tenants.filter((t) => t.status === "active").length,
  totalRouters: routers.length,
  onlineRouters: routers.filter((r) => r.status !== "offline").length,
  totalSubscribers: tenants.reduce((sum, t) => sum + t.subscribers, 0),
  activeSessions: routers.reduce((sum, r) => sum + r.activeSessions, 0),
  revenueToday: 61500,
  revenueMonth: 1487300,
  paymentSuccessRate: 94.2,
};

export function formatMoney(amount: number, currency = "KES") {
  return `${currency} ${amount.toLocaleString("en-KE")}`;
}
