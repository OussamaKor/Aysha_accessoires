import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  try {
    const token = await getToken({ req });
    const session = await getSession({ req });

    return res.status(200).json({
      token: token ? {
        _id: token._id,
        isAdmin: token.isAdmin,
        email: token.email,
      } : null,
      session: session ? {
        user: session.user,
      } : null,
      cookies: req.cookies,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
