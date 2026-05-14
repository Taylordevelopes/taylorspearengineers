type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
};

type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    created_at: string;
  };
};

type BlogPost = {
  id: string;
  blogger_id: string;
  title: string;
  slug: string;
  body: string;
  created_at: string;
  published: boolean;
  updated_at: string;
};

export type { User, LoginResponse, BlogPost };
