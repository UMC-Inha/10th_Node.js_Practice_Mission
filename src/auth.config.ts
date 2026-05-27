import dotenv from 'dotenv';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { prisma } from './config/db.config';
import { user_gender, user_social_type } from './generated/prisma/enums.js';

dotenv.config();

export type AuthUser = {
  id: bigint;
  email: string;
  name: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const generateAccessToken = (user: { id: bigint; email: string }) => {
  return jwt.sign(
    { id: user.id.toString(), email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' },
  );
};

export const generateRefreshToken = (user: { id: bigint }) => {
  return jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET!, {
    expiresIn: '14d',
  });
};

const googleVerify = async (profile: Profile): Promise<AuthUser> => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new Error('Google 프로필에 이메일이 없습니다.');

  let user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    const nickname = (profile.displayName ?? email.split('@')[0] ?? 'user')
      .replace(/\s+/g, '')
      .slice(0, 10);

    user = await prisma.user.create({
      data: {
        email,
        nickname,
        gender: user_gender.NONE,
        birth: new Date(1970, 0, 1),
        social_id: profile.id,
        social_type: user_social_type.GOOGLE,
        created_at: new Date(),
      },
    });
  }

  return { id: user.id, email: user.email, name: user.nickname };
};

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
    callbackURL: '/oauth2/callback/google',
    scope: ['email', 'profile'],
  },
  async (_accessToken, _refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);
      const tokens: AuthTokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
      return cb(null, tokens);
    } catch (err) {
      return cb(err as Error);
    }
  },
);
