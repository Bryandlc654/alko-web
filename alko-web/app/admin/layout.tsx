import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ALKO Studio - Panel de Administración",
  description: "Gestor visual y editor en tiempo real de contenidos ALKO",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${poppins.variable} font-poppins min-h-screen bg-[#f8fafc] text-slate-900 antialiased`}>
      {children}
    </div>
  );
}
