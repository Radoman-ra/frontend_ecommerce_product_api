<template>
  <header class="navbar">
    <div class="navbar-inner">
      <button class="brand" @click="home" aria-label="Go to home">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        </span>
        <span class="brand-text">Store</span>
      </button>

      <nav class="nav-actions" aria-label="Primary">
        <button
          type="button"
          class="theme-toggle"
          :title="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
          @click="toggleTheme"
        >
          <transition name="theme-icon" mode="out-in">
            <svg
              v-if="theme === 'dark'"
              key="sun"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <svg
              v-else
              key="moon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </transition>
        </button>

        <template v-if="!isAuthenticated">
          <button class="btn btn-ghost" @click="goToLogin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10,17 15,12 10,7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Login</span>
          </button>
          <button class="btn btn-primary" @click="goToRegister">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span>Register</span>
          </button>
        </template>

        <template v-else>
          <button class="btn btn-ghost btn-cart" @click="goToCart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Cart</span>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </button>

          <button class="btn btn-ghost" @click="goToProfile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </button>

          <button class="btn btn-outline" @click="logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </template>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useTheme } from '../composables/useTheme'

export default defineComponent({
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(!!Cookies.get('access_token'))
    const cartCount = ref(0)
    const { theme, toggleTheme } = useTheme()

    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        cartCount.value = cart.reduce(
          (sum: number, item: any) => sum + (item.quantity || 1),
          0
        )
      } catch {
        cartCount.value = 0
      }
    }

    const home = () => router.push('/')
    const goToLogin = () => router.push('/login')
    const goToRegister = () => router.push('/register')
    const goToProfile = () => router.push('/profile')
    const goToCart = () => router.push('/cart')

    const logout = () => {
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      location.reload()
    }

    onMounted(() => {
      updateCartCount()
      window.addEventListener('storage', updateCartCount)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('storage', updateCartCount)
    })

    return {
      isAuthenticated,
      cartCount,
      theme,
      toggleTheme,
      home,
      goToLogin,
      goToRegister,
      goToProfile,
      goToCart,
      logout
    }
  }
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  height: var(--header-height);
  display: flex;
  align-items: center;
  background: color-mix(in srgb, var(--color-bg) 85%, transparent);
  -webkit-backdrop-filter: saturate(140%) blur(16px);
  backdrop-filter: saturate(140%) blur(16px);
  border-bottom: 1px solid var(--color-border);
  animation: fadeInDown 0.4s ease;
}

.navbar-inner {
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

/* Brand */
.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  padding: 6px 8px;
  margin-left: -8px;
  border-radius: var(--radius-md);
  color: var(--color-text-strong);
  transition:
    background var(--transition-fast),
    transform var(--transition-base);
}

.brand:hover {
  background: var(--color-surface-2);
}

.brand:active {
  transform: scale(0.98);
}

.brand-mark {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  box-shadow: var(--shadow-glow-primary);
}

.brand-mark svg {
  width: 18px;
  height: 18px;
}

.brand-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Nav actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: -0.005em;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-base),
    transform var(--transition-fast);
  white-space: nowrap;
}

.btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn:active {
  transform: translateY(1px);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover {
  background: var(--color-surface-2);
  color: var(--color-text-strong);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-glow-primary);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.btn-outline:hover {
  background: var(--color-error-soft);
  color: var(--color-error);
  border-color: var(--color-error);
}

/* Cart with badge */
.btn-cart {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--color-secondary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-bg);
  animation: scaleIn 0.3s ease;
}

/* Theme toggle */
.theme-toggle {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-base);
}

.theme-toggle:hover {
  background: var(--color-surface-2);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.theme-toggle:active {
  transform: scale(0.92);
}

.theme-toggle svg {
  width: 18px;
  height: 18px;
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-30deg) scale(0.8);
}
.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(30deg) scale(0.8);
}

/* Mobile */
@media (max-width: 720px) {
  .navbar-inner {
    padding: 0 var(--space-md);
  }

  .btn span:not(.cart-badge) {
    display: none;
  }

  .btn {
    padding: 0 10px;
    width: 40px;
    justify-content: center;
  }

  .brand-text {
    display: none;
  }
}
</style>
