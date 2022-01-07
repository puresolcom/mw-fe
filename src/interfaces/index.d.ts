export interface IRole {
  id: string;
  name: string;
  description: string;
}
export interface IUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface IPost {
  id: string;
  content: string;
  imageUrl: string;
  author: IAuthor;
  likesCount: number;
  createdAt: string;
  likes: ILike[];
  categories: ICategory[];
  tags: ITag[];
}

export interface IAuthor {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface ILike {
  id: string;
  postId: string;
  userId: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface ITag {
  id: string;
  name: string;
}
