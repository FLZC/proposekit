import Script from "next/script";

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const host = process.env.NEXT_PUBLIC_UMAMI_HOST || "https://cloud.umami.is";

  if (!websiteId) return null;

  return (
    <Script
      async
      defer
      src={`${host}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
