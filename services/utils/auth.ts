import { getSession } from "next-auth/react";

export async function authProtected(req, fn) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        status: 403,
        permanent: false,
      },
    };
  }

  return await fn(session);
}
