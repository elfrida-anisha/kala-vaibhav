export type UserRole = 'artisan' | 'buyer' | 'admin';

export type ProvenanceStatus = 'artisan-declared' | 'community-reviewed' | 'independently-verified';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  region?: string;
  createdAt: string;
}

export interface ArtisanProfile {
  id: string;
  profileId: string;
  craftSpecialty: string;
  experienceYears: number;
  studioAddress?: string;
  state: string;
  verificationStatus: ProvenanceStatus;
  verificationNotes?: string;
  phonePublic: boolean;
  giTagAffiliated: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  artisanId: string;
  artisanName?: string;
  artisanRegion?: string;
  artisanAvatar?: string;
  title: string;
  craftType: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  materials?: string;
  timeToMake?: string;
  stockQuantity: number;
  status: 'draft' | 'active' | 'out_of_stock' | 'archived';
  region?: string;
  images: ProductImage[];
  createdAt: string;
}

export interface CraftPassport {
  id: string;
  productId: string;
  passportNumber: string;
  artisanId: string;
  artisanName?: string;
  craftName: string;
  region: string;
  materials: string;
  techniques: string;
  timeAndEffort: string;
  culturalStory: string;
  provenanceStatus: ProvenanceStatus;
  verificationDetails?: {
    verifiedBy?: string;
    auditDate?: string;
    giCertified?: boolean;
    communityConsensus?: string;
  };
  createdAt: string;
}

export interface CraftJourneyItem {
  id: string;
  productId: string;
  artisanId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  stepOrder: number;
  milestoneDate?: string;
  createdAt: string;
}

export interface CommissionProposal {
  id: string;
  customRequestId: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar?: string;
  proposedPrice: number;
  estimatedDays: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface CustomRequest {
  id: string;
  buyerId: string;
  buyerName?: string;
  title: string;
  description: string;
  craftType: string;
  preferences?: Record<string, any>;
  referenceImageUrl?: string;
  isPrivate: boolean;
  budgetMin: number;
  budgetMax: number;
  desiredDate?: string;
  status: 'submitted' | 'reviewing' | 'proposal_received' | 'accepted' | 'in_production' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled';
  proposalsCount?: number;
  proposals?: CommissionProposal[];
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  customRequestId?: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName?: string;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'paid' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  isDemo: boolean;
  items: OrderItem[];
  paymentId?: string;
  createdAt: string;
}

export interface ExtractedProductDetails {
  productName: string;
  craftType: string;
  category: string;
  price: number;
  currency: string;
  materials?: string | null;
  timeToMake: string;
  description: string;
  stockQuantity: number;
  confidenceScore: number;
  status: string;
  missingQuestions?: string[];
  clarification?: string;
}

export interface PricingBreakdown {
  materialCost: number;
  labourCost: number;
  overheadsCost: number;
  packagingCost: number;
  baseProductionCost: number;
  fairArtisanMargin: number;
  recommendedMinPrice: number;
  recommendedFairPrice: number;
  recommendedMaxPrice: number;
  guidanceNotes: string;
}

export interface AdminMetrics {
  totalArtisans: number;
  totalBuyers: number;
  totalProducts: number;
  totalOrders: number;
  totalVolumeINR: number;
  customRequestsCount: number;
  pendingPassports: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName?: string;
  action: string;
  targetType: string;
  targetID: string;
  details?: Record<string, any>;
  createdAt: string;
}
