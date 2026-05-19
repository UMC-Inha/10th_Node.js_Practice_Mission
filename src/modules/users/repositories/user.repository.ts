import { prisma } from "../../../db.config.js";

interface AddUserParams {
  email: string;
  password: string;
  name: string;
  gender: string;
  birth: Date;
  address: string;
  detailAddress: string;
  phoneNumber: string;
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
    },
  });
};

// 사용자 조회
export const getUser = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { userId },
  });
};

// 3. 선호 카테고리 설정
export const setPreference = async (
  userId: number,
  foodCategoryId: number,
): Promise<void> => {
  await prisma.userPreference.create({
    data: {
      userId,
      foodCategoryId,
    },
  });
};

// 4. 사용자 선호 조회
export const getUserPreferencesByUserId = async (userId: number) => {
  return await prisma.userPreference.findMany({
    where: { userId },
    orderBy: { foodCategoryId: "asc" },
  });
};