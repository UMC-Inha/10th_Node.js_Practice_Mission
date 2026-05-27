import dotenv from "dotenv";
import {
  Strategy as GoogleStrategy,
  Profile,
} from "passport-google-oauth20";

import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { prisma } from "./db.config.js"; // Prisma 설정 파일 경로 확인 필요

dotenv.config();

// 1. JWT 토큰 생성 함수 (타입 지정)
export const generateAccessToken = (user: {
  userId: number;
  email: string;
}) => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user: {
  userId: number;
}) => {
  return jwt.sign(
    {
      userId: user.userId,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "14d" }
  );
};

// 2. Google Verify 로직 
const googleVerify = async (profile: Profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) throw new Error("Google 프로필에 이메일이 없습니다.");

  let user = await prisma.user.findFirst({ where: { email } });

   if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: "GOOGLE_LOGIN_USER",
        name: profile.displayName,

        gender: "추후 수정",
        birth: new Date("1970-01-01"),

        phoneNumber: "추후 수정",

        address: "추후 수정",
        city: "추후 수정",
        district: "추후 수정",
        neighborhood: "추후 수정",
        detail: "추후 수정",
      },
    });
  }

  return {
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

// 3. Google Strategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },
  async (_accessToken, _refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);
      const tokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
      return cb(null, tokens);
    } catch (err) {
      return cb(err as Error);
    }
  }
);

// Github Verify 로직
const githubVerify = async (profile: any) => {
  const email =
    profile.emails?.[0]?.value ||
    `${profile.username}@github.com`;

  let user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: "GITHUB_LOGIN_USER",
        name: profile.displayName || profile.username,

        gender: "추후 수정",
        birth: new Date("1970-01-01"),
        phoneNumber: "추후 수정",

        address: "추후 수정",
        city: "추후 수정",
        district: "추후 수정",
        neighborhood: "추후 수정",
        detail: "추후 수정",
      },
    });
  }

  return {
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

// Github Strategy
export const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "/oauth2/callback/github",
    scope: ["user:email"],
  },
  async (_accessToken: string, _refreshToken: string, profile: any, cb: any) => {
    try {
      const user = await githubVerify(profile);

      const tokens = {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };

      return cb(null, tokens);
    } catch (err) {
      return cb(err as Error);
    }
  },
);

// JWT 검증 미들웨어
export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
  },
  async (payload, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { userId: payload.id } });
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }
);

// 로컬 strategy
export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return done(null, false, { message: "존재하지 않는 유저" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: "비밀번호 불일치" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);