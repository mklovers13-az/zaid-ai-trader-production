import "./globals.css";

export const metadata = {
  title: "SMC Trade",
  description: "AI-assisted chart analysis and trading research workspace."
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
