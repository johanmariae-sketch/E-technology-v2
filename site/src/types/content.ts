export interface Product {
  id: string;
  name: string;
  variant: string;
  fullName: string;
  price: number;
  priceFormatted: string;
  category: "phones" | "tablets" | "accessories" | "wearables";
  image: string;
  whatsappUrl: string;
  isNew: boolean;
}

export interface ProductCatalog {
  products: Product[];
  categories: string[];
  lastUpdated: string;
}

export interface ProcessedPost {
  id: string;
  date: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  type: "image" | "video" | "carousel" | "reel";
  images: string[];
  video: string | null;
  url: string;
  category: string;
}

export interface SiteContent {
  profile: {
    username: string;
    fullName: string;
    bio: string;
    followers: number;
    following: number;
    postsCount: number;
    avatar: string;
    isVerified: boolean;
    externalUrl: string;
    lastUpdated: string;
  };
  posts: ProcessedPost[];
  categories: string[];
  stats: {
    totalPosts: number;
    totalImages: number;
    totalVideos: number;
    totalReels: number;
    avgLikes: number;
  };
}
