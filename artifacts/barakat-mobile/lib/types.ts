export interface Property {
  id: string | number;
  title: string;
  price: string;
  priceNote: string;
  addr: string;
  rooms: number;
  area: number;
  floor: string;
  type: string;
  image: string;
  images: string[];
  tag: string;
  tagLabel: string;
  sellerId: string;
  agent: string;
  agentAvatar: string;
  agentName: string;
  deals: number;
  rating: number;
  telegram: string;
  instagram: string;
  year: string;
  new: boolean;
  propertyType: string;
  district: string;
  features: string;
  description: string;
  constructionStage: string;
  renovation: string;
  documentType: string;
  landmark: string;
  phone: string;
  lat: number | null;
  lng: number | null;
  source: string;
}

export interface Service {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  cardText: string;
  priceLabel: string;
  cta: string;
  highlights: string[];
}
