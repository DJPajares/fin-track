export type CreateUserBody = {
  id: string;
  email?: string;
  name?: string;
  image?: string;
};

export type UpdateUserBody = Partial<Omit<CreateUserBody, 'id'>>;

export type UserParams = {
  id: string;
};
