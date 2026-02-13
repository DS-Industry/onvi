export type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
};

export type ImageData = {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats?: {
      small: ImageFormat;
      thumbnail: ImageFormat;
    } | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type NewsPost = {
  id: number;
  attributes: {
    title: string;
    content: string;
    slug: string;
    url: string | null;
    screen_redirect: string | null;
    button_title: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: {data: ImageData};
    vertical_image: {data: ImageData};
    horizontal_image: {data: ImageData};
  };
};

export type NewsPostsSuccessRequestPayload = {
  data: NewsPost[];
  meta: Meta;
};

export type NewsPostSuccessRequestPayload = {
  data: NewsPost;
  meta: Meta;
};

export type Partner = {
  id: number;
  attributes: {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    content: string;
    identifier: number;
    integration_type: string;
    itegration_data: any;
    button_title: string;
    image: {data: ImageData};
    partner_icon: {data: ImageData};
    category: string;
    bonus_type: string;
    bonus: number;
  };
};

export type PartnerSuccessRequestPayload = {
  data: Partner;
  meta: Meta;
};

export type PartnersSuccessRequestPayload = {
  data: Partner[];
  meta: Meta;
};

export type StrapiCampaign = {
  id: number;
  attributes: {
    title: string;
    content: string;
    inserted_at: string;
    button_title: string;
    slug: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: {
      data: ImageData;
    };
  };
};

export enum EExecutionType {
  sheduled = 'SCHEDULED',
  transactional = 'TRANSACTIONAL',
}

export interface NewCampaign {
  id: number;
  name: string;
  description: string | null;
  executionType: EExecutionType;
  launchDate: string;
  endDate: string;
  action: {
    id: number;
    actionType: string;
    payload: any;
  };
  conditions: Array<{
    id: number;
    tree: any[];
  }>;
  mobileDisplay: {
    id: number;
    marketingCampaignId: number;
    imageLink: string;
    description: string | null;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
}

type Meta = {
  pagination?: Pagination;
};

type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type Location = {
  lat: number;
  lon: number;
};

export type Box = {
  id: string;
  number: number;
  status: string; // You can create an enum for status (e.g., 'Free', 'Occupied')
};

export type Price = {
  id: number;
  name: string;
  serviceInfo: string[]; // Assuming serviceInfo is an array of any type
  description: string;
  serviceDuration: number;
  cost: number;
  costType: 'PerMinute' | 'Fixed'; // Assuming costType is either 'PerMinute' or 'Fixed'
};

export type Tag = {
  name: string;
  color?: string; // Color is optional
};

export type CarWash = {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  type: CarWashType; // You can create an enum for type (e.g., 'SelfService', 'Automatic')
  stepCost: number;
  limitMinCost: number;
  limitMaxCost: number;
  boxes: Box[];
  vacuums: Box[];
  price: Price[];
  tags: Tag[];
  IsLoyaltyMember: boolean;
};

export type CarWashLocation = {
  location: Location;
  carwashes: CarWash[];
  distance?: number;
};

export interface CarWashWithLocation extends CarWash {
  location: Location;
  distance?: number;
};

export type BusinessSuccessRequestPayload = {
  businessesLocations: CarWashLocation[];
};

export enum CarWashType {
  SELFSERVICE = 'SelfService',
  PORTAL = 'Portal',
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
