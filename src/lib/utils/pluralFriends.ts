export const pluralFriends = (count: number): string => {
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return "ДРУЗЕЙ";
  }

  const mod10 = count % 10;
  if (mod10 === 1) {
    return "ДРУГ";
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return "ДРУГА";
  }
  return "ДРУЗЕЙ";
};
