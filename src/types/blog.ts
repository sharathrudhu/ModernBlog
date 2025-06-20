export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  category: string;
  featured: boolean;
}

export interface ReadingProgressSection {
  id: string;
  title: string;
  progress: number;
  element?: Element;
}