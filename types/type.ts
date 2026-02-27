// Types matching your Prisma schema
export interface User {
  id: string;
  email: string;
  username: string | null;
  role: "ADMIN" | "AUTHOR" | "EDITOR" | "USER";
  image: string | null;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
  // Optional relations when included
  posts?: Post[];
  comments?: Comment[];
  likes?: Like[];
}

export interface Like {
  id: string;
  postId: string | null; // Note: not optional (?) but can be null
  commentId: string | null;
  userId: string;
  createdAt: Date;

  // Optional relations when included
  post?: Post;
  comment?: Comment;
  user?: User;
}

export interface Comment {
  id: string;
  comment: string;
  postId: string;
  userId: string;
  parentId: string | null; // null for top-level comments

  // Optional relations when included
  post?: Post;
  user?: User;
  parent?: Comment | null;
  replies?: Comment[];

  likes?: Like[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  coverImage: string;
  readTime: number;
  authorId: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Optional relations when included
  author?: User;
  comments?: Comment[];
  likes?: Like[];
}

// Alternative simpler version if you just need basic counts/stats
export interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    coverImage: string;
    publishedAt: Date | null;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;

    likes: Like[];
    comments: Comment[];

    // Minimal author info
    author?: {
      id: string;
      username: string | null;
      image: string | null;
    };
  };
}

export type CommentWithAuthor = {
  id: string;
  comment: string;
  createdAt: Date;
  user: {
    id: string;
    username: string | null;
    image: string | null;
  };
};