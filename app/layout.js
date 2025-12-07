import './globals.css'

export const metadata = {
  title: 'DevConverter - Free JSON, CSV, YAML Converter for Developers',
  description: 'Convert JSON to CSV, CSV to JSON, YAML to JSON instantly. Free online converter tool for developers. Fast, secure, client-side processing. No signup required.',
  keywords: 'json to csv, csv to json, yaml converter, json converter, data converter, developer tools, free converter',
  authors: [{ name: 'DevConverter' }],
  openGraph: {
    title: 'DevConverter - Free Data Converter for Developers',
    description: 'Convert JSON, CSV, YAML instantly in your browser. 100% free and secure.',
    url: 'https://devconverter-black.vercel.app',
    siteName: 'DevConverter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevConverter - Free JSON, CSV, YAML Converter',
    description: 'Convert JSON, CSV, YAML instantly. Free tool for developers.',
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DevConverter',
    description: 'Free online converter for developers. Convert JSON, CSV, YAML instantly.',
    url: 'https://devconverter-black.vercel.app',
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
