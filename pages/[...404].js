const Page = () => <></>;

export default Page;
export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: process.env.NEXT_PUBLIC_SITE_URL,
      permanent: false,
    },
  };
};
