<template>
  <div class="auth-page">
    <button
      type="button"
      class="floating-theme-toggle"
      :title="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="toggleTheme"
    >
      <svg
        v-if="theme === 'dark'"
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
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>

    <div class="bg-decoration" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <div class="auth-container">
      <!-- Branding side -->
      <aside class="auth-branding">
        <button class="brand-link" @click="$router.push('/')">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          </span>
          <span class="brand-name">Store</span>
        </button>

        <h1 class="brand-title">Welcome back</h1>
        <p class="brand-subtitle">
          Sign in to continue shopping, track your orders and access exclusive deals.
        </p>

        <ul class="features">
          <li class="feature">
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <div>
              <h4>Secure checkout</h4>
              <p>Your data is protected end-to-end.</p>
            </div>
          </li>
          <li class="feature">
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16,8 20,8 23,11 23,16 16,16 16,8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <div>
              <h4>Fast delivery</h4>
              <p>Get your order in days, not weeks.</p>
            </div>
          </li>
          <li class="feature">
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <div>
              <h4>24/7 support</h4>
              <p>We're here whenever you need help.</p>
            </div>
          </li>
        </ul>
      </aside>

      <!-- Form side -->
      <section class="auth-form-container">
        <form class="auth-form" @submit.prevent="login" novalidate>
          <header class="form-header">
            <h2 class="form-title">Sign in</h2>
            <p class="form-subtitle">Enter your credentials to access your account.</p>
          </header>

          <div class="form-fields">
            <div
              class="input-group"
              :class="{ 'has-error': emailError, 'is-focused': emailFocused }"
            >
              <label class="input-label" for="email">Email</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autocomplete="email"
                  @focus="emailFocused = true"
                  @blur="emailFocused = false"
                />
              </div>
              <transition name="error-slide">
                <span v-if="emailError" class="error-text">{{ emailError }}</span>
              </transition>
            </div>

            <div
              class="input-group"
              :class="{ 'has-error': passwordError, 'is-focused': passwordFocused }"
            >
              <label class="input-label" for="password">Password</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  required
                  autocomplete="current-password"
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false"
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <svg
                    v-if="!showPassword"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>
              </div>
              <transition name="error-slide">
                <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
              </transition>
            </div>
          </div>

          <button
            type="submit"
            class="btn-submit"
            :disabled="isSubmitting"
            :class="{ 'is-loading': isSubmitting }"
          >
            <span v-if="!isSubmitting">Sign in</span>
            <span v-else class="loading-spinner" aria-hidden="true"></span>
          </button>

          <div class="divider">
            <span>or continue with</span>
          </div>

          <button type="button" class="btn-google" @click="loginWithGoogle">
            <svg class="google-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <transition name="error-slide">
            <div v-if="loginError" class="alert alert-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{{ loginError }}</span>
            </div>
          </transition>

          <p class="auth-switch">
            Don't have an account?
            <a @click="goToRegister">Create one</a>
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useTheme } from '../composables/useTheme'

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
    const { theme, toggleTheme } = useTheme()

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
      passwordFocused,
      theme,
      toggleTheme
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

/* Floating theme toggle */
.floating-theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  z-index: var(--z-fixed);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.floating-theme-toggle:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.floating-theme-toggle svg {
  width: 18px;
  height: 18px;
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
  filter: blur(120px);
  opacity: 0.35;
  animation: orbDrift 20s ease-in-out infinite;
}

.orb-1 {
  width: 540px;
  height: 540px;
  background: var(--color-primary);
  top: -180px;
  left: -180px;
}

.orb-2 {
  width: 460px;
  height: 460px;
  background: var(--color-secondary);
  bottom: -150px;
  right: -150px;
  animation-delay: -7s;
}

/* Container */
.auth-container {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  width: 100%;
  max-width: 1080px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  position: relative;
  z-index: 1;
  animation: scaleIn 0.4s ease;
}

/* Branding side */
.auth-branding {
  position: relative;
  padding: var(--space-2xl);
  background:
    linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  overflow: hidden;
}

.auth-branding::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at 80% 0%,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 45%
    ),
    radial-gradient(circle at 20% 100%, rgba(255, 255, 255, 0.12) 0%, transparent 50%);
  pointer-events: none;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-weight: 700;
  margin-bottom: var(--space-md);
  position: relative;
  z-index: 1;
}

.brand-mark {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.brand-mark svg {
  width: 18px;
  height: 18px;
}

.brand-name {
  font-size: var(--font-size-lg);
  letter-spacing: -0.01em;
}

.brand-title {
  font-size: clamp(1.75rem, 2vw + 1rem, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
  position: relative;
  z-index: 1;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--font-size-base);
  line-height: var(--leading-normal);
  margin-bottom: var(--space-md);
  max-width: 380px;
  position: relative;
  z-index: 1;
}

.features {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  position: relative;
  z-index: 1;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  animation: fadeInLeft 0.5s ease backwards;
}

.feature:nth-child(1) {
  animation-delay: 0.15s;
}
.feature:nth-child(2) {
  animation-delay: 0.25s;
}
.feature:nth-child(3) {
  animation-delay: 0.35s;
}

.feature-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.feature-icon svg {
  width: 18px;
  height: 18px;
  color: #fff;
}

.feature h4 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}

.feature p {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.75);
}

/* Form side */
.auth-form-container {
  padding: var(--space-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form {
  width: 100%;
  max-width: 380px;
}

.form-header {
  margin-bottom: var(--space-xl);
}

.form-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.015em;
  margin-bottom: 4px;
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
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast);
}

.input-group.is-focused .input-wrapper {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
  background: var(--color-surface);
}

.input-group.has-error .input-wrapper {
  border-color: var(--color-error);
}

.input-group.has-error.is-focused .input-wrapper {
  box-shadow: 0 0 0 4px var(--color-error-soft);
}

.input-icon {
  padding: 0 12px;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
}

.input-icon svg {
  width: 18px;
  height: 18px;
}

.input-group.is-focused .input-icon {
  color: var(--color-primary);
}

.input-wrapper input {
  flex: 1;
  padding: 12px 12px 12px 0;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-base);
  min-width: 0;
}

.input-wrapper input::placeholder {
  color: var(--color-text-muted);
}

.toggle-password {
  padding: 0 12px;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: var(--color-text);
}

.toggle-password svg {
  width: 18px;
  height: 18px;
}

.error-text {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  padding-left: 4px;
}

/* Submit Button */
.btn-submit {
  width: 100%;
  padding: 14px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-glow-primary);
}

.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.18),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-submit:hover:not(:disabled)::before {
  transform: translateX(100%);
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
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
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
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
  font-size: var(--font-size-xs);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Google Button */
.btn-google {
  width: 100%;
  padding: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all var(--transition-fast);
}

.btn-google:hover {
  background: var(--color-surface-2);
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

.google-icon {
  width: 18px;
  height: 18px;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  margin-top: var(--space-md);
  font-size: var(--font-size-sm);
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

/* Auth Switch */
.auth-switch {
  text-align: center;
  margin-top: var(--space-lg);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.auth-switch a {
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 600;
  margin-left: 4px;
}

.auth-switch a:hover {
  text-decoration: underline;
}

/* Animations */
.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.25s ease;
}

.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Responsive */
@media (max-width: 900px) {
  .auth-branding {
    display: none;
  }

  .auth-container {
    grid-template-columns: 1fr;
    max-width: 460px;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: var(--space-md);
  }

  .auth-form-container {
    padding: var(--space-xl) var(--space-lg);
  }

  .floating-theme-toggle {
    top: 14px;
    right: 14px;
  }
}
</style>
