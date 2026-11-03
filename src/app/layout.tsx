import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, League_Spartan } from "next/font/google";
import { AsciiOcean } from "@/components/ascii-ocean";
import { Cursor } from "@/components/cursor";
import { SideRail } from "@/components/side-rail";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = League_Spartan({ variable: "--font-display", subsets: ["latin"], weight: ["600", "700"] });

const title = "Fabián Vargas · Full Stack Developer (Backend & Cloud)";
const description =
  "Full Stack Developer en Costa Rica con enfoque en backend, automatización y cloud. Node.js, TypeScript y Python. Diseñé el servidor OCPP que opera 450+ estaciones de carga en 10+ países.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website", locale: "es_CR" },
  twitter: { card: "summary_large_image", title, description },
  // El sitio ya es oscuro: evita que Dark Reader reescriba estilos (y cause hydration mismatches)
  other: { "darkreader-lock": "dark" },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: extensiones (ColorZilla, Dark Reader…) agregan atributos a html/body antes de hidratar
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
    >
      <body className="min-h-svh" suppressHydrationWarning>
        <AsciiOcean />
        <SmoothScroll />
        <SideRail />
        {children}
        <Cursor />
      </body>
    </html>
  );
}
