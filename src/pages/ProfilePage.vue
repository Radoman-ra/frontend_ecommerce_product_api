<template>
  <div class="page-wrapper">
    <HomeButtons />

    <main class="main-content">
      <div class="container">
        <section class="profile-header">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                alt="Profile avatar"
                class="avatar"
              />
              <div v-else class="avatar avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <label class="avatar-upload-btn" aria-label="Upload avatar">
                <input type="file" accept="image/*" @change="onAvatarChange" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </label>
            </div>

            <div class="profile-info">
              <span class="profile-eyebrow">Account</span>
              <h1 class="profile-title">My profile</h1>
              <p class="profile-subtitle">Manage your account details and view your orders.</p>
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17,8 12,3 7,8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Save avatar
              </span>
              <span v-else class="loading-spinner" aria-hidden="true"></span>
            </button>
          </transition>
        </section>

        <transition name="fade">
          <div v-if="errorMessage" class="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <section class="orders-section">
          <header class="section-header">
            <h2 class="section-title">
              <span class="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                  />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                </svg>
              </span>
              My orders
            </h2>

            <div class="filter-group">
              <select
                v-model="selectedStatus"
                class="filter-select"
                @change="fetchOrders"
                aria-label="Filter orders"
              >
                <option value="">All orders</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </header>

          <transition name="fade">
            <div v-if="!orders.length && !isLoading" class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3>No orders yet</h3>
              <p>When you place orders, they will appear here.</p>
              <button class="btn-primary" @click="$router.push('/')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Start shopping
              </button>
            </div>
          </transition>

          <div v-if="isLoading" class="loading-state">
            <div class="skeleton-card" v-for="i in 3" :key="i">
              <div class="skeleton skeleton-header"></div>
              <div class="skeleton skeleton-content"></div>
              <div class="skeleton skeleton-progress"></div>
            </div>
          </div>

          <TransitionGroup
            name="list"
            tag="div"
            class="orders-list"
            v-if="orders.length && !isLoading"
          >
            <article
              v-for="(order, index) in orders"
              :key="order.id"
              class="order-card"
              :style="{ '--delay': index * 0.08 + 's' }"
            >
              <div class="order-header">
                <div class="order-info">
                  <span class="order-id">Order #{{ order.id }}</span>
                  <span class="order-date">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {{ formatDate(order.order_date) }}
                  </span>
                </div>
                <div class="order-status" :class="getStatusClass(order.status)">
                  <span class="status-dot"></span>
                  {{ order.status }}
                </div>
              </div>

              <div class="progress-container">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :class="getStatusClass(order.status)"
                    :style="getProgressStyle(order.status)"
                  ></div>
                </div>
                <div class="progress-steps">
                  <div
                    class="step"
                    :class="{ active: isStepActive(order.status, 'pending') }"
                  >
                    <div class="step-dot"></div>
                    <span>Pending</span>
                  </div>
                  <div
                    class="step"
                    :class="{ active: isStepActive(order.status, 'shipped') }"
                  >
                    <div class="step-dot"></div>
                    <span>Shipped</span>
                  </div>
                  <div
                    class="step"
                    :class="{ active: isStepActive(order.status, 'delivered') }"
                  >
                    <div class="step-dot"></div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              <div class="products-list">
                <div
                  v-for="product in order.products"
                  :key="product.product_id"
                  class="product-item"
                >
                  <template v-if="product.details">
                    <img
                      :src="product.details.pictureName"
                      :alt="product.details.name"
                      class="product-image"
                    />
                    <div class="product-info">
                      <h4 class="product-name">{{ product.details.name }}</h4>
                      <span class="product-category">
                        {{ product.details.category.name }}
                      </span>
                    </div>
                    <div class="product-qty">×{{ product.quantity }}</div>
                    <div class="product-price">
                      ${{ (product.details.price * product.quantity).toFixed(2) }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="skeleton skeleton-product"></div>
                  </template>
                </div>
              </div>

              <div class="order-footer">
                <div class="supplier-info" v-if="order.products[0]?.details?.supplier">
                  <span class="supplier-label">Supplier</span>
                  <span class="supplier-name">
                    {{ order.products[0].details.supplier.name }}
                  </span>
                </div>
                <div class="order-total">
                  <span>Total</span>
                  <span class="total-amount">
                    ${{ calculateOrderTotal(order).toFixed(2) }}
                  </span>
                </div>
              </div>
            </article>
          </TransitionGroup>

          <div v-if="orders.length && totalPages > 1" class="pagination">
            <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="prevPage"
              aria-label="Previous page"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6" />
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
              aria-label="Next page"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </section>
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
    const orders = ref<
      Array<{
        id: number
        status: string
        order_date: string
        products: Array<{ product_id: number; quantity: number; details?: any }>
      }>
    >([])
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
        pending: '15%',
        shipped: '60%',
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
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile/avatar`,
          {
            headers: { Authorization: `${token}` }
          }
        )
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
  padding-top: var(--header-height);
}

.main-content {
  padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
  animation: fadeInDown 0.4s ease;
  flex-wrap: wrap;
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
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-bg);
  box-shadow: var(--shadow-md);
  background: var(--color-surface-2);
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-soft), var(--color-surface-2));
  color: var(--color-text-muted);
}

.avatar-placeholder svg {
  width: 44px;
  height: 44px;
}

.avatar-upload-btn {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 34px;
  height: 34px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid var(--color-surface);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-glow-primary);
}

.avatar-upload-btn:hover {
  background: var(--color-primary-hover);
  transform: scale(1.08);
}

.avatar-upload-btn input {
  display: none;
}

.avatar-upload-btn svg {
  width: 14px;
  height: 14px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-eyebrow {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.profile-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.015em;
}

.profile-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px var(--space-lg);
  background: var(--color-success);
  color: #fff;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--font-size-sm);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.btn-upload:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-success) 88%, black);
  transform: translateY(-1px);
}

.btn-upload svg {
  width: 16px;
  height: 16px;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
}

.alert svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.alert-error {
  background: var(--color-error-soft);
  border: 1px solid var(--color-error);
  color: var(--color-error);
}

/* Section */
.orders-section {
  animation: fadeInUp 0.5s ease 0.15s backwards;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
  gap: var(--space-md);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.section-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: var(--radius-md);
}

.section-icon svg {
  width: 18px;
  height: 18px;
}

.filter-select {
  padding: 9px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-base);
}

.filter-select:hover {
  border-color: var(--color-border-strong);
}

.filter-select:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  text-align: center;
  background: var(--color-surface);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-2xl);
}

.empty-icon {
  width: 100px;
  height: 100px;
  background: var(--color-surface-2);
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
  margin-bottom: 6px;
}

.empty-state p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px var(--space-xl);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-glow-primary);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.skeleton-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
}

.skeleton-header {
  height: 22px;
  width: 200px;
  margin-bottom: var(--space-md);
}

.skeleton-content {
  height: 70px;
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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  animation: fadeInUp 0.5s ease backwards;
  animation-delay: var(--delay);
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.order-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.order-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.order-id {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-text-strong);
}

.order-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.order-date svg {
  width: 14px;
  height: 14px;
}

.order-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: capitalize;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-pending {
  background: var(--color-warning-soft);
  color: var(--color-warning);
}
.status-pending .status-dot {
  background: var(--color-warning);
}

.status-shipped {
  background: var(--color-info-soft);
  color: var(--color-info);
}
.status-shipped .status-dot {
  background: var(--color-info);
}

.status-delivered {
  background: var(--color-success-soft);
  color: var(--color-success);
}
.status-delivered .status-dot {
  background: var(--color-success);
}

.status-cancelled {
  background: var(--color-error-soft);
  color: var(--color-error);
}
.status-cancelled .status-dot {
  background: var(--color-error);
}

/* Progress Bar */
.progress-container {
  margin-bottom: var(--space-lg);
}

.progress-bar {
  height: 6px;
  background: var(--color-surface-2);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.progress-fill.status-pending {
  background: var(--color-warning);
}
.progress-fill.status-shipped {
  background: var(--color-info);
}
.progress-fill.status-delivered {
  background: var(--color-success);
}
.progress-fill.status-cancelled {
  background: var(--color-error);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.step.active {
  color: var(--color-text-strong);
}

.step-dot {
  width: 10px;
  height: 10px;
  background: var(--color-surface-3);
  border-radius: 50%;
  border: 2px solid var(--color-surface);
  transition: all var(--transition-base);
}

.step.active .step-dot {
  background: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-soft);
}

/* Products List */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: var(--space-lg);
  padding: 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.product-item:hover {
  background: var(--color-surface-2);
}

.product-image {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--color-surface-2);
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text-strong);
}

.product-category {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.product-qty {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.product-price {
  font-weight: 700;
  min-width: 80px;
  text-align: right;
  color: var(--color-text-strong);
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
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.supplier-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.supplier-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.supplier-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text);
}

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.order-total span:first-child {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.total-amount {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.01em;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 18px;
  height: 18px;
}

.pagination-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.current-page {
  color: var(--color-primary);
}

.separator,
.total-pages {
  color: var(--color-text-muted);
}

/* Loading Spinner */
.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
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
  .main-content {
    padding: var(--space-xl) var(--space-md);
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar-section {
    flex-direction: column;
  }

  .section-header {
    align-items: flex-start;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-item {
    flex-wrap: wrap;
  }

  .product-info {
    flex: 1 1 calc(100% - 64px);
  }

  .product-qty,
  .product-price {
    flex: 1 1 50%;
    text-align: left;
  }
}
</style>
