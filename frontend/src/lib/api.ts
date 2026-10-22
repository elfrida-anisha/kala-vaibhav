import {
  User,
  ArtisanProfile,
  Product,
  CraftPassport,
  CraftJourneyItem,
  CustomRequest,
  CommissionProposal,
  Order,
  ExtractedProductDetails,
  PricingBreakdown,
  AdminMetrics,
  AuditLog,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('kv_token');
  const demoUserId = localStorage.getItem('kv_demo_user_id');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (demoUserId) {
    headers['X-Demo-User'] = demoUserId;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async demoLogin(role: string, id?: string) {
    return request<{ token: string; user: User; artisanProfile?: ArtisanProfile; isDemo: boolean }>(
      '/auth/demo-login',
      {
        method: 'POST',
        body: JSON.stringify({ role, id }),
      }
    );
  },

  async login(email: string) {
    return request<{ token: string; user: User; artisanProfile?: ArtisanProfile }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  },

  async register(params: { email: string; fullName: string; role: string; phone?: string; region?: string; bio?: string }) {
    return request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getMe() {
    return request<{ user: User; artisanProfile?: ArtisanProfile }>('/auth/me');
  },

  async getDemoAccounts() {
    return request<{ accounts: any[] }>('/auth/demo-accounts');
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string; artisanId?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.minPrice) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
    if (params?.sort) query.set('sort', params.sort);
    if (params?.artisanId) query.set('artisanId', params.artisanId);

    const qs = query.toString();
    return request<{ products: Product[]; count: number }>(`/products${qs ? `?${qs}` : ''}`);
  },

  async getProduct(id: string) {
    return request<{ product: Product; passport?: CraftPassport; journeyItems: CraftJourneyItem[] }>(
      `/products/${id}`
    );
  },

  async createProduct(data: {
    title: string;
    craftType: string;
    category: string;
    description: string;
    price: number;
    materials?: string;
    timeToMake?: string;
    stockQuantity: number;
    region?: string;
    imageUrls: string[];
  }) {
    return request<{ message: string; product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Partial<Product>) {
    return request<{ message: string; product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string) {
    return request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Passports
  async getPassport(productId: string) {
    return request<{ passport: CraftPassport }>(`/passports/${productId}`);
  },

  async verifyPassport(id: string, status: string, notes: string) {
    return request<{ message: string; newStatus: string }>(`/passports/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Craft Journey
  async getJourney(productId: string) {
    return request<{ items: CraftJourneyItem[]; count: number }>(`/journey/${productId}`);
  },

  async addJourneyItem(data: {
    productId: string;
    title: string;
    description?: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    stepOrder: number;
    milestoneDate?: string;
  }) {
    return request<{ message: string; item: CraftJourneyItem }>('/journey', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Custom Requests (CreateConnect)
  async getCustomRequests(mine = false) {
    return request<{ requests: CustomRequest[]; count: number }>(
      `/custom-requests${mine ? '?mine=true' : ''}`
    );
  },

  async getCustomRequest(id: string) {
    return request<{ request: CustomRequest }>(`/custom-requests/${id}`);
  },

  async createCustomRequest(data: {
    title: string;
    description: string;
    craftType: string;
    preferences?: Record<string, any>;
    referenceImageUrl?: string;
    isPrivate: boolean;
    budgetMin: number;
    budgetMax: number;
    desiredDate?: string;
  }) {
    return request<{ message: string; request: CustomRequest }>('/custom-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async submitProposal(requestId: string, data: { proposedPrice: number; estimatedDays: number; message: string }) {
    return request<{ message: string; proposal: CommissionProposal }>(
      `/custom-requests/${requestId}/proposals`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async acceptProposal(requestId: string, proposalId: string) {
    return request<{ message: string }>(`/custom-requests/${requestId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ proposalId }),
    });
  },

  async updateMilestone(requestId: string, status: string) {
    return request<{ message: string; newStatus: string }>(
      `/custom-requests/${requestId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  },

  // Orders
  async createOrder(data: {
    items: Array<{ productId?: string; customRequestId?: string; quantity: number; unitPrice?: number }>;
    shippingAddress: any;
    isDemo?: boolean;
  }) {
    return request<{ message: string; order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getOrder(id: string) {
    return request<{ order: Order }>(`/orders/${id}`);
  },

  async getMyOrders() {
    return request<{ orders: Order[]; count: number }>('/orders/my-orders');
  },

  async updateOrderStatus(id: string, status: string) {
    return request<{ message: string; newStatus: string }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Payments
  async createPaymentOrder(orderId: string) {
    return request<{
      mode: 'razorpay_test' | 'mock_checkout';
      orderId: string;
      keyId?: string;
      razorpayOrderId?: string;
      mockPaymentId?: string;
      amount: number;
      currency: string;
      buyerName: string;
      isDemo?: boolean;
      message?: string;
    }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  async verifyPayment(data: {
    orderId: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    isMock?: boolean;
  }) {
    return request<{ message: string; order: Order; isMock?: boolean }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // AI & Voice
  async extractVoiceListing(transcript: string, language?: string) {
    return request<{ transcript: string; extracted: ExtractedProductDetails; engine: string }>(
      '/ai/extract-listing',
      {
        method: 'POST',
        body: JSON.stringify({ transcript, language }),
      }
    );
  },

  async getPricingGuidance(data: {
    craftType: string;
    materialCost: number;
    labourHours: number;
    hourlyRate?: number;
    overheadsCost?: number;
    packagingCost?: number;
    complexityTier?: string;
  }) {
    return request<{ pricing: PricingBreakdown }>('/ai/pricing-guidance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async askBuyerAssistant(message: string) {
    return request<{ response: string; suggestions?: Product[] }>('/ai/buyer-assistant', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Admin
  async getAdminMetrics() {
    return request<{ metrics: AdminMetrics }>('/admin/metrics');
  },

  async getAuditLogs() {
    return request<{ logs: AuditLog[]; count: number }>('/admin/audit-logs');
  },

  async getPendingPassports() {
    return request<{ passports: CraftPassport[]; count: number }>('/admin/passports/pending');
  },

  async getAdminUsers() {
    return request<{ users: User[]; count: number }>('/admin/users');
  },

  // File Upload
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {
      ...getAuthHeader(),
    };

    const response = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    return data as { url: string; filename: string; size: number };
  },
};
