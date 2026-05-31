import dotenv from 'dotenv';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import {
  Strategy as NaverStrategy,
  Profile as NaverProfile,
} from 'passport-naver-v2';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './config/db.config';
import { user_gender, user_social_type } from './generated/prisma/enums.js';
import { AppError } from './common/app-error';
import { USER_ERROR_CODE } from './common/error-code';
import { StatusCodes } from 'http-status-codes';

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

const naverVerify = async (profile: NaverProfile): Promise<AuthUser> => {
  const email = profile.email;
  if (!email) throw new Error('네이버 프로필에 이메일이 없습니다.');

  let user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    const nickname = (profile.nickname ?? profile.name ?? email.split('@')[0] ?? 'user')
      .replace(/\s+/g, '')
      .slice(0, 10);

    const gender =
      profile.gender === 'M'
        ? user_gender.MALE
        : profile.gender === 'F'
          ? user_gender.FEMALE
          : user_gender.NONE;

    user = await prisma.user.create({
      data: {
        email,
        nickname,
        gender,
        birth: new Date(1970, 0, 1),
        social_id: profile.id,
        social_type: user_social_type.NAVER,
        created_at: new Date(),
      },
    });
  }

  return { id: user.id, email: user.email, name: user.nickname };
};

export const naverStrategy = new NaverStrategy(
  {
    clientID: process.env.PASSPORT_NAVER_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET!,
    callbackURL: '/oauth2/callback/naver',
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: NaverProfile,
    cb: (err: Error | null, user?: AuthTokens) => void,
  ) => {
    try {
      const user = await naverVerify(profile);
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

const BCRYPT_SALT_ROUNDS = 10;

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);

export type LocalSignUpInput = {
  email: string;
  password: string;
  name?: string;
};

export const localSignUp = async (
  input: LocalSignUpInput,
): Promise<AuthUser> => {
  const existing = await prisma.user.findFirst({
    where: { email: input.email },
  });
  if (existing) {
    throw new AppError(
      USER_ERROR_CODE.EMAIL_ALREADY_EXISTS,
      '이미 존재하는 이메일입니다.',
      StatusCodes.CONFLICT,
    );
  }

  const hashed = await hashPassword(input.password);
  const nickname = (input.name ?? input.email.split('@')[0] ?? 'user')
    .replace(/\s+/g, '')
    .slice(0, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashed,
      nickname,
      gender: user_gender.NONE,
      birth: new Date(1970, 0, 1),
      social_id: `local:${input.email}`,
      created_at: new Date(),
    },
  });

  return { id: user.id, email: user.email, name: user.nickname };
};

const localVerify = async (
  email: string,
  password: string,
): Promise<AuthUser> => {
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user || !user.password) {
    throw new AppError(
      USER_ERROR_CODE.INVALID_CREDENTIALS,
      '이메일 또는 비밀번호가 올바르지 않습니다.',
      StatusCodes.UNAUTHORIZED,
    );
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new AppError(
      USER_ERROR_CODE.INVALID_CREDENTIALS,
      '이메일 또는 비밀번호가 올바르지 않습니다.',
      StatusCodes.UNAUTHORIZED,
    );
  }

  return { id: user.id, email: user.email, name: user.nickname };
};

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
  async (email, password, cb) => {
    try {
      const user = await localVerify(email, password);
      const tokens: AuthTokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
      return cb(null, tokens);
    } catch (err) {
      if (err instanceof AppError) {
        return cb(null, false, { message: err.message });
      }
      return cb(err as Error);
    }
  },
);
