<template>
  <div class="page-wrapper">
    <HomeButtons />

    <main class="main-content">
      <!-- Hero / Page heading -->
      <section class="hero">
        <div class="hero-eyebrow">
          <span class="dot"></span>
          Curated marketplace
        </div>
        <h1 class="hero-title">Discover products you'll love</h1>
        <p class="hero-subtitle">
          Browse thousands of items, filter by category and price, and check out in just a few
          clicks.
        </p>

        <div class="search-bar">
          <span class="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            v-model="productName"
            type="text"
            class="search-bar-input"
            placeholder="Search products by name…"
            @input="debounceSearchProducts"
          />
          <button
            v-if="productName"
            class="search-clear"
            type="button"
            @click="productName = ''; debounceSearchProducts()"
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </section>

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
            <button class="filters-close" @click="isFiltersOpen = false" aria-label="Close filters">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="filters-content">
            <div class="filter-group">
              <label class="filter-label">Category</label>
              <input
                v-model="categoryName"
                type="text"
                class="filter-input"
                placeholder="Category name…"
                @input="debounceSearchProducts"
              />
            </div>

            <div class="filter-group">
              <label class="filter-label">Supplier</label>
              <input
                v-model="supplierName"
                type="text"
                class="filter-input"
                placeholder="Supplier name…"
                @input="debounceSearchProducts"
              />
            </div>

            <div class="filter-group">
              <label class="filter-label">Price range</label>
              <div class="price-inputs">
                <div class="price-input-wrapper">
                  <span class="currency">$</span>
                  <input
                    v-model="minPrice"
                    type="number"
                    class="filter-input price-input"
                    placeholder="Min"
                    @input="debounceSearchProducts"
                  />
                </div>
                <span class="price-divider">—</span>
                <div class="price-input-wrapper">
                  <span class="currency">$</span>
                  <input
                    v-model="maxPrice"
                    type="number"
                    class="filter-input price-input"
                    placeholder="Max"
                    @input="debounceSearchProducts"
                  />
                </div>
              </div>
            </div>

            <div class="filter-group">
              <label class="filter-label">Added date</label>
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

            <button class="btn-clear-filters" @click="clearFilters">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              Clear all filters
            </button>
          </div>
        </aside>

        <!-- Products Section -->
        <section class="products-section">
          <div class="results-toolbar">
            <button class="mobile-filter-toggle" @click="isFiltersOpen = true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
              </svg>
              Filters
            </button>

            <p class="results-count" v-if="products.length">
              <strong>{{ products.length }}</strong>
              product{{ products.length > 1 ? 's' : '' }} on this page
            </p>
          </div>

          <transition name="fade">
            <div v-if="errorMessage" class="empty-state">
              <div class="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3>{{ errorMessage }}</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          </transition>

          <TransitionGroup
            name="products"
            tag="div"
            class="products-grid"
            v-if="products.length && !errorMessage"
          >
            <article
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

                <div class="product-tags">
                  <span v-if="getCartQuantity(product.id) > 0" class="tag tag-cart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    In cart
                  </span>
                  <span v-if="product.availableQuantity === 0" class="tag tag-out">
                    Out of stock
                  </span>
                </div>
              </div>

              <div class="product-content">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-price">${{ product.price.toFixed(2) }}</p>
              </div>
            </article>
          </TransitionGroup>

          <div v-if="products.length && !errorMessage && totalPages > 1" class="pagination">
            <div class="pagination-info">
              <select
                v-model.number="limit"
                class="limit-select"
                @change="debounceSearchProducts"
                aria-label="Items per page"
              >
                <option :value="4">4 per page</option>
                <option :value="8">8 per page</option>
                <option :value="12">12 per page</option>
                <option :value="16">16 per page</option>
                <option :value="20">20 per page</option>
              </select>
            </div>

            <div class="pagination-controls">
              <button
                class="pagination-btn"
                :disabled="currentPage === 1"
                @click="goToPage(1)"
                aria-label="First page"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="11,17 6,12 11,7" />
                  <polyline points="18,17 13,12 18,7" />
                </svg>
              </button>

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

              <span class="pagination-current">{{ currentPage }} / {{ totalPages }}</span>

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

              <button
                class="pagination-btn"
                :disabled="currentPage === totalPages"
                @click="goToPage(totalPages)"
                aria-label="Last page"
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

      <Teleport to="body">
        <transition name="modal">
          <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
              <button class="modal-close" @click="closeModal" aria-label="Close">
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
                    :class="
                      selectedProduct.availableQuantity > 0 ? 'in-stock' : 'out-stock'
                    "
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
                        : 'Out of stock'
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
                    Add to cart
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
import { defineComponent, reactive } from 'vue'
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
      window.dispatchEvent(new Event('storage'))
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
  padding-top: var(--header-height);
}

.main-content {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
}

/* Hero */
.hero {
  text-align: center;
  margin-bottom: var(--space-2xl);
  animation: fadeInUp 0.5s ease;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}

.hero-eyebrow .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
}

.hero-title {
  font-size: clamp(2rem, 4vw + 1rem, 3rem);
  letter-spacing: -0.02em;
  margin-bottom: var(--space-sm);
  background: linear-gradient(
    180deg,
    var(--color-text-strong),
    var(--color-text-secondary)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 620px;
  margin: 0 auto var(--space-xl);
}

/* Search bar */
.search-bar {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 6px 6px 6px 18px;
  box-shadow: var(--shadow-sm);
  transition:
    box-shadow var(--transition-base),
    border-color var(--transition-base);
}

.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.search-icon {
  display: inline-flex;
  color: var(--color-text-muted);
  margin-right: 10px;
}

.search-icon svg {
  width: 20px;
  height: 20px;
}

.search-bar-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.search-bar-input::placeholder {
  color: var(--color-text-muted);
}

.search-clear {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-2);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.search-clear:hover {
  background: var(--color-error-soft);
  color: var(--color-error);
}

.search-clear svg {
  width: 16px;
  height: 16px;
}

/* Layout */
.marketplace-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-xl);
}

/* Filters Sidebar */
.filters-sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--space-md));
  height: fit-content;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
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
  font-weight: 700;
}

.filters-title svg {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.filters-close {
  display: none;
  color: var(--color-text-muted);
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.filters-close:hover {
  background: var(--color-surface-2);
}

.filters-close svg {
  width: 22px;
  height: 22px;
}

.filters-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.filter-input {
  width: 100%;
  padding: 10px 14px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.filter-input::placeholder {
  color: var(--color-text-muted);
}

.filter-input:hover {
  border-color: var(--color-border-strong);
}

.filter-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
  background: var(--color-surface);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 0;
}

.currency {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  pointer-events: none;
}

.price-input {
  padding-left: 24px !important;
}

.price-divider {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-clear-filters {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.btn-clear-filters:hover {
  background: var(--color-error-soft);
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
  animation: fadeInRight 0.5s ease;
}

.results-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.mobile-filter-toggle {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: 600;
  box-shadow: var(--shadow-xs);
}

.mobile-filter-toggle svg {
  width: 16px;
  height: 16px;
}

.results-count {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.results-count strong {
  color: var(--color-text-strong);
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
  border-radius: var(--radius-xl);
}

.empty-icon {
  width: 88px;
  height: 88px;
  background: var(--color-surface-2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
  animation: float 3s ease-in-out infinite;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: var(--color-text-muted);
}

.empty-state h3 {
  margin-bottom: 6px;
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
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform var(--transition-base),
    border-color var(--transition-base),
    box-shadow var(--transition-base);
  animation: fadeInUp 0.5s ease backwards;
  animation-delay: var(--delay);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-lg);
}

.product-image-wrapper {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-surface-2);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-image.is-loading {
  filter: blur(10px);
}

.product-card:hover .product-image {
  transform: scale(1.06);
}

.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.tag svg {
  width: 12px;
  height: 12px;
}

.tag-cart {
  background: rgba(79, 70, 229, 0.9);
  color: #fff;
}

.tag-out {
  background: rgba(220, 38, 38, 0.9);
  color: #fff;
}

.product-content {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  letter-spacing: -0.005em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.6em;
  color: var(--color-text-strong);
}

.product-price {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  margin-top: auto;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-xl);
  padding: 14px 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  flex-wrap: wrap;
  gap: var(--space-md);
}

.limit-select {
  padding: 8px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.limit-select:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pagination-btn {
  width: 36px;
  height: 36px;
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
  width: 16px;
  height: 16px;
}

.pagination-current {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-strong);
  padding: 0 12px;
  min-width: 64px;
  text-align: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-lg);
}

.modal-content {
  width: 100%;
  max-width: 880px;
  max-height: 90vh;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  position: relative;
  box-shadow: var(--shadow-xl);
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text-secondary);
  z-index: 10;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.modal-close:hover {
  background: var(--color-error);
  border-color: var(--color-error);
  color: #fff;
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.modal-image-wrapper {
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-surface-2);
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
  letter-spacing: -0.015em;
}

.modal-price {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-primary);
  margin: 0;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 600;
  width: fit-content;
}

.stock-badge svg {
  width: 14px;
  height: 14px;
}

.stock-badge.in-stock {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.stock-badge.out-stock {
  background: var(--color-error-soft);
  color: var(--color-error);
}

.modal-description {
  flex: 1;
}

.modal-description h4 {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}

.modal-description p {
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}

.btn-add-cart {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  transition: all var(--transition-base);
  margin-top: auto;
  box-shadow: var(--shadow-glow-primary);
}

.btn-add-cart:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.btn-add-cart svg {
  width: 18px;
  height: 18px;
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
  transform: translateY(20px);
}

.products-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 960px) {
  .marketplace-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 320px;
    max-width: 86vw;
    z-index: var(--z-modal);
    border-radius: 0;
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    background: var(--color-surface);
    box-shadow: var(--shadow-xl);
    overflow-y: auto;
  }

  .filters-sidebar.is-open {
    transform: translateX(0);
  }

  .filters-close {
    display: inline-flex;
  }

  .mobile-filter-toggle {
    display: inline-flex;
  }

  .modal-body {
    grid-template-columns: 1fr;
  }

  .modal-image-wrapper {
    max-height: 320px;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: var(--space-xl) var(--space-md) var(--space-2xl);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  .pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }
}

@media (max-width: 420px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
