import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description = 'HomeHub Homeopathy provides natural, safe, and root-cause solutions for chronic diseases, asthma, diabetes, psoriasis, and pediatric immunity.',
  type = 'website',
  name = 'HomeHub Homeopathy',
  twitterCard = 'summary_large_image',
}) {
  const defaultTitle = 'HomeHub Homeopathy — Safe, Natural, Root-Cause Cure';
  const pageTitle = title ? `${title} | HomeHub Homeopathy` : defaultTitle;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook Metadata */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />

      {/* Twitter Metadata */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
