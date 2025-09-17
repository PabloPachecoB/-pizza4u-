import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({
  title = 'Pizza4U - Las mejores pizzas de La Paz',
  description = 'Disfruta de las mejores pizzas artesanales de La Paz, Bolivia. Ingredientes frescos, sabores únicos y entregas a domicilio. ¡Ordena ahora!',
  keywords = 'pizza, comida, delivery, La Paz, Bolivia, restaurante, italiana, artesanal',
  image = '/og-image.jpg',
  url,
  type = 'website',
  author = 'Pizza4U',
  locale = 'es_BO'
}) => {
  const siteUrl = window.location.origin;
  const canonicalUrl = url ? `${siteUrl}${url}` : window.location.href;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Pizza4U" />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
      <meta name="twitter:creator" content="@pizza4u" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "Pizza4U",
          "description": description,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "image": `${siteUrl}${image}`,
          "telephone": "+591-2-123-4567",
          "email": "info@pizza4u.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle Principal 123",
            "addressLocality": "La Paz",
            "addressCountry": "BO"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-16.5000",
            "longitude": "-68.1500"
          },
          "openingHours": "Mo-Su 11:00-23:00",
          "priceRange": "$$",
          "servesCuisine": ["Italian", "Pizza"],
          "acceptsReservations": "True",
          "hasDeliveryService": "True",
          "paymentAccepted": ["Cash", "Credit Card"],
          "currenciesAccepted": "BOB"
        })}
      </script>
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Preload critical resources */}
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" 
        as="style" 
        onLoad="this.onload=null;this.rel='stylesheet'" 
      />
      
      {/* Font Awesome */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </Helmet>
  );
};

export default SEO;
