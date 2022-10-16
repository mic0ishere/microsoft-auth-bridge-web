import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import userModel from "../../../lib/userModel";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.redirect("/");
  }

  const username = req.query.username;
  if (!username || !username.match("^[a-zA-Z0-9_]{2,32}$")) {
    return res.redirect(
      getCallbackURL({
        error: {
          message:
            "Nazwa musi mieć od 2 do 32 znaków i składać się z liter, cyfr i _",
          isUser: true,
        },
        resetSession: true,
      })
    );
  }

  await dbConnect();

  const finalUsername = username.toLowerCase();
  const usersDB = await userModel.find();

  if (usersDB.find((x) => x.username === finalUsername && x.email !== session.user.email)) {
    return res.redirect(
      getCallbackURL({
        error: {
          message: "Nazwa użytkownika jest już zajęta",
          isUser: true,
        },
        resetSession: true,
      })
    );
  }

  const user = await usersDB.find((x) => x.email === session.user.email);

  if (user) {
    await userModel.updateOne(
      { email: session.user.email },
      { username: finalUsername }
    );
  } else {
    await userModel.create({
      username: finalUsername,
      name: session.user.name,
      email: session.user.email,
    });
  }

  res.redirect(
    getCallbackURL({
      message: "Zarejestrowano pomyślnie",
      error: false,
    })
  );

  // res.status(200).json({
  //   error: {
  //     message: "Not implemented",
  //     isCode: true,
  //     // message: "Username already taken",
  //     // isUser: true,
  //   },
  //   // resetSession: true,
  // });
}

const getCallbackURL = (params) => {
  const newParams = {
    ...params,
    error: params.error ? JSON.stringify(params.error) : false,
  };
  return `/callback?${new URLSearchParams(newParams).toString()}`;
};
