export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  materials: Material[]
  defaultMaterial: string
  images: string[]
  model3D?: string
  inStock: boolean
  featured?: boolean
  specifications: {
    weight?: string
    dimensions?: string
    gemstone?: string
    carats?: string
    purity?: string
  }
}

export interface Material {
  id: string
  name: string
  color: string
  metallic: number
  roughness: number
  price: number
}

export interface CartItem {
  product: Product
  selectedMaterial: Material
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

export interface User {
  id: string
  email: string
  name: string
  addresses: Address[]
}

export interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: Date
  shippingAddress: Address
}
