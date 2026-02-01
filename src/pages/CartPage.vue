<template>
  <div class="page-wrapper">
    <HomeButtons />
    
    <main class="main-content">
      <div class="container">
        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Shopping Cart
          </h1>
          <p class="page-subtitle" v-if="cartItems.length">{{ cartItems.length }} item{{ cartItems.length > 1 ? 's' : '' }} in your cart</p>
        </div>

        <!-- Empty State -->
        <transition name="fade">
          <div v-if="cartItems.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items yet</p>
            <button class="btn-primary" @click="goHome">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Start Shopping
            </button>
          </div>
        </transition>

        <!-- Cart Content -->
        <div v-if="cartItems.length > 0" class="cart-layout">
          <!-- Cart Items -->
          <div class="cart-items">
            <TransitionGroup name="list" tag="ul" class="items-list">
              <li v-for="(item, index) in cartItems" :key="item.id" class="cart-item" :style="{ '--delay': index * 0.1 + 's' }">
                <div class="item-image">
                  <img :src="getImageUrl(item.photo_path)" :alt="item.name" />
                </div>
                
                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-description">{{ item.description }}</p>
                  
                  <div class="item-meta">
                    <span class="item-price">${{ item.price.toFixed(2) }}</span>
                    
                    <div class="quantity-control">
                      <button 
                        class="qty-btn" 
                        @click="decreaseQuantity(item)"
                        :disabled="item.quantity <= 1"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                      
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        :max="item.availableQuantity"
                        min="1"
                        class="qty-input"
                        @input="handleInput(item)"
                      />
                      
                      <button 
                        class="qty-btn" 
                        @click="increaseQuantity(item)"
                        :disabled="item.quantity >= item.availableQuantity"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <transition name="fade">
                    <span v-if="item.quantity >= item.availableQuantity" class="max-qty-warning">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      Max quantity reached
                    </span>
                  </transition>
                </div>
                
                <div class="item-actions">
                  <span class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  <button class="remove-btn" @click="removeFromCart(item.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Remove
                  </button>
                </div>
              </li>
            </TransitionGroup>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <div class="summary-card">
              <h3 class="summary-title">Order Summary</h3>
              
              <div class="summary-rows">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>${{ totalPrice.toFixed(2) }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping</span>
                  <span class="free-shipping">Free</span>
                </div>
                <div class="summary-row">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div class="summary-total">
                <span>Total</span>
                <span class="total-amount">${{ totalPrice.toFixed(2) }}</span>
              </div>
              
              <button 
                class="checkout-btn"
                @click="checkout"
                :disabled="isCheckingOut"
              >
                <span v-if="!isCheckingOut">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Proceed to Checkout
                </span>
                <span v-else class="loading-spinner"></span>
              </button>
              
              <div class="secure-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import HomeButtons from './HomeButtons.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface CartItem {
  id: number
  name: string
  description: string
  photo_path: string
  price: number
  quantity: number
  availableQuantity: number
}

export default {
  components: {
    HomeButtons
  },
  setup() {
    const cartItems = ref<CartItem[]>([])
    const timeoutIds = ref<number[]>([])
    const isCheckingOut = ref(false)
    const router = useRouter()

    const goHome = () => router.push('/')

    const getImageUrl = (path: string): string => {
      return `${import.meta.env.VITE_BACKEND_URL}/static/images/500x500/${path}`
    }

    const increaseQuantity = (item: CartItem): void => {
      if (item.quantity < item.availableQuantity) {
        item.quantity++
        updateLocalStorage()
      }
    }

    const decreaseQuantity = (item: CartItem): void => {
      if (item.quantity > 1) {
        item.quantity--
        updateLocalStorage()
      }
    }

    const updateLocalStorage = (): void => {
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    }

    const handleInput = (item: CartItem): void => {
      timeoutIds.value.forEach((id) => clearTimeout(id))
      timeoutIds.value = []

      const timeoutId = setTimeout(() => {
        if (item.quantity < 1) {
          item.quantity = 1
        } else if (item.quantity > item.availableQuantity) {
          item.quantity = item.availableQuantity
        }
        updateLocalStorage()
      }, 500)

      timeoutIds.value.push(timeoutId as unknown as number)
    }

    const fetchAvailableQuantities = async (): Promise<void> => {
      const ids = cartItems.value.map((item) => item.id)
      try {
        const responses = await Promise.all(
          ids.map((id) => axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`))
        )
        responses.forEach((response, index) => {
          const item = cartItems.value[index]
          item.availableQuantity = response.data.quantity
        })
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('API error:', error.response?.data)
        } else {
          console.error('Unexpected error:', error)
        }
      }
    }

    const removeFromCart = (id: number): void => {
      cartItems.value = cartItems.value.filter((item) => item.id !== id)
      updateLocalStorage()
    }

    const checkout = async () => {
      isCheckingOut.value = true
      
      const products = cartItems.value.map((item) => ({
        product_id: item.id,
        quantity: item.quantity
      }))

      const order = { products }

      const getAccessToken = () => {
        const cookieString = document.cookie
        const cookies = cookieString.split('; ')
        const tokenCookie = cookies.find((cookie) => cookie.startsWith('access_token='))
        return tokenCookie ? tokenCookie.split('=')[1] : null
      }

      const token = getAccessToken()

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/`, {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        })

        if (response.status === 401) {
          alert('Please log in to complete your order')
          router.push('/login')
          return
        }

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        localStorage.removeItem('cart')
        cartItems.value = []
        router.push('/profile')
      } catch (error) {
        console.error('Error placing order:', error)
        alert('Failed to place order. Please try again.')
      } finally {
        isCheckingOut.value = false
      }
    }

    const totalPrice = computed((): number => {
      return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })

    onMounted(() => {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        cartItems.value = JSON.parse(storedCart)
      }
      fetchAvailableQuantities()
    })

    return {
      cartItems,
      handleInput,
      fetchAvailableQuantities,
      checkout,
      totalPrice,
      getImageUrl,
      decreaseQuantity,
      increaseQuantity,
      removeFromCart,
      goHome,
      isCheckingOut
    }
  }
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  padding-top: 80px;
}

.main-content {
  padding: var(--space-xl) var(--space-lg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: var(--space-xl);
  animation: fadeInDown 0.5s ease;
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.page-title svg {
  width: 36px;
  height: 36px;
  color: var(--color-primary);
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  text-align: center;
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  animation: fadeInUp 0.5s ease;
}

.empty-icon {
  width: 120px;
  height: 120px;
  background: var(--color-bg-card);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
  animation: float 3s ease-in-out infinite;
}

.empty-icon svg {
  width: 60px;
  height: 60px;
  color: var(--color-text-muted);
}

.empty-state h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary svg {
  width: 20px;
  height: 20px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

/* Cart Layout */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-xl);
  align-items: start;
}

/* Cart Items */
.cart-items {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.items-list {
  padding: var(--space-md);
}

.cart-item {
  display: grid;
  grid-template-columns: 140px 1fr auto;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
  animation: fadeInUp 0.5s ease backwards;
  animation-delay: var(--delay);
  transition: all var(--transition-base);
}

.cart-item:last-child {
  margin-bottom: 0;
}

.cart-item:hover {
  background: var(--color-bg-glass);
}

.item-image {
  width: 140px;
  height: 140px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.cart-item:hover .item-image img {
  transform: scale(1.05);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.item-description {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-top: auto;
}

.item-price {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary-light);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-xs);
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-btn svg {
  width: 16px;
  height: 16px;
}

.qty-input {
  width: 50px;
  padding: var(--space-xs);
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-align: center;
  -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.max-qty-warning {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-xs);
  color: var(--color-warning);
}

.max-qty-warning svg {
  width: 14px;
  height: 14px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-md);
}

.item-total {
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.remove-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--color-error);
  color: var(--color-error);
}

/* Order Summary */
.order-summary {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  animation: fadeInRight 0.5s ease;
}

.summary-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.free-shipping {
  color: var(--color-success);
  font-weight: 500;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-lg);
}

.summary-total span:first-child {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.total-amount {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.checkout-btn {
  width: 100%;
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.checkout-btn span {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.checkout-btn svg {
  width: 20px;
  height: 20px;
}

.checkout-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.checkout-btn:hover:not(:disabled)::before {
  left: 100%;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-success);
  font-size: var(--font-size-sm);
}

.secure-badge svg {
  width: 16px;
  height: 16px;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Responsive */
@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
  
  .order-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-item {
    grid-template-columns: 100px 1fr;
    grid-template-rows: auto auto;
  }
  
  .item-image {
    width: 100px;
    height: 100px;
  }
  
  .item-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .item-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
}
</style>
