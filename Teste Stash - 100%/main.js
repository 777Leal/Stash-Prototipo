// Global variables
let cart = JSON.parse(localStorage.getItem("cart")) || []
let isLargeFont = false

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize App
function initializeApp() {
  updateCartCount()
  setupAccessibilityControls()
  setupMobileMenu()
  setupNewsletterForm()
  setupWhatsAppButton()
  initializeUserAuth() // Add this line
}

// Cart Management
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count")
  if (cartCountElement) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCountElement.textContent = totalItems
  }
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showNotification("Produto adicionado ao carrinho!")
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showNotification("Produto removido do carrinho!")
}

function updateCartItemQuantity(productId, quantity) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartCount()
    }
  }
}

function clearCart() {
  cart = []
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

// Accessibility Controls
function setupAccessibilityControls() {
  const fontSizeToggle = document.getElementById("font-size-toggle")
  const textToSpeech = document.getElementById("text-to-speech")

  if (fontSizeToggle) {
    fontSizeToggle.addEventListener("click", toggleFontSize)
  }

  if (textToSpeech) {
    textToSpeech.addEventListener("click", toggleTextToSpeech)
  }
}

function toggleFontSize() {
  isLargeFont = !isLargeFont
  document.body.classList.toggle("large-font", isLargeFont)
  localStorage.setItem("largeFont", isLargeFont)
}

function toggleTextToSpeech() {
  if ("speechSynthesis" in window) {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    } else {
      const text = document.body.innerText
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "pt-BR"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  } else {
    showNotification("Seu navegador não suporta síntese de voz.")
  }
}

// Mobile Menu
function setupMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const nav = document.querySelector(".nav")

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener("click", () => {
      nav.classList.toggle("active")
      mobileMenuToggle.classList.toggle("active")
    })
  }
}

// Newsletter Form
function setupNewsletterForm() {
  const newsletterForm = document.getElementById("newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const email = this.querySelector('input[type="email"]').value

      if (validateEmail(email)) {
        // Simulate API call
        setTimeout(() => {
          showNotification("Obrigado por se inscrever em nossa newsletter!")
          this.reset()
        }, 1000)
      } else {
        showNotification("Por favor, insira um e-mail válido.")
      }
    })
  }
}

// WhatsApp Button
function setupWhatsAppButton() {
  const whatsappButton = document.querySelector(".whatsapp-float a")

  if (whatsappButton) {
    whatsappButton.addEventListener("click", function (e) {
      const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os produtos da Stash.")
      this.href = `https://wa.me/5511912345678?text=${message}`
    })
  }
}

// Utility Functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message, type = "success") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === "success" ? "#4CAF50" : "#f44336"};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: bold;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease-out;
    `

  // Add animation styles
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `
  document.head.appendChild(style)

  // Add to DOM
  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

function formatPrice(price) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Load saved preferences
document.addEventListener("DOMContentLoaded", () => {
  const savedLargeFont = localStorage.getItem("largeFont")
  if (savedLargeFont === "true") {
    isLargeFont = true
    document.body.classList.add("large-font")
  }
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // ESC key to close modals or cancel speech
  if (e.key === "Escape") {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
  }

  // Ctrl + Plus to increase font size
  if (e.ctrlKey && e.key === "+") {
    e.preventDefault()
    if (!isLargeFont) {
      toggleFontSize()
    }
  }

  // Ctrl + Minus to decrease font size
  if (e.ctrlKey && e.key === "-") {
    e.preventDefault()
    if (isLargeFont) {
      toggleFontSize()
    }
  }
})

// User Authentication Management
function initializeUserAuth() {
  updateUserInterface()
  setupUserDropdown()
}

function updateUserInterface() {
  const user = getCurrentUser()
  const loginLink = document.querySelector('nav a[href="login.html"]')

  if (loginLink) {
    const navItem = loginLink.parentElement

    if (user) {
      // User is logged in - show user dropdown
      navItem.innerHTML = `
        <div class="user-dropdown">
          <button class="user-icon" aria-label="Menu do usuário">
            <i class="fas fa-user"></i>
            <span class="user-name">${user.name}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="dropdown-menu">
            <a href="account.html"><i class="fas fa-user-cog"></i> Gerenciar Conta</a>
            <a href="orders.html"><i class="fas fa-box"></i> Meus Pedidos</a>
            <a href="wishlist.html"><i class="fas fa-heart"></i> Lista de Desejos</a>
            ${user.isAdmin ? '<a href="admin.html"><i class="fas fa-cog"></i> Painel Admin</a>' : ""}
            <hr>
            <button onclick="logout()" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i> Sair
            </button>
          </div>
        </div>
      `
    } else {
      // User is not logged in - show login link
      navItem.innerHTML = '<a href="login.html">Login</a>'
    }
  }
}

function setupUserDropdown() {
  const userDropdown = document.querySelector(".user-dropdown")
  if (userDropdown) {
    const userIcon = userDropdown.querySelector(".user-icon")
    const dropdownMenu = userDropdown.querySelector(".dropdown-menu")

    userIcon.addEventListener("click", (e) => {
      e.stopPropagation()
      dropdownMenu.classList.toggle("active")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("active")
    })

    // Prevent dropdown from closing when clicking inside
    dropdownMenu.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }
}

function getCurrentUser() {
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

function logout() {
  localStorage.removeItem("user")
  localStorage.removeItem("rememberUser")
  showNotification("Logout realizado com sucesso!")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

// Admin Functions
function checkAdminAccess() {
  const user = getCurrentUser()
  if (!user || !user.isAdmin) {
    showNotification("Acesso negado. Apenas administradores podem acessar esta página.", "error")
    setTimeout(() => {
      window.location.href = "index.html"
    }, 2000)
    return false
  }
  return true
}

// Export functions for use in other files
window.StashApp = {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  showNotification,
  formatPrice,
  validateEmail,
  debounce,
}
