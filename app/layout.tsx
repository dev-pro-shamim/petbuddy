import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pet Buddy | Pure Pet Treats & Natural Bully Sticks",
  description: "Canadian owned & operated 100% natural, grass-fed beef bully sticks (6-inch and 12-inch) and chews. Single ingredient, grain-free, rawhide-free.",
  icons: {
    icon: "/assets/images/pet-buddy-logo.png",
    apple: "/assets/images/pet-buddy-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/assets/images/pet-buddy-logo.png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#C8102E] selection:text-white">
        {children}
      </body>
    </html>
  );
}
