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
      <!-- Branding -->
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

        <h1 class="brand-title">Join the community</h1>
        <p class="brand-subtitle">
          Create an account to start your shopping journey with members-only deals and faster
          checkout.
        </p>

        <ul class="features">
          <li class="feature">
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
            <div>
              <h4>Exclusive discounts</h4>
              <p>Unlock special prices for members.</p>
            </div>
          </li>
          <li class="feature">
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </span>
            <div>
              <h4>Save your favorites</h4>
              <p>Keep a wishlist that follows you everywhere.</p>
            </div>
          </li>
          <li class="feature">
            <span class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <path d="M9 11l3 3L20 6" />
              </svg>
            </span>
            <div>
              <h4>Track every order</h4>
              <p>Real-time updates from purchase to delivery.</p>
            </div>
          </li>
        </ul>
      </aside>

      <!-- Form -->
      <section class="auth-form-container">
        <form class="auth-form" @submit.prevent="register" novalidate>
          <header class="form-header">
            <h2 class="form-title">Create account</h2>
            <p class="form-subtitle">Fill in your details to get started.</p>
          </header>

          <div class="form-fields">
            <div
              class="input-group"
              :class="{
                'has-error': errors.username,
                'is-focused': focusStates.username
              }"
            >
              <label class="input-label" for="username">Username</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  placeholder="Choose a username"
                  required
                  autocomplete="username"
                  @focus="focusStates.username = true"
                  @blur="focusStates.username = false"
                />
              </div>
              <transition name="error-slide">
                <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
              </transition>
            </div>

            <div
              class="input-group"
              :class="{ 'has-error': errors.email, 'is-focused': focusStates.email }"
            >
              <label class="input-label" for="email">Email</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    />
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
                  @focus="focusStates.email = true"
                  @blur="focusStates.email = false"
                />
              </div>
              <transition name="error-slide">
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </transition>
            </div>

            <div
              class="input-group"
              :class="{
                'has-error': errors.password,
                'is-focused': focusStates.password
              }"
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
                  placeholder="Choose a strong password"
                  required
                  autocomplete="new-password"
                  @focus="focusStates.password = true"
                  @blur="focusStates.password = false"
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
                <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
              </transition>
            </div>

            <div v-if="password" class="password-strength">
              <div class="strength-bars">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="strength-bar"
                  :class="{ active: passwordStrength >= i }"
                ></div>
              </div>
              <span class="strength-label" :class="strengthClass">
                {{ strengthLabel }}
              </span>
            </div>

            <div
              class="input-group"
              :class="{
                'has-error': errors.confirmPassword,
                'is-focused': focusStates.confirmPassword
              }"
            >
              <label class="input-label" for="confirmPassword">Confirm password</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Repeat your password"
                  required
                  autocomplete="new-password"
                  @focus="focusStates.confirmPassword = true"
                  @blur="focusStates.confirmPassword = false"
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                >
                  <svg
                    v-if="!showConfirmPassword"
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
                <span v-if="errors.confirmPassword" class="error-text">
                  {{ errors.confirmPassword }}
                </span>
              </transition>
            </div>
          </div>

          <button
            type="submit"
            class="btn-submit"
            :disabled="isSubmitting"
            :class="{ 'is-loading': isSubmitting }"
          >
            <span v-if="!isSubmitting">Create account</span>
            <span v-else class="loading-spinner" aria-hidden="true"></span>
          </button>

          <div class="divider"><span>or continue with</span></div>

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
            <span>Sign up with Google</span>
          </button>

          <transition name="error-slide">
            <div v-if="message && !isSuccess" class="alert alert-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{{ message }}</span>
            </div>
          </transition>

          <transition name="error-slide">
            <div v-if="message && isSuccess" class="alert alert-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              <span>{{ message }}</span>
            </div>
          </transition>

          <p class="auth-switch">
            Already have an account?
            <a @click="goToLogin">Sign in</a>
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { theme, toggleTheme } = useTheme()

    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const message = ref('')
    const isSuccess = ref(false)
    const isSubmitting = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    const errors = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const focusStates = reactive({
      username: false,
      email: false,
      password: false,
      confirmPassword: false
    })

    const passwordStrength = computed(() => {
      let strength = 0
      if (password.value.length >= 6) strength++
      if (password.value.length >= 10) strength++
      if (/[A-Z]/.test(password.value) && /[a-z]/.test(password.value)) strength++
      if (/[0-9]/.test(password.value) || /[^A-Za-z0-9]/.test(password.value)) strength++
      return strength
    })

    const strengthLabel = computed(() => {
      const labels = ['Weak', 'Fair', 'Good', 'Strong']
      return labels[passwordStrength.value - 1] || 'Weak'
    })

    const strengthClass = computed(() => {
      const classes = ['weak', 'fair', 'good', 'strong']
      return classes[passwordStrength.value - 1] || 'weak'
    })

    const validateForm = () => {
      let valid = true
      errors.username = ''
      errors.email = ''
      errors.password = ''
      errors.confirmPassword = ''

      if (username.value.length < 3) {
        errors.username = 'Username must be at least 3 characters'
        valid = false
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email.value)) {
        errors.email = 'Please enter a valid email address'
        valid = false
      }

      if (password.value.length < 6) {
        errors.password = 'Password must be at least 6 characters'
        valid = false
      }

      if (password.value !== confirmPassword.value) {
        errors.confirmPassword = 'Passwords do not match'
        valid = false
      }

      return valid
    }

    const register = async () => {
      if (!validateForm()) return

      isSubmitting.value = true
      message.value = ''

      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
          username: username.value,
          email: email.value,
          password: password.value
        })

        isSuccess.value = true
        message.value = 'Account created successfully! Redirecting…'

        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (error) {
        isSuccess.value = false
        const err = error as any
        if (err.response) {
          if (err.response.status === 422 && Array.isArray(err.response.data.detail)) {
            message.value = err.response.data.detail.map((e: any) => e.msg).join(', ')
          } else if (
            err.response.data.detail &&
            typeof err.response.data.detail === 'string'
          ) {
            message.value = err.response.data.detail
          } else {
            message.value = 'Registration failed. Please try again.'
          }
        } else {
          message.value = 'Network error. Please check your connection.'
        }
      } finally {
        isSubmitting.value = false
      }
    }

    const loginWithGoogle = () => {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login/google`
    }

    const goToLogin = () => {
      router.push('/login')
    }

    return {
      username,
      email,
      password,
      confirmPassword,
      message,
      isSuccess,
      isSubmitting,
      showPassword,
      showConfirmPassword,
      errors,
      focusStates,
      passwordStrength,
      strengthLabel,
      strengthClass,
      register,
      loginWithGoogle,
      goToLogin,
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

/* Background */
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
  animation: orbDrift 22s ease-in-out infinite;
}

.orb-1 {
  width: 540px;
  height: 540px;
  background: var(--color-secondary);
  top: -180px;
  right: -180px;
}

.orb-2 {
  width: 460px;
  height: 460px;
  background: var(--color-primary);
  bottom: -150px;
  left: -150px;
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

/* Branding */
.auth-branding {
  position: relative;
  padding: var(--space-2xl);
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
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
  background: radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.18) 0%, transparent 45%),
    radial-gradient(circle at 80% 100%, rgba(255, 255, 255, 0.12) 0%, transparent 50%);
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
  color: rgba(255, 255, 255, 0.78);
}

/* Form */
.auth-form-container {
  padding: var(--space-2xl) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-form {
  width: 100%;
  max-width: 380px;
}

.form-header {
  margin-bottom: var(--space-lg);
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
  gap: var(--space-sm);
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
  transition: all var(--transition-fast);
}

.input-group.is-focused .input-wrapper {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
  background: var(--color-surface);
}

.input-group.has-error .input-wrapper {
  border-color: var(--color-error);
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

/* Password strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 2px 4px;
}

.strength-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

.strength-bar {
  height: 4px;
  flex: 1;
  background: var(--color-border);
  border-radius: 2px;
  transition: background var(--transition-base);
}

.strength-bar.active:nth-child(1) {
  background: var(--color-error);
}
.strength-bar.active:nth-child(2) {
  background: var(--color-warning);
}
.strength-bar.active:nth-child(3) {
  background: var(--color-info);
}
.strength-bar.active:nth-child(4) {
  background: var(--color-success);
}

.strength-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  min-width: 56px;
  text-align: right;
}

.strength-label.weak {
  color: var(--color-error);
}
.strength-label.fair {
  color: var(--color-warning);
}
.strength-label.good {
  color: var(--color-info);
}
.strength-label.strong {
  color: var(--color-success);
}

/* Submit */
.btn-submit {
  width: 100%;
  padding: 14px;
  background: var(--color-primary);
  color: #fff;
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

/* Google */
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

/* Alerts */
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

.alert-success {
  background: var(--color-success-soft);
  border: 1px solid var(--color-success);
  color: var(--color-success);
}

/* Switch */
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
