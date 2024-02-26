export type AuthResponse = {
  succeeded: boolean;
  message: string;
  data: {
    id: string;
    userName: string;
    email: string;
    roles: string[];
    isVerified: boolean;
    jwToken: string;
    refreshToken: string;
  };
};

export type RegisterResponse = {
  succeeded: boolean;
  message: string;
  data: string;
};
