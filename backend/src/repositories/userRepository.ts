import { prisma } from "../config/prisma";

type CreateUserData = {
  googleId: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function findUserByGoogleId(googleId: string) {
  return prisma.user.findUnique({
    where: { googleId },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: CreateUserData) {
  return prisma.user.create({
    data,
  });
}

export async function updateUser(
  id: string,
  data: {
    googleId?: string;
    name?: string;
    email?: string;
    avatarUrl?: string | null;
  },
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}