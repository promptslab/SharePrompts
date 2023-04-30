import { BASE_URL } from "@/lib/baseurl";
import Head from "next/head";
import Script from 'next/script';
const FAVICON_FOLDER = "/favicons";

export default function Meta({
  title = `SharePrompts: Share your ChatGPT Prompts with one click.`,
  description = `SharePrompts is a Chrome extension that allows you to share your prompts with one click.`,
  image = `${BASE_URL}/logo.png`,
  imageAlt = "OG image for the SharePrompts application",
  canonical = `${BASE_URL}`,
}: {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  canonical?: string;
}) {
  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
      <Script strategy="lazyOnload" id="g-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
              });
          `}
      </Script>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${FAVICON_FOLDER}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${FAVICON_FOLDER}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${FAVICON_FOLDER}/favicon-16x16.png`}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="mask-icon"
          href={`${FAVICON_FOLDER}/safari-pinned-tab.svg`}
          color="#11A380"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta itemProp="image" content={image} />
        <meta property="og:logo" content={`${BASE_URL}/logo.png`}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:alt" content={imageAlt} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Vercel" />
        <meta name="twitter:creator" content="@dom__inic" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta property="twitter:image:alt" content={imageAlt} />
        <meta name="twitter:player" content={canonical + "?card=1"} />
        <meta name="twitter:player:width" content="300" />
        <meta name="twitter:player:height" content="533" />
      </Head>
    </>
  );
}
