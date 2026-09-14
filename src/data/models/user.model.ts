export interface UserModel {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'standard' | 'guest';
  jobTitle?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface OrderModel {
  orderId?: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}
