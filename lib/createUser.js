import userModel from "./userModel";

const createUser = async ({ headers, session, finalUsername }) => {
  const currentDate = Date.now();

  const { email, name, image: id } = session.user;

  const ip =
    headers["x-forwarded-for"] || headers["x-real-ip"] || "can't locate";

  return await userModel.create({
    username: finalUsername,
    name,
    email,
    id,
    dateCreated: currentDate,
    dateLastChanged: currentDate,
    usernameChanges: [
      {
        username: finalUsername,
        dateChanged: currentDate,
        ip,
      },
    ],
    ipAccessed: [ip],
    isBanned: false,
  });
};

const updateUser = async ({ headers, session, finalUsername, user }) => {
  const currentDate = Date.now();
  const ip =
    headers["x-forwarded-for"] || headers["x-real-ip"] || "can't locate";

  const ipAccessed = user.ipAccessed.includes(ip)
    ? user.ipAccessed
    : [...user.ipAccessed, ip];

  return await userModel.updateOne(
    { email: session.user.email },
    {
      $push: {
        usernameChanges: {
          username: finalUsername,
          dateChanged: currentDate,
          ip,
        },
      },
      $set: {
        username: finalUsername,
        dateLastChanged: currentDate,
        ipAccessed,
      },
    }
  );
};

export { createUser, updateUser };
