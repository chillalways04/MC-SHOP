// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomePage from '../views/HomePage.vue'
import SavedView from '../views/SavedView.vue'
import StreetwearView from '../views/Streetwear.vue'
import LuxuryView from '../views/LuxuryView.vue'
import CollectiblesView from '../views/Collectibles.vue'
import MenView from '../views/Men.vue'
import WomenView from '../views/Women.vue'
import ProductDetailView from '../views/ProductDetail.vue'
import CartView from '../views/CartView.vue'
import AddAddressView from '../views/AddAddressView.vue'
import MyOrdersView from '../views/MyOrdersView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import OrderConfirmedView from '../views/OrderConfirmedView.vue'
import PromptPayView from '../views/PromptPayView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/home', name: 'home', component: HomePage },
    { path: '/saved', name: 'saved', component: SavedView },
    { path: '/streetwear', name: 'streetwear', component: StreetwearView },
    { path: '/luxury', name: 'luxury', component: LuxuryView },
    { path: '/collectibles', name: 'collectibles', component: CollectiblesView },
    { path: '/men', name: 'men', component: MenView },
    { path: '/women', name: 'women', component: WomenView },
    { path: '/orders', name: 'orders', component: MyOrdersView },

    // Product Detail
    {
      path: '/product',
      name: 'product-detail',
      component: ProductDetailView,
    },

    // Cart Page
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
    },

    // Add Address Page
    {
      path: '/address/new',
      name: 'address-new',
      component: AddAddressView,
    },

    // 🟦 Checkout Page
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/order-confirmed',
      name: 'order-confirmed',
      component: OrderConfirmedView,
    },
    {
      path: '/promptpay',
      name: 'promptpay',
      component: PromptPayView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfileView,
    },
  ],
})

export default router
