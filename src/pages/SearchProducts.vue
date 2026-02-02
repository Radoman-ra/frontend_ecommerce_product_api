<template>
  <div class="page-wrapper">
    <HomeButtons />

    <main class="main-content">
      <div class="marketplace-layout">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar" :class="{ 'is-open': isFiltersOpen }">
          <div class="filters-header">
            <h2 class="filters-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
              </svg>
              Filters
            </h2>
            <button class="filters-close" @click="isFiltersOpen = false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="filters-content">
            <!-- Search -->
            <div class="filter-group">
              <label class="filter-label">Search</label>
              <div class="search-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  v-model="productName"
                  type="text"
                  class="filter-input"
                  placeholder="Product name..."
                  @input="debounceSearchProducts"
                />
              </div>
            </div>

            <!-- Category -->
            <div class="filter-group">
              <label class="filter-label">Category</label>
              <input
                v-model="categoryName"
                type="text"
                class="filter-input"
                placeholder="Category name..."
                @input="debounceSearchProducts"
              />
            </div>

            <!-- Supplier -->
            <div class="filter-group">
              <label class="filter-label">Supplier</label>
              <input
                v-model="supplierName"
                type="text"
                class="filter-input"
                placeholder="Supplier name..."
                @input="debounceSearchProducts"
              />
            </div>

            <!-- Price Range -->
            <div class="filter-group">
              <label class="filter-label">Price Range</label>
              <div class="price-inputs">
                <div class="price-input-wrapper">
                  <span class="currency">$</span>
                  <input
                    v-model="minPrice"
                    type="number"
                    class="filter-input price-input"
                    placeholder="Min price"
                    @input="debounceSearchProducts"
                  />
                </div>
                <div class="price-input-wrapper">
                  <span class="currency">$</span>
                  <input
                    v-model="maxPrice"
                    type="number"
                    class="filter-input price-input"
                    placeholder="Max price"
                    @input="debounceSearchProducts"
                  />
                </div>
              </div>
            </div>

            <!-- Date Range -->
            <div class="filter-group">
              <label class="filter-label">Added Date</label>
              <div class="date-inputs">
                <input
                  v-model="creationDateFrom"
                  type="date"
                  class="filter-input"
                  @input="debounceSearchProducts"
                />
                <input
                  v-model="creationDateTo"
                  type="date"
                  class="filter-input"
                  @input="debounceSearchProducts"
                />
              </div>
            </div>

            <!-- Clear Filters -->
            <button class="btn-clear-filters" @click="clearFilters">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              Clear Filters
            </button>
          </div>
        </aside>

        <!-- Products Section -->
        <section class="products-section">
          <!-- Mobile Filter Toggle -->
          <button class="mobile-filter-toggle" @click="isFiltersOpen = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
            </svg>
            Filters
          </button>

          <!-- Results Header -->
          <div class="results-header">
            <p class="results-count" v-if="products.length">
              {{ products.length }} product{{ products.length > 1 ? 's' : '' }} found
            </p>
          </div>

          <!-- Error/Empty State -->
          <transition name="fade">
            <div v-if="errorMessage" class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>{{ errorMessage }}</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </transition>

          <!-- Products Grid -->
          <TransitionGroup
            name="products"
            tag="div"
            class="products-grid"
            v-if="products.length && !errorMessage"
          >
            <div
              v-for="(product, index) in products"
              :key="product.id"
              class="product-card"
              :style="{ '--delay': (index % 12) * 0.05 + 's' }"
              @click="openModal(product)"
            >
              <div class="product-image-wrapper">
                <img
                  :src="loading ? product.lowQltyImgUrl : product.imageUrl"
                  :alt="product.name"
                  class="product-image"
                  :class="{ 'is-loading': loading }"
                  @load="loading = false"
                />

                <!-- Tags -->
                <div class="product-tags">
                  <span v-if="getCartQuantity(product.id) > 0" class="tag tag-cart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    In Cart
                  </span>
                  <span v-if="product.availableQuantity === 0" class="tag tag-out">
                    Out of Stock
                  </span>
                </div>
              </div>

              <div class="product-content">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-price">${{ product.price.toFixed(2) }}</p>
              </div>
            </div>
          </TransitionGroup>

          <!-- Pagination -->
          <div v-if="products.length && !errorMessage && totalPages > 1" class="pagination">
            <div class="pagination-info">
              <select v-model.number="limit" class="limit-select" @change="debounceSearchProducts">
                <option :value="4">4 per page</option>
                <option :value="8">8 per page</option>
                <option :value="12">12 per page</option>
                <option :value="16">16 per page</option>
                <option :value="20">20 per page</option>
              </select>
            </div>

            <div class="pagination-controls">
              <button class="pagination-btn" :disabled="currentPage === 1" @click="goToPage(1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="11,17 6,12 11,7" />
                  <polyline points="18,17 13,12 18,7" />
                </svg>
              </button>

              <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
              </button>

              <span class="pagination-current">{{ currentPage }} / {{ totalPages }}</span>

              <button
                class="pagination-btn"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>

              <button
                class="pagination-btn"
                :disabled="currentPage === totalPages"
                @click="goToPage(totalPages)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="13,17 18,12 13,7" />
                  <polyline points="6,17 11,12 6,7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Product Modal -->
      <Teleport to="body">
        <transition name="modal">
          <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
              <button class="modal-close" @click="closeModal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div class="modal-body">
                <div class="modal-image-wrapper">
                  <img
                    :src="selectedProduct.imageUrl"
                    :alt="selectedProduct.name"
                    class="modal-image"
                  />
                </div>

                <div class="modal-details">
                  <h2 class="modal-title">{{ selectedProduct.name }}</h2>
                  <p class="modal-price">${{ selectedProduct.price?.toFixed(2) }}</p>

                  <div
                    class="stock-badge"
                    :class="selectedProduct.availableQuantity > 0 ? 'in-stock' : 'out-stock'"
                  >
                    <svg
                      v-if="selectedProduct.availableQuantity > 0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    {{
                      selectedProduct.availableQuantity > 0
                        ? `In Stock: ${selectedProduct.availableQuantity}`
                        : 'Out of Stock'
                    }}
                  </div>

                  <div class="modal-description">
                    <h4>Description</h4>
                    <p>{{ selectedProduct.description }}</p>
                  </div>

                  <button
                    v-if="selectedProduct.availableQuantity > 0"
                    class="btn-add-cart"
                    @click="addToCart(selectedProduct)"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </Teleport>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import HomeButtons from './HomeButtons.vue'

const apiUrl = import.meta.env.VITE_BACKEND_URL

function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

export default defineComponent({
  components: {
    HomeButtons
  },
  data() {
    return {
      loading: true,
      productName: '',
      creationDateFrom: '',
      creationDateTo: '',
      categoryName: '',
      supplierName: '',
      minPrice: '',
      maxPrice: '',
      products: [] as Array<{
        id: number
        name: string
        price: number
        availableQuantity: number
        lowQltyImgUrl: string
        imageUrl: string
        description: string
      }>,
      currentPage: 1,
      totalPages: 0,
      limit: 12,
      errorMessage: '',
      showModal: false,
      isFiltersOpen: false,
      selectedProduct: {} as {
        id: number
        name: string
        price: number
        availableQuantity: number
        description: string
        imageUrl: string
        lowQltyImgUrl: string
      },
      cart: reactive(JSON.parse(localStorage.getItem('cart') || '[]'))
    }
  },

  methods: {
    async searchProducts() {
      this.errorMessage = ''
      const params: any = {
        limit: this.limit,
        offset: (this.currentPage - 1) * this.limit
      }

      if (this.productName) params.product_name = this.productName
      if (this.creationDateFrom) params.creation_date_from = this.creationDateFrom
      if (this.creationDateTo) params.creation_date_to = this.creationDateTo
      if (this.categoryName) params.category_name = this.categoryName
      if (this.supplierName) params.supplier_name = this.supplierName
      if (this.minPrice) params.min_price = this.minPrice
      if (this.maxPrice) params.max_price = this.maxPrice

      try {
        const response = await axios.get(`${apiUrl}/api/search/products`, { params })

        this.products = response.data.products.map(
          (product: {
            id: number
            name: string
            price: number
            quantity: number
            description: string
            photo_path?: string
          }) => ({
            ...product,
            availableQuantity: product.quantity,
            lowQltyImgUrl: `${apiUrl}/static/images/10x10/${product.photo_path}`,
            imageUrl: `${apiUrl}/static/images/500x500/${product.photo_path}`,
            description: product.description
          })
        )
        this.totalPages = response.data.total_pages
        if (!this.products.length) {
          this.errorMessage = 'No products found'
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          this.errorMessage = 'No products found'
        } else {
          this.errorMessage = 'Error fetching products'
        }
      }
    },

    debounceSearchProducts: debounce(function (this: any) {
      this.currentPage = 1
      this.searchProducts()
    }, 500),

    clearFilters() {
      this.productName = ''
      this.categoryName = ''
      this.supplierName = ''
      this.minPrice = ''
      this.maxPrice = ''
      this.creationDateFrom = ''
      this.creationDateTo = ''
      this.currentPage = 1
      this.searchProducts()
    },

    goToPage(page: number) {
      this.currentPage = page
      this.searchProducts()
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.searchProducts()
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.searchProducts()
      }
    },

    openModal(product: any) {
      this.selectedProduct = product
      this.showModal = true
      document.body.style.overflow = 'hidden'
    },

    closeModal() {
      this.showModal = false
      document.body.style.overflow = ''
    },

    addToCart(product: any) {
      const cartItem = this.cart.find((item: any) => item.id === product.id)
      if (!cartItem) {
        this.cart.push({ ...product, quantity: 1 })
      } else {
        cartItem.quantity += 1
      }
      localStorage.setItem('cart', JSON.stringify(this.cart))
      this.closeModal()
    },

    getCartQuantity(productId: number) {
      return this.cart.filter((p: any) => p.id === productId).length
    }
  },

  mounted() {
    this.searchProducts()
  }
})
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  padding-top: 80px;
}

.main-content {
  padding: var(--space-lg);
}

.marketplace-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-xl);
  max-width: 1600px;
  margin: 0 auto;
}

/* Filters Sidebar */
.filters-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  animation: fadeInLeft 0.5s ease;
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.filters-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.filters-title svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.filters-close {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: var(--space-xs);
}

.filters-close svg {
  width: 24px;
  height: 24px;
}

.filters-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.filter-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.filter-input {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  transition: all var(--transition-base);
}

.filter-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.filter-input::placeholder {
  color: var(--color-text-muted);
}

.search-input-wrapper {
  position: relative;
}

.search-input-wrapper svg {
  position: absolute;
  left: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
}

.search-input-wrapper .filter-input {
  padding-left: 44px;
}

.price-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.price-input-wrapper {
  position: relative;
}

.currency {
  position: absolute;
  left: var(--space-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.price-input {
  padding-left: var(--space-lg) !important;
  width: 100%;
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.btn-clear-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-clear-filters:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--color-error);
  color: var(--color-error);
}

.btn-clear-filters svg {
  width: 16px;
  height: 16px;
}

/* Products Section */
.products-section {
  min-height: 60vh;
}

.mobile-filter-toggle {
  display: none;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  margin-bottom: var(--space-md);
}

.mobile-filter-toggle svg {
  width: 18px;
  height: 18px;
}

.results-header {
  margin-bottom: var(--space-lg);
}

.results-count {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
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
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-lg);
}

.product-card {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  animation: fadeInUp 0.5s ease backwards;
  animation-delay: var(--delay);
}

.product-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
}

.product-image-wrapper {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all var(--transition-base);
}

.product-image.is-loading {
  filter: blur(10px);
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-tags {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.tag {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.tag svg {
  width: 14px;
  height: 14px;
}

.tag-cart {
  background: rgba(99, 102, 241, 0.9);
  color: white;
}

.tag-out {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.product-content {
  padding: var(--space-md);
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: var(--font-size-lg);
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
  justify-content: space-between;
  margin-top: var(--space-xl);
  padding: var(--space-md);
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.limit-select {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.pagination-btn {
  width: 36px;
  height: 36px;
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
  width: 18px;
  height: 18px;
}

.pagination-current {
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: 0 var(--space-md);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.modal-content {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
}

.modal-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text);
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition-base);
}

.modal-close:hover {
  background: var(--color-error);
  border-color: var(--color-error);
  color: white;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.modal-image-wrapper {
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-bg);
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-details {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  line-height: 1.3;
}

.modal-price {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  width: fit-content;
}

.stock-badge svg {
  width: 16px;
  height: 16px;
}

.stock-badge.in-stock {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.stock-badge.out-stock {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.modal-description {
  flex: 1;
}

.modal-description h4 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.modal-description p {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.btn-add-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--color-success), var(--color-success-light));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  margin-top: auto;
}

.btn-add-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

.btn-add-cart svg {
  width: 20px;
  height: 20px;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.products-enter-active {
  transition: all 0.5s ease;
}

.products-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.products-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.products-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Mobile Responsive */
@media (max-width: 900px) {
  .marketplace-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    z-index: 200;
    border-radius: 0;
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    background: var(--color-bg-secondary);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
  }

  .filters-sidebar.is-open {
    transform: translateX(0);
  }

  .filters-close {
    display: block;
  }

  .mobile-filter-toggle {
    display: flex;
  }

  .modal-body {
    grid-template-columns: 1fr;
  }

  .modal-image-wrapper {
    max-height: 300px;
  }
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  .pagination {
    flex-direction: column;
    gap: var(--space-md);
  }
}
</style>
