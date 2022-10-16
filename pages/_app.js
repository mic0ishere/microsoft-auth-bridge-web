import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const title = `${process.env.NEXT_PUBLIC_SERVER_NAME} | Auth`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
