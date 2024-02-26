import type { User } from "src/api/models/user";

export const getUserInitials = ({ firstName, lastName }: User) => {
  return firstName[0] + lastName[0];
};
