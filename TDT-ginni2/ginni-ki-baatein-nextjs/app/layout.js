import "./globals.css";

export const metadata = {
  title: "The Divine Tarot — Reading Chat",
  description:
    "Mystical, emotionally intelligent tarot readings for love, career and life — in English, Hindi and Hinglish.",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicon-180.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#6d28d9",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Work+Sans:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>
        <div className="stars" />
        <div className="aurora" />
        {children}
      </body>
    </html>
  );
}
