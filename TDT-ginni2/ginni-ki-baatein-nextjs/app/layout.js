import "./globals.css";

export const metadata = {
  title: "Ginni Ki Baatein — A Private Tarot Counsel",
  description: "A private tarot counsel — refined Hinglish readings for clarity and strategic foresight.",
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
        {children}
      </body>
    </html>
  );
}
