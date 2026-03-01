// API Client for connecting to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  auth = {
    login: (phone: string, password: string) =>
      this.request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      }),
    register: (phone: string, password: string, nickname?: string) =>
      this.request<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ phone, password, nickname }),
      }),
    quickLogin: (phone: string, code?: string) =>
      this.request<{ token?: string; user?: User; success?: boolean }>('/auth/quick-login', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
      }),
    getMe: () => this.request<User>('/auth/me'),
    updateProfile: (data: Partial<User>) =>
      this.request<User>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // Products
  products = {
    getAll: (params?: {
      category?: string;
      search?: string;
      sort?: string;
      order?: string;
      limit?: number;
      offset?: number;
      featured?: boolean;
    }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return this.request<Product[]>(`/products${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => this.request<Product>(`/products/${id}`),
    getRecommendations: (limit = 10) =>
      this.request<Product[]>(`/products/recommendations/list?limit=${limit}`),
    getByCategory: (slug: string, limit = 20, offset = 0) =>
      this.request<Product[]>(`/products/category/${slug}?limit=${limit}&offset=${offset}`),
    getReviews: (id: string, limit = 10, offset = 0) =>
      this.request<Review[]>(`/products/${id}/reviews?limit=${limit}&offset=${offset}`),
    toggleFavorite: (id: string, userId: string) =>
      this.request<{ favorited: boolean }>(`/products/${id}/favorite`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),
    getFavorites: (userId: string) =>
      this.request<Favorite[]>(`/products/favorites/list?userId=${userId}`),
  };

  // Categories
  categories = {
    getAll: () => this.request<Category[]>('/categories'),
    getBySlug: (slug: string) => this.request<Category>(`/categories/${slug}`),
  };

  // Cart
  cart = {
    getAll: (userId: string) => this.request<CartItem[]>(`/cart?userId=${userId}`),
    add: (userId: string, productId: string, quantity = 1, specifications?: object) =>
      this.request<CartItem>('/cart', {
        method: 'POST',
        body: JSON.stringify({ userId, productId, quantity, specifications }),
      }),
    update: (id: string, quantity: number) =>
      this.request<CartItem>(`/cart/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),
    remove: (id: string) =>
      this.request<{ success: boolean }>(`/cart/${id}`, { method: 'DELETE' }),
    clear: (userId: string) =>
      this.request<{ success: boolean }>(`/cart?userId=${userId}`, { method: 'DELETE' }),
  };

  // Orders
  orders = {
    getAll: (userId: string, status?: string, limit = 20, offset = 0) => {
      const params = new URLSearchParams({ userId, limit: String(limit), offset: String(offset) });
      if (status) params.append('status', status);
      return this.request<Order[]>(`/orders?${params.toString()}`);
    },
    getById: (id: string) => this.request<Order>(`/orders/${id}`),
    create: (data: {
      userId: string;
      items: { productId: string; quantity: number; specifications?: object }[];
      address: Address;
      paymentMethod: string;
      couponId?: string;
      remark?: string;
    }) =>
      this.request<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: string) =>
      this.request<Order>(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    cancel: (id: string) =>
      this.request<Order>(`/orders/${id}/cancel`, { method: 'PUT' }),
    getStats: (userId: string) =>
      this.request<OrderStats>(`/orders/stats/count?userId=${userId}`),
  };

  // Addresses
  addresses = {
    getAll: (userId: string) => this.request<Address[]>(`/addresses?userId=${userId}`),
    getById: (id: string) => this.request<Address>(`/addresses/${id}`),
    create: (data: Omit<Address, 'id' | 'created_at' | 'updated_at'>) =>
      this.request<Address>('/addresses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Address>) =>
      this.request<Address>(`/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    remove: (id: string) =>
      this.request<{ success: boolean }>(`/addresses/${id}`, { method: 'DELETE' }),
    setDefault: (id: string, userId: string) =>
      this.request<Address>(`/addresses/${id}/default`, {
        method: 'PUT',
        body: JSON.stringify({ userId }),
      }),
  };

  // Coupons
  coupons = {
    getAll: () => this.request<Coupon[]>('/coupons'),
    getUserCoupons: (userId: string) =>
      this.request<UserCoupon[]>(`/coupons/user?userId=${userId}`),
    receive: (userId: string, couponId: string) =>
      this.request<UserCoupon>('/coupons/receive', {
        method: 'POST',
        body: JSON.stringify({ userId, couponId }),
      }),
    use: (userId: string, userCouponId: string, orderId?: string) =>
      this.request<{ success: boolean }>('/coupons/use', {
        method: 'POST',
        body: JSON.stringify({ userId, userCouponId, orderId }),
      }),
    calculate: (userCouponId: string, orderAmount: number) =>
      this.request<{ discount: number; coupon: Coupon }>('/coupons/calculate', {
        method: 'POST',
        body: JSON.stringify({ userCouponId, orderAmount }),
      }),
  };
}

export const api = new ApiClient();

// Types
export interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar_url: string;
  member_level: string;
  points: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  category?: Category;
  price: number;
  original_price: number;
  stock: number;
  sales_count: number;
  rating: number;
  review_count: number;
  tags: string[];
  specifications: object;
  is_active: boolean;
  is_featured: boolean;
  images: { image_url: string; sort_order: number }[];
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  specifications: object;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  product_amount: number;
  shipping_fee: number;
  tax_amount: number;
  discount_amount: number;
  shipping_address: Address;
  remark: string;
  paid_at: string;
  shipped_at: string;
  delivered_at: string;
  completed_at: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  specifications: object;
  subtotal: number;
}

export interface Address {
  id: string;
  user_id: string;
  receiver_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail_address: string;
  is_default: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number;
  valid_from: string;
  valid_until: string;
}

export interface UserCoupon {
  id: string;
  user_id: string;
  coupon_id: string;
  status: string;
  coupon?: Coupon;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  rating: number;
  content: string;
  images: string[];
  is_anonymous: boolean;
  user?: { nickname: string; avatar_url: string };
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
}

export interface OrderStats {
  unpaid: number;
  unshipped: number;
  shipped: number;
  completed: number;
  refund: number;
}
