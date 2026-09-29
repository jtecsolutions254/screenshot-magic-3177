/**
 * Tenant-level configuration: branding, hotspot packages, payment gateways
 * and MikroTik provisioning. All values are sample data for now — no tenant
 * is hard-coded into platform behaviour, everything is looked up by slug.
 */

export interface HotspotPackage {
  id: string;
  name: string;
  price: number;
  durationLabel: string;
  dataLabel: string;
  speedLabel: string;
  popular?: boolean;
}

export interface TenantBranding {
  slug: string;
  name: string;
  tagline: string;
  headline: string;
  supportPhone: string;
  currency: string;
  primary: string;
  accent: string;
  logoText: string;
  terms: string;
}

export interface TenantConfig {
  branding: TenantBranding;
  packages: HotspotPackage[];
}

export type GatewayId = "mpesa" | "paystack" | "flutterwave";

export interface GatewayField {
  key: string;
  label: string;
  placeholder: string;
  secret?: boolean;
}

export interface GatewayDriver {
  id: GatewayId;
  name: string;
  blurb: string;
  regions: string;
  methods: string[];
  fields: GatewayField[];
}

export const gatewayDrivers: GatewayDriver[] = [
  {
    id: "mpesa",
    name: "M-Pesa (Daraja)",
    blurb: "Prompt payment requests straight to the customer's phone.",
    regions: "Kenya",
    methods: ["Phone prompt", "Paybill", "Till"],
    fields: [
      { key: "consumerKey", label: "Consumer key", placeholder: "Ab12Cd34..." },
      { key: "consumerSecret", label: "Consumer secret", placeholder: "••••••", secret: true },
      { key: "shortcode", label: "Shortcode", placeholder: "174379" },
      { key: "passkey", label: "Passkey", placeholder: "••••••", secret: true },
    ],
  },
  {
    id: "paystack",
    name: "Paystack",
    blurb: "Cards, bank transfer and mobile money across West & East Africa.",
    regions: "Kenya, Nigeria, Ghana, South Africa",
    methods: ["Card", "Bank transfer", "Mobile money"],
    fields: [
      { key: "publicKey", label: "Public key", placeholder: "pk_live_..." },
      { key: "secretKey", label: "Secret key", placeholder: "••••••", secret: true },
    ],
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    blurb: "Multi-currency collections for pan-African hotspot operators.",
    regions: "34 countries",
    methods: ["Card", "Mobile money", "USSD"],
    fields: [
      { key: "publicKey", label: "Public key", placeholder: "FLWPUBK-..." },
      { key: "secretKey", label: "Secret key", placeholder: "••••••", secret: true },
      { key: "encryptionKey", label: "Encryption key", placeholder: "••••••", secret: true },
    ],
  },
];

const defaultPackages: HotspotPackage[] = [
  {
    id: "pk_1h",
    name: "1 Hour",
    price: 20,
    durationLabel: "1 hour",
    dataLabel: "500 MB",
    speedLabel: "5 Mbps",
  },
  {
    id: "pk_6h",
    name: "6 Hours",
    price: 50,
    durationLabel: "6 hours",
    dataLabel: "2 GB",
    speedLabel: "8 Mbps",
    popular: true,
  },
  {
    id: "pk_24h",
    name: "24 Hours",
    price: 100,
    durationLabel: "24 hours",
    dataLabel: "Unlimited",
    speedLabel: "10 Mbps",
  },
  {
    id: "pk_7d",
    name: "Weekly",
    price: 350,
    durationLabel: "7 days",
    dataLabel: "Unlimited",
    speedLabel: "10 Mbps",
  },
];

export const tenantConfigs: Record<string, TenantConfig> = {
  kwetunet: {
    branding: {
      slug: "kwetunet",
      name: "KWETUNET",
      tagline: "Fast neighbourhood WiFi",
      headline: "Get online in seconds",
      supportPhone: "+254 712 000 111",
      currency: "KES",
      primary: "#22d3ee",
      accent: "#f59e0b",
      logoText: "KN",
      terms: "Fair usage applies. One device per voucher unless stated.",
    },
    packages: defaultPackages,
  },
  "abc-wifi": {
    branding: {
      slug: "abc-wifi",
      name: "ABC WiFi",
      tagline: "WiFi for the whole block",
      headline: "Connect and browse",
      supportPhone: "+254 733 222 909",
      currency: "KES",
      primary: "#a78bfa",
      accent: "#34d399",
      logoText: "AB",
      terms: "Support available 8am to 9pm daily.",
    },
    packages: defaultPackages.map((p) => ({ ...p, price: Math.round(p.price * 1.2) })),
  },
  "joe-connect": {
    branding: {
      slug: "joe-connect",
      name: "Joe Connect",
      tagline: "Mwanza's community network",
      headline: "Karibu online",
      supportPhone: "+255 765 901 442",
      currency: "TZS",
      primary: "#fb7185",
      accent: "#facc15",
      logoText: "JC",
      terms: "Vouchers expire 30 days after purchase.",
    },
    packages: defaultPackages.map((p) => ({ ...p, price: p.price * 25 })),
  },
};

export function getTenantConfig(slug: string): TenantConfig | undefined {
  return tenantConfigs[slug];
}

export const portalTenantSlugs = Object.keys(tenantConfigs);

export interface ProvisionInput {
  tenantName: string;
  tenantSlug: string;
  routerName: string;
  hotspotNetwork: string;
  portalHost: string;
  radiusSecret: string;
  wireguardIp: string;
}

export function buildRouterScript(input: ProvisionInput): string {
  const {
    tenantName,
    tenantSlug,
    routerName,
    hotspotNetwork,
    portalHost,
    radiusSecret,
    wireguardIp,
  } = input;

  return `# ${tenantName} — ${routerName}
# Paste into the MikroTik terminal (RouterOS 7.x)

/system identity set name="${routerName}"

# 1. Secure tunnel back to Kwetu Connection
/interface wireguard
add name=kwetu-vpn listen-port=13231 private-key="<generated-on-first-connect>"
/ip address add address=${wireguardIp}/24 interface=kwetu-vpn
/interface wireguard peers
add interface=kwetu-vpn public-key="<kwetu-server-key>" \\
    endpoint-address=vpn.kwetu.net endpoint-port=51820 \\
    allowed-address=10.77.0.0/16 persistent-keepalive=25s

# 2. Central sign-in and accounting
/radius
add service=hotspot address=10.77.0.1 secret="${radiusSecret}" comment="kwetu-${tenantSlug}"
/radius incoming set accept=yes port=3799

# 3. Hotspot on ${hotspotNetwork}
/ip pool add name=hs-pool ranges=${hotspotNetwork.replace(/0\/\d+$/, "10")}-${hotspotNetwork.replace(/0\/\d+$/, "254")}
/ip hotspot profile
set [ find default=yes ] name=kwetu-${tenantSlug} use-radius=yes \\
    login-by=http-chap,http-pap html-directory=kwetu \\
    dns-name=${portalHost}
/ip hotspot add name=kwetu-hs interface=bridge address-pool=hs-pool profile=kwetu-${tenantSlug}

# 4. Let customers reach the sign-in page and pay before logging in
/ip hotspot walled-garden
add dst-host=${portalHost} comment="portal"
add dst-host=*.safaricom.co.ke comment="mobile money"
add dst-host=api.paystack.co
add dst-host=api.flutterwave.com

# 5. Report status back every minute
/system scheduler
add name=kwetu-heartbeat interval=1m on-event="/tool fetch url=\\"https://${portalHost}/api/public/heartbeat?router=${routerName}\\" keep-result=no"
`;
}
