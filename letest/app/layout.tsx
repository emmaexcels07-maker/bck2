import "./globals.css";
import Providers from "./providers";
import { CartProvider } from "./lib/cartContext";

export const metadata = { title: "NextShop" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
