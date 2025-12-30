export interface CreateRestaurantDto {
  name: string;
  description: string;
  address: string;
  country: string;
  phone: string;
  website?: string;
  isActive:boolean;
  openingHours?: Record<string, string>;
  userId: string;
}
