<template>
  <div class="auth-page">
    <!-- Animated Background -->
    <div class="bg-decoration">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="auth-container">
      <!-- Left Side - Branding -->
      <div class="auth-branding">
        <div class="brand-content">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <h1 class="brand-title">Welcome Back</h1>
          <p class="brand-subtitle">Sign in to continue shopping and track your orders</p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span>Secure checkout</span>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <span>Fast delivery</span>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="auth-form-container">
        <form class="auth-form" @submit.prevent="login">
          <div class="form-header">
            <h2 class="form-title">Sign In</h2>
            <p class="form-subtitle">Enter your credentials to access your account</p>
          </div>

          <div class="form-fields">
            <div class="input-group" :class="{ 'has-error': emailError, 'is-focused': emailFocused }">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                v-model="email"
                type="email"
                placeholder="Email address"
                required
                @focus="emailFocused = true"
                @blur="emailFocused = false"
              />
              <div class="input-highlight"></div>
            </div>
            <transition name="error-slide">
              <span v-if="emailError" class="error-text">{{ emailError }}</span>
            </transition>

            <div class="input-group" :class="{ 'has-error': passwordError, 'is-focused': passwordFocused }">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                required
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
              <div class="input-highlight"></div>
            </div>
            <transition name="error-slide">
              <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
            </transition>
          </div>

          <button 
            type="submit" 
            class="btn-submit"
            :disabled="isSubmitting"
            :class="{ 'is-loading': isSubmitting }"
          >
            <span v-if="!isSubmitting">Sign In</span>
            <span v-else class="loading-spinner"></span>
          </button>

          <div class="divider">
            <span>or continue with</span>
          </div>

          <button type="button" class="btn-google" @click="loginWithGoogle">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>

          <transition name="error-slide">
            <div v-if="loginError" class="alert alert-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ loginError }}</span>
            </div>
          </transition>

          <p class="auth-switch">
            Don't have an account? 
            <a @click="goToRegister">Create one</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const apiUrl = import.meta.env.VITE_BACKEND_URL

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')
    const emailError = ref('')
    const passwordError = ref('')
    const loginError = ref('')
    const isSubmitting = ref(false)
    const showPassword = ref(false)
    const emailFocused = ref(false)
    const passwordFocused = ref(false)
    const router = useRouter()

    const ACCESS_TOKEN_EXPIRE_MINUTES = 15
    const REFRESH_TOKEN_EXPIRE_DAYS = 7

    const validateInputs = (): boolean => {
      emailError.value = ''
      passwordError.value = ''

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      let isValid = true

      if (!emailPattern.test(email.value)) {
        emailError.value = 'Please enter a valid email address'
        isValid = false
      }

      if (password.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters'
        isValid = false
      }

      return isValid
    }

    const login = async () => {
      if (!validateInputs()) return

      isSubmitting.value = true
      loginError.value = ''

      try {
        const response = await axios.post(`${apiUrl}/api/auth/login`, {
          email: email.value,
          password: password.value
        })

        const { access_token, refresh_token } = response.data

        Cookies.set('access_token', access_token, {
          expires: ACCESS_TOKEN_EXPIRE_MINUTES / (24 * 60),
          secure: true
        })

        Cookies.set('refresh_token', refresh_token, {
          expires: REFRESH_TOKEN_EXPIRE_DAYS,
          secure: true
        })

        router.push('/')
      } catch (error) {
        if ((error as any).response && (error as any).response.status === 401) {
          loginError.value = 'Invalid email or password'
        } else {
          loginError.value = 'An error occurred. Please try again.'
        }
        console.error('Login failed:', error)
      } finally {
        isSubmitting.value = false
      }
    }

    const loginWithGoogle = async () => {
      window.location.href = `${apiUrl}/api/auth/login/google`
    }

    const goToRegister = () => {
      router.push('/register')
    }

    return {
      email,
      password,
      emailError,
      passwordError,
      login,
      loginWithGoogle,
      goToRegister,
      loginError,
      isSubmitting,
      showPassword,
      emailFocused,
      passwordFocused
    }
  }
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
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
  width: 600px;
  height: 600px;
  background: var(--color-primary);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: var(--color-secondary);
  bottom: -150px;
  right: -150px;
  animation-delay: -5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: var(--color-primary-light);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

/* Container */
.auth-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: var(--color-bg-glass);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  animation: scaleIn 0.5s ease;
}

/* Branding Side */
.auth-branding {
  flex: 1;
  padding: var(--space-3xl);
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.2) 0%, 
    rgba(236, 72, 153, 0.1) 100%
  );
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.auth-branding::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.brand-content {
  position: relative;
  z-index: 1;
}

.brand-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
  animation: float 3s ease-in-out infinite;
}

.brand-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.brand-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  background: linear-gradient(135deg, var(--color-text), var(--color-text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
}

.features {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  animation: fadeInLeft 0.5s ease backwards;
}

.feature:nth-child(1) { animation-delay: 0.2s; }
.feature:nth-child(2) { animation-delay: 0.3s; }
.feature:nth-child(3) { animation-delay: 0.4s; }

.feature-icon {
  width: 40px;
  height: 40px;
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary-light);
}

/* Form Side */
.auth-form-container {
  flex: 1;
  padding: var(--space-3xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form {
  width: 100%;
  max-width: 360px;
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.form-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-xs);
}

.form-subtitle {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  overflow: hidden;
}

.input-group.is-focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-group.has-error {
  border-color: var(--color-error);
}

.input-group.has-error.is-focused {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-icon {
  padding: 0 var(--space-md);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
}

.input-icon svg {
  width: 20px;
  height: 20px;
}

.input-group.is-focused .input-icon {
  color: var(--color-primary);
}

.input-group input {
  flex: 1;
  padding: var(--space-md) 0;
  padding-right: var(--space-md);
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-base);
}

.input-group input::placeholder {
  color: var(--color-text-muted);
}

.toggle-password {
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: var(--color-text);
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

.input-highlight {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transition: all var(--transition-base);
  transform: translateX(-50%);
}

.input-group.is-focused .input-highlight {
  width: 100%;
}

.error-text {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  padding-left: var(--space-sm);
}

/* Submit Button */
.btn-submit {
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

.btn-submit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.btn-submit:hover:not(:disabled)::before {
  left: 100%;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-submit.is-loading {
  pointer-events: none;
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

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin: var(--space-lg) 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.divider span {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

/* Google Button */
.btn-google {
  width: 100%;
  padding: var(--space-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  transition: all var(--transition-base);
}

.btn-google:hover {
  background: var(--color-bg-glass);
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-top: var(--space-md);
  font-size: var(--font-size-sm);
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

/* Auth Switch */
.auth-switch {
  text-align: center;
  margin-top: var(--space-lg);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.auth-switch a {
  color: var(--color-primary-light);
  cursor: pointer;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.auth-switch a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* Animations */
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 900px) {
  .auth-branding {
    display: none;
  }
  
  .auth-container {
    max-width: 440px;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: var(--space-md);
  }
  
  .auth-form-container {
    padding: var(--space-xl);
  }
}
</style>
