export interface UpdateRestaurantDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  // image?: string;
  //   isActive: boolean;
  openingHours?: Record<string, string>;
}
