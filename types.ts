export enum ViewState {
  HOME = 'HOME',
  ADMIN = 'ADMIN',
  BOOKING_SUCCESS = 'BOOKING_SUCCESS'
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  duration: string; // e.g., "5 Days / 4 Nights"
  price: number;
  description: string;
  image: string;
  highlights: string[];
}

export interface Booking {
  id: string;
  packageId: string;
  packageTitle: string;
  customerName: string;
  email: string;
  phone: string;
  travelDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
