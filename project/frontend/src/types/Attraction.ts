export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdOn: string;
  createdBy: string;
};


export type Attraction = {
  id: string;
  name: string;
  description: string;
  photos: string[];
  longitude: string;
  latitude: string;
  category: string;
  reviews?: Review[];
  averageRating?: number;
};
