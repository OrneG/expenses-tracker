import "./globals.css";

export const metadata = {
  title: "Expenses Tracker",
  description: "A mobile-first personal expenses tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
