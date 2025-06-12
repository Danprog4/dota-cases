export const getIsAdmin = (userId: number) => {
  const admins = process.env.ADMINS_IDS?.split(",").map(Number);
  return admins?.includes(userId);
};
