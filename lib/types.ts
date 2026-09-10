export type Review = {
  id: string;
  business_id: string;
  customer_name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  product_model?: string;
  verified_purchase: boolean;
  photo_urls: string[];
  approved: boolean;
  created_at: string;
};

export type ReviewSummary = {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

export type Business = {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
  created_at: string;
};

export type CreateReviewRequest = {
  customer_name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  product_model?: string;
  verified_purchase?: boolean;
  photos?: File[];
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
