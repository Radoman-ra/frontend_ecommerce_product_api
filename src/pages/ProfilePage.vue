<template>
  <div class="page-wrapper">
    <HomeButtons />
    
    <main class="main-content">
      <div class="container">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img v-if="avatarUrl" :src="avatarUrl" alt="Profile Avatar" class="avatar" />
              <div v-else class="avatar avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <label class="avatar-upload-btn">
                <input type="file" accept="image/*" @change="onAvatarChange" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </label>
            </div>
            
            <div class="profile-info">
              <h1 class="profile-title">My Profile</h1>
              <p class="profile-subtitle">Manage your account and view your orders</p>
            </div>
          </div>
          
          <transition name="fade">
            <button 
              v-if="avatarFile" 
              class="btn-upload" 
              @click="uploadAvatar"
              :disabled="isUploading"
            >
              <span v-if="!isUploading">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17,8 12,3 7,8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Save Avatar
              </span>
              <span v-else class="loading-spinner"></span>
            </button>
          </transition>
        </div>

        <transition name="fade">
          <div v-if="errorMessage" class="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <!-- Orders Section -->
        <div class="orders-section">
          <div class="section-header">
            <h2 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
              My Orders
            </h2>
            
            <!-- Filter -->
            <div class="filter-group">
              <select v-model="selectedStatus" class="filter-select" @change="fetchOrders">
                <option value="">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <!-- Empty State -->
          <transition name="fade">
            <div v-if="!orders.length && !isLoading" class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h3>No orders yet</h3>
              <p>When you place orders, they will appear here</p>
              <button class="btn-primary" @click="$router.push('/')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Start Shopping
              </button>
            </div>
          </transition>

          <!-- Loading State -->
          <div v-if="isLoading" class="loading-state">
            <div class="skeleton-card" v-for="i in 3" :key="i">
              <div class="skeleton skeleton-header"></div>
              <div class="skeleton skeleton-content"></div>
              <div class="skeleton skeleton-progress"></div>
            </div>
          </div>

          <!-- Orders List -->
          <TransitionGroup name="list" tag="div" class="orders-list" v-if="orders.length && !isLoading">
            <div v-for="(order, index) in orders" :key="order.id" class="order-card" :style="{ '--delay': index * 0.1 + 's' }">
              <!-- Order Header -->
              <div class="order-header">
                <div class="order-info">
                  <span class="order-id">#{{ order.id }}</span>
                  <span class="order-date">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {{ formatDate(order.order_date) }}
                  </span>
                </div>
                <div class="order-status" :class="getStatusClass(order.status)">
                  <span class="status-dot"></span>
                  {{ order.status }}
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="progress-container">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :class="getStatusClass(order.status)"
                    :style="getProgressStyle(order.status)"
                  ></div>
                </div>
                <div class="progress-steps">
                  <div class="step" :class="{ active: isStepActive(order.status, 'pending') }">
                    <div class="step-dot"></div>
                    <span>Pending</span>
                  </div>
                  <div class="step" :class="{ active: isStepActive(order.status, 'shipped') }">
                    <div class="step-dot"></div>
                    <span>Shipped</span>
                  </div>
                  <div class="step" :class="{ active: isStepActive(order.status, 'delivered') }">
                    <div class="step-dot"></div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              <!-- Products -->
              <div class="products-list">
                <div 
                  v-for="product in order.products" 
                  :key="product.product_id" 
                  class="product-item"
                >
                  <template v-if="product.details">
                    <img :src="product.details.pictureName" :alt="product.details.name" class="product-image" />
                    <div class="product-info">
                      <h4 class="product-name">{{ product.details.name }}</h4>
                      <span class="product-category">{{ product.details.category.name }}</span>
                    </div>
                    <div class="product-qty">x{{ product.quantity }}</div>
                    <div class="product-price">${{ (product.details.price * product.quantity).toFixed(2) }}</div>
                  </template>
                  <template v-else>
                    <div class="skeleton skeleton-product"></div>
                  </template>
                </div>
              </div>

              <!-- Order Footer -->
              <div class="order-footer">
                <div class="supplier-info" v-if="order.products[0]?.details?.supplier">
                  <span class="supplier-label">Supplier</span>
                  <span class="supplier-name">{{ order.products[0].details.supplier.name }}</span>
                </div>
                <div class="order-total">
                  <span>Total</span>
                  <span class="total-amount">${{ calculateOrderTotal(order).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Pagination -->
          <div v-if="orders.length && totalPages > 1" class="pagination">
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </button>
            
            <div class="pagination-info">
              <span class="current-page">{{ currentPage }}</span>
              <span class="separator">/</span>
              <span class="total-pages">{{ totalPages }}</span>
            </div>
            
            <button 
              class="pagination-btn" 
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import HomeButtons from './HomeButtons.vue'

export default defineComponent({
  components: {
    HomeButtons
  },
  setup() {
    const orders = ref<Array<{
      id: number
      status: string
      order_date: string
      products: Array<{ product_id: number; quantity: number; details?: any }>
    }>>([])
    const currentPage = ref(1)
    const totalPages = ref(0)
    const errorMessage = ref('')
    const selectedStatus = ref('')
    const avatarUrl = ref('')
    const avatarFile = ref<File | null>(null)
    const isLoading = ref(true)
    const isUploading = ref(false)

    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()!.split(';').shift() || null
      return null
    }

    const setCookie = (name: string, value: string, days: number) => {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      const expires = `expires=${date.toUTCString()}`
      document.cookie = `${name}=${value};${expires};path=/`
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusClass = (status: string) => {
      const statusMap: Record<string, string> = {
        pending: 'status-pending',
        shipped: 'status-shipped',
        delivered: 'status-delivered',
        cancelled: 'status-cancelled'
      }
      return statusMap[status.toLowerCase()] || ''
    }

    const getProgressStyle = (status: string) => {
      const progressMap: Record<string, string> = {
        pending: '33%',
        shipped: '66%',
        delivered: '100%',
        cancelled: '100%'
      }
      return { width: progressMap[status.toLowerCase()] || '0%' }
    }

    const isStepActive = (status: string, step: string) => {
      const steps = ['pending', 'shipped', 'delivered']
      const currentIndex = steps.indexOf(status.toLowerCase())
      const stepIndex = steps.indexOf(step)
      return currentIndex >= stepIndex
    }

    const onAvatarChange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        avatarFile.value = file
        avatarUrl.value = URL.createObjectURL(file)
      }
    }

    const uploadAvatar = async () => {
      if (!avatarFile.value) {
        errorMessage.value = 'Please select an image file.'
        return
      }
      
      isUploading.value = true
      const formData = new FormData()
      formData.append('file', avatarFile.value!)

      try {
        const token = getCookie('access_token')
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile/avatar/upload`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        const pictureName = response.data.avatar_url
        avatarUrl.value = `${import.meta.env.VITE_BACKEND_URL}/static/avatars/${pictureName}`
        avatarFile.value = null
        errorMessage.value = ''
      } catch (error) {
        errorMessage.value = 'Failed to upload avatar.'
      } finally {
        isUploading.value = false
      }
    }

    const fetchAvatar = async () => {
      let token = getCookie('access_token')
      if (!token) {
        await refreshToken()
        token = getCookie('access_token')
        if (!token) return
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/avatar`, {
          headers: { Authorization: `${token}` }
        })
        const pictureName = response.data.avatar_url
        avatarUrl.value = `${import.meta.env.VITE_BACKEND_URL}/static/avatars/${pictureName}`
      } catch (error: any) {
        console.error('Failed to fetch avatar', error)
      }
    }

    const fetchOrders = async () => {
      isLoading.value = true
      let token = getCookie('access_token')
      if (!token) {
        await refreshToken()
        token = getCookie('access_token')
        if (!token) {
          errorMessage.value = 'Authorization failed. Please log in again.'
          isLoading.value = false
          return
        }
      }

      try {
        const params: any = {
          limit: 10,
          offset: (currentPage.value - 1) * 10
        }

        if (selectedStatus.value) {
          params.status = selectedStatus.value
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
          {
            params,
            headers: { Authorization: `${token}` }
          }
        )
        orders.value = response.data.orders
        totalPages.value = response.data.total_pages

        for (const order of orders.value) {
          for (const product of order.products) {
            fetchProductDetails(product)
          }
        }
      } catch (error: any) {
        errorMessage.value = 'Failed to fetch orders'
      } finally {
        isLoading.value = false
      }
    }

    const fetchProductDetails = async (product: any) => {
      try {
        const productResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${product.product_id}`
        )
        const productDetails = productResponse.data

        const categoryResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories/${productDetails.category_id}`
        )
        const categoryDetails = categoryResponse.data

        const supplierResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/suppliers/${productDetails.supplier_id}`
        )
        const supplierDetails = supplierResponse.data

        product.details = {
          ...productDetails,
          pictureName: `${import.meta.env.VITE_BACKEND_URL}/static/images/100x100/${productDetails.photo_path}`,
          category: categoryDetails,
          supplier: supplierDetails
        }
      } catch (error: any) {
        console.error('Failed to fetch product details', error)
      }
    }

    const calculateOrderTotal = (order: any) => {
      return order.products.reduce((total: number, product: any) => {
        if (product.details && product.details.price !== undefined) {
          return total + product.details.price * product.quantity
        }
        return total
      }, 0)
    }

    const refreshToken = async () => {
      const refreshTokenValue = getCookie('refresh_token')
      if (!refreshTokenValue) {
        errorMessage.value = 'Refresh token is missing'
        return
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
          {},
          {
            params: { refresh_token: refreshTokenValue },
            headers: { accept: 'application/json' }
          }
        )

        const newAccessToken = response.data.access_token
        const newRefreshToken = response.data.refresh_token

        setCookie('access_token', newAccessToken, 1 / (24 * 60))
        setCookie('refresh_token', newRefreshToken, 7)
      } catch (error: any) {
        errorMessage.value = 'Failed to refresh tokens. Please log in again.'
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        fetchOrders()
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        fetchOrders()
      }
    }

    onMounted(() => {
      fetchOrders()
      fetchAvatar()
    })

    return {
      orders,
      currentPage,
      totalPages,
      errorMessage,
      selectedStatus,
      avatarUrl,
      avatarFile,
      isLoading,
      isUploading,
      formatDate,
      getStatusClass,
      getProgressStyle,
      isStepActive,
      onAvatarChange,
      uploadAvatar,
      fetchOrders,
      calculateOrderTotal,
      nextPage,
      prevPage
    }
  }
})
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
  max-width: 1000px;
  margin: 0 auto;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-xl);
  animation: fadeInDown 0.5s ease;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-border);
  transition: all var(--transition-base);
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-card);
}

.avatar-placeholder svg {
  width: 50px;
  height: 50px;
  color: var(--color-text-muted);
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid var(--color-bg);
  transition: all var(--transition-base);
}

.avatar-upload-btn:hover {
  transform: scale(1.1);
}

.avatar-upload-btn input {
  display: none;
}

.avatar-upload-btn svg {
  width: 16px;
  height: 16px;
  color: white;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.profile-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.profile-subtitle {
  color: var(--color-text-secondary);
}

.btn-upload {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: linear-gradient(135deg, var(--color-success), var(--color-success-light));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-upload:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.btn-upload svg {
  width: 18px;
  height: 18px;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
}

.alert svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--color-error-light);
}

/* Orders Section */
.orders-section {
  animation: fadeInUp 0.5s ease 0.2s backwards;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.section-title svg {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.filter-select {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.filter-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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
}

.empty-icon {
  width: 100px;
  height: 100px;
  background: var(--color-bg-card);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
  animation: float 3s ease-in-out infinite;
}

.empty-icon svg {
  width: 50px;
  height: 50px;
  color: var(--color-text-muted);
}

.empty-state h3 {
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.skeleton-card {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-card) 25%,
    var(--color-bg-glass) 50%,
    var(--color-bg-card) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

.skeleton-header {
  height: 24px;
  width: 200px;
  margin-bottom: var(--space-md);
}

.skeleton-content {
  height: 80px;
  margin-bottom: var(--space-md);
}

.skeleton-progress {
  height: 8px;
  width: 100%;
}

/* Order Card */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.order-card {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  animation: fadeInUp 0.5s ease backwards;
  animation-delay: var(--delay);
  transition: all var(--transition-base);
}

.order-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-lg);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.order-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.order-id {
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.order-date {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.order-date svg {
  width: 16px;
  height: 16px;
}

.order-status {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}
.status-pending .status-dot { background: var(--color-warning); }

.status-shipped {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-info);
}
.status-shipped .status-dot { background: var(--color-info); }

.status-delivered {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}
.status-delivered .status-dot { background: var(--color-success); }

.status-cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}
.status-cancelled .status-dot { background: var(--color-error); }

/* Progress Bar */
.progress-container {
  margin-bottom: var(--space-lg);
}

.progress-bar {
  height: 4px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.progress-fill.status-pending { background: var(--color-warning); }
.progress-fill.status-shipped { background: var(--color-info); }
.progress-fill.status-delivered { background: var(--color-success); }
.progress-fill.status-cancelled { background: var(--color-error); }

.progress-steps {
  display: flex;
  justify-content: space-between;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}

.step.active {
  color: var(--color-text);
}

.step-dot {
  width: 12px;
  height: 12px;
  background: var(--color-border);
  border-radius: 50%;
  transition: all var(--transition-base);
}

.step.active .step-dot {
  background: var(--color-primary);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
}

/* Products List */
.products-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
}

.product-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm);
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-category {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.product-qty {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.product-price {
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}

.skeleton-product {
  height: 60px;
  width: 100%;
}

/* Order Footer */
.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.supplier-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.supplier-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.supplier-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
}

.order-total span:first-child {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.total-amount {
  font-size: var(--font-size-xl);
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.pagination-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-base);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 20px;
  height: 20px;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
}

.current-page {
  font-weight: 600;
  color: var(--color-primary-light);
}

.separator {
  color: var(--color-text-muted);
}

.total-pages {
  color: var(--color-text-muted);
}

/* Loading Spinner */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
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
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive */
@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-section {
    flex-direction: column;
  }
  
  .section-header {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .order-header {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .order-info {
    flex-direction: column;
  }
  
  .product-item {
    flex-wrap: wrap;
  }
  
  .product-info {
    flex: 1 1 calc(100% - 76px);
  }
  
  .product-qty,
  .product-price {
    flex: 1 1 50%;
    text-align: left;
  }
}
</style>
