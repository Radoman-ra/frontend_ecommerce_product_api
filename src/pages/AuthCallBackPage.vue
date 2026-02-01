<template>
  <div class="callback-page">
    <!-- Animated Background -->
    <div class="bg-decoration">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="callback-container">
      <div class="callback-content">
        <!-- Loading Animation -->
        <div class="loader-wrapper">
          <div class="loader">
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
            <svg class="loader-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
        
        <h1 class="callback-title">Signing you in</h1>
        <p class="callback-message">Please wait while we complete your authentication...</p>
        
        <div class="progress-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

export default defineComponent({
  setup() {
    const router = useRouter()

    const saveTokensAndRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const accessToken = urlParams.get('access_token')
      const refreshToken = urlParams.get('refresh_token')
      const ACCESS_TOKEN_EXPIRE_MINUTES = 15
      const REFRESH_TOKEN_EXPIRE_DAYS = 7

      if (accessToken && refreshToken) {
        Cookies.set('access_token', accessToken, {
          expires: ACCESS_TOKEN_EXPIRE_MINUTES / (24 * 60),
          secure: true
        })

        Cookies.set('refresh_token', refreshToken, {
          expires: REFRESH_TOKEN_EXPIRE_DAYS,
          secure: true
        })

        // Small delay for animation
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        console.error('Tokens are missing from URL')
        router.push('/login')
      }
    }

    return {
      saveTokensAndRedirect
    }
  },

  mounted() {
    this.saveTokensAndRedirect()
  }
})
</script>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--color-primary);
  top: -150px;
  left: -150px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--color-secondary);
  bottom: -100px;
  right: -100px;
  animation-delay: -5s;
}

/* Container */
.callback-container {
  position: relative;
  z-index: 1;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.callback-content {
  background: var(--color-bg-glass);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-3xl);
  box-shadow: var(--shadow-xl);
}

/* Loader */
.loader-wrapper {
  margin-bottom: var(--space-xl);
}

.loader {
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 auto;
}

.loader-ring {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-radius: 50%;
}

.loader-ring:nth-child(1) {
  border-top-color: var(--color-primary);
  animation: spin 1.5s linear infinite;
}

.loader-ring:nth-child(2) {
  inset: 8px;
  border-right-color: var(--color-secondary);
  animation: spin 2s linear infinite reverse;
}

.loader-ring:nth-child(3) {
  inset: 16px;
  border-bottom-color: var(--color-primary-light);
  animation: spin 2.5s linear infinite;
}

.loader-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  color: var(--color-primary-light);
  animation: pulse 2s ease-in-out infinite;
}

/* Text */
.callback-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  background: linear-gradient(135deg, var(--color-text), var(--color-text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.callback-message {
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

/* Progress Dots */
.progress-dots {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
}

.dot {
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(0.95);
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
