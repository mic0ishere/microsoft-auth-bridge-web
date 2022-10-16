import { unstable_getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";

function Success({ error: errorObject, resetSession, message }) {
  const errorCode = errorObject?.isCode ?? !errorObject?.isUser ?? false;
  const error = errorObject?.message ?? false;

  useEffect(() => {
    if (!error || resetSession) {
      signOut({
        redirect: false,
      });
    }
  }, [error, resetSession]);

  return (
    <div className="page-center">
      <h2 className="text-xl sm:text-3xl mb-2 text-ellipsis">
        {error ? (
          <>
            <strong>Error: </strong>
            {error}
          </>
        ) : (
          message
        )}
      </h2>
      {error ? (
        errorCode ? (
          <p>Skontaktuj się z administratorem</p>
        ) : (
          <p>Spróbuj ponownie</p>
        )
      ) : (
        <p>
          Miłej gry na{" "}
          <code className="inline-block font-mono bg-slate-800 px-1 py-0.5 rounded-md">
            {process.env.NEXT_PUBLIC_SERVER_IP}
          </code>
        </p>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res, query } = context;

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  let error = {};

  if (query?.error && query?.error !== "false") {
    try {
      error = JSON.parse(query.error);
    } catch (e) {
      error = {
        isCode: true,
        message: "Wystąpił nieznany błąd",
      };
    }
  }

  return {
    props: {
      error: error,
      message: query.message ?? "",
      resetSession: query.resetSession ?? false,
    },
  };
}

export default Success;
