export enum roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type User = {
  id: number;
  email: string;
  name: string;
  role: roles;
};

export type JwtPayload = {
  sub: number;
  email: string;
};
