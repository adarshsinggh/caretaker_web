export interface User {
  name: string;
  email: string;
  token?: string;
}

export interface Parent {
  _id?: string;
  name: string;
  contact: string;
  address: string;
  medicalInfo: string;
  age: number;
}

export interface Helper {
  _id: string;
  name: string;
  email: string;
  age: number;
  experience: string;
  services: string[];
  availability: {
    day: string;
    from: string;
    to: string;
    _id: string;
  }[];
  location: {
    type: string;
    coordinates: number[];
  };
}

export interface Address {
  _id: string;
  label: string;
  address: string;
  coordinates: number[];
}

export interface Booking {
  _id?: string;
  parentId: string;
  serviceType: string;
  serviceDate: string;
  recurring: boolean;
  specialInstructions: string;
  paymentMethod: string;
  discountCode?: string;
  status?: string;
}

export interface ApiResponse {
  message: string;
  [key: string]: any;
}