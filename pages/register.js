import { unstable_getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Component() {
  return (
    <div className="page-center">
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();

          const username = document.getElementById("username").value;
          if (!username.match("^[a-zA-Z0-9_]{2,32}$")) {
            alert("Nazwa użytkownika musi mieć od 2 do 32 znaków");
            return;
          }

          signIn("azure-ad", {
            redirect: false,
            callbackUrl: `/api/register/${username}`,
          });
        }}
      >
        <input
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-snug focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Nazwa w grze"
          min={2}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");

            if (e.target.value.length > 32) {
              e.target.value = e.target.value.substring(0, 32);
            }
          }}
          required
          autoFocus
          autoComplete="username"
        />
        <button
          className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Zarejestruj
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/callback",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
