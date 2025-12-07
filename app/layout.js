export const metadata = {
  title: 'DevConverter - Free Developer Tools',
  description: 'Convert JSON, CSV, YAML, XML for free. Fast, secure, and developer-friendly.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
