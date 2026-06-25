import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Book a Legal Consultation Online | Adv. R. Abirami — Chennai High Court Advocate",
  description:
    "Get expert legal advice from Adv. R. Abirami, a practising advocate at Madras High Court, Chennai. Book a confidential online consultation starting at ₹300. Civil, family, property & criminal law.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full`}>
      <head>
        <link rel="icon" type="image/png" href="/lawyer.png" />
        <link rel="apple-touch-icon" href="/lawyer.png" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
