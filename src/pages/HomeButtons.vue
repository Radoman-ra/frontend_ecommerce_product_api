<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="logo-wrapper" @click="home">
        <img alt="Logo" class="logo" src="../icon/logo.svg" />
        <span class="logo-text">Store</span>
      </div>
      
      <div class="nav-actions">
        <template v-if="!isAuthenticated">
          <button class="btn btn-ghost" @click="goToLogin">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10,17 15,12 10,7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span>Login</span>
          </button>
          <button class="btn btn-primary" @click="goToRegister">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            <span>Register</span>
          </button>
        </template>
        
        <template v-else>
          <button class="btn btn-ghost btn-cart" @click="goToCart">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span>Cart</span>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </button>
          
          <button class="btn btn-ghost" @click="goToProfile">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </button>
          
          <button class="btn btn-danger" @click="logout">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

export default defineComponent({
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(!!Cookies.get('access_token'))
    const cartCount = ref(0)

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cartCount.value = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
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

    return {
      isAuthenticated,
      cartCount,
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
  z-index: 100;
  padding: var(--space-md) var(--space-lg);
  background: rgba(15, 15, 35, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  animation: fadeInDown 0.5s ease;
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  transition: transform var(--transition-base);
}

.logo-wrapper:hover {
  transform: scale(1.05);
}

.logo {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
  transition: filter var(--transition-base);
}

.logo-wrapper:hover .logo {
  filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.8));
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.btn:hover::before {
  opacity: 1;
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid transparent;
}

.btn-ghost:hover {
  background: var(--color-bg-glass);
  color: var(--color-text);
  border-color: var(--color-border);
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 6px 25px rgba(99, 102, 241, 0.5);
  transform: translateY(-2px);
}

.btn-danger {
  background: transparent;
  color: var(--color-error);
  border: 1px solid transparent;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--color-error);
  transform: translateY(-2px);
}

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
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-light));
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.3s ease;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .navbar {
    padding: var(--space-sm) var(--space-md);
  }
  
  .btn span:not(.cart-badge) {
    display: none;
  }
  
  .btn {
    padding: var(--space-sm);
  }
  
  .btn-icon {
    width: 20px;
    height: 20px;
  }
  
  .logo-text {
    display: none;
  }
}
</style>
