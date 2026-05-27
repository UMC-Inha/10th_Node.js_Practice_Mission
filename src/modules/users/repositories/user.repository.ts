import { prisma } from "../../../db.config.js";
import { FoodType } from "../../../generated/prisma/enums.js";

interface AddUserParams {
  email: string;
  password: string;
  name: string;
  gender?: string;
  birth?: Date;
  address?: string;
  detailAddress?: string;
  phoneNumber?: string;
  provider?: string;
}

// 이메일로 사용자 조회
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// 사용자 생성
export const addUser = async (data: AddUserParams) => {
  return await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detail: data.detailAddress,
      phoneNumber: data.phoneNumber,
      provider: data.provider ?? "local",
    },
  });
};

// 사용자 조회
export const getUser = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { userId },
  });
};

// 선호 카테고리 설정
export const setPreference = async (
  userId: number,
  foodType: FoodType,
): Promise<void> => {
  await prisma.userPreference.create({
    data: {
      userId,
      foodType,
    },
  });
};

// 사용자 선호 조회
export const getUserPreferencesByUserId = async (
  userId: number,
) => {
  return await prisma.userPreference.findMany({
    where: { userId },
    orderBy: { foodType: "asc" },
  });
};

// 사용자 정보 수정
interface UpdateUserParams {
  gender?: string;
  birth?: Date;
  address?: string;
  city?: string;
  district?: string;
  neighborhood?: string;
  detail?: string;
  phoneNumber?: string;
}

export const updateUser = async (
  userId: number,
  data: UpdateUserParams,
) => {
  return await prisma.user.update({
    where: { userId },
    data,
  });
};