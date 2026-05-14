import Script from "next/script";

const ALLOWED_UMAMI_HOSTS = ["https://cloud.umami.is"];

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const hostEnv = process.env.NEXT_PUBLIC_UMAMI_HOST;
  const host =
    hostEnv && ALLOWED_UMAMI_HOSTS.includes(hostEnv)
      ? hostEnv
      : "https://cloud.umami.is";

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
