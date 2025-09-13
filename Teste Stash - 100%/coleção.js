document.addEventListener("DOMContentLoaded", () => {
  // Inicialização
  initializeFilters()
  initializeProductActions()
  initializeColorFilters()
  initializePriceRangeFilter()
  loadMoreProducts()
  initializeQuickView()
  initializeFloatingCart()

  // Animação de entrada para produtos
  animateProducts()
})

// Função para inicializar os filtros principais
function initializeFilters() {
  const filterButtons = document.querySelectorAll(".filters .btn")
  const products = document.querySelectorAll("#products > div")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove classe ativa de todos os botões
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Adiciona classe ativa ao botão clicado
      this.classList.add("active")

      const filterValue = this.id.replace("filter-", "")

      // Filtra os produtos
      products.forEach((product) => {
        if (filterValue === "all") {
          product.style.display = "block"
          setTimeout(() => product.classList.add("fade-in"), 10)
        } else if (product.classList.contains(filterValue)) {
          product.style.display = "block"
          setTimeout(() => product.classList.add("fade-in"), 10)
        } else {
          product.classList.remove("fade-in")
          product.style.display = "none"
        }
      })
    })
  })

  // Ativa o filtro "Todos" por padrão
  document.getElementById("filter-all").click()
}

// Função para inicializar ações de produto (favorito, carrinho, etc)
function initializeProductActions() {
  // Adiciona botões de ação aos produtos
  const productImages = document.querySelectorAll(".collection-img")

  productImages.forEach((imgContainer) => {
    // Cria o container de ações se não existir
    if (!imgContainer.querySelector(".product-actions")) {
      const actionsDiv = document.createElement("div")
      actionsDiv.className = "product-actions"
      actionsDiv.innerHTML = `
                <button class="btn add-to-cart" title="Adicionar ao carrinho">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="btn add-to-wishlist" title="Adicionar aos favoritos">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="btn quick-view" title="Visualização rápida">
                    <i class="fas fa-eye"></i>
                </button>
            `
      imgContainer.appendChild(actionsDiv)
    }

    // Adiciona eventos aos botões
    const cartButtons = imgContainer.querySelectorAll(".add-to-cart")
    const wishlistButtons = imgContainer.querySelectorAll(".add-to-wishlist")
    const quickViewButtons = imgContainer.querySelectorAll(".quick-view")

    cartButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        updateCart(1)
        showToast("Produto adicionado ao carrinho!")
      })
    })

    wishlistButtons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
        this.classList.toggle("active")
        const isActive = this.classList.contains("active")
        this.querySelector("i").style.color = isActive ? "#e74c3c" : ""
        showToast(isActive ? "Produto adicionado aos favoritos!" : "Produto removido dos favoritos!")
      })
    })

    quickViewButtons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()

        // Obtém informações do produto
        const productContainer = this.closest(".col-md-6")
        const productImg = productContainer.querySelector("img").src
        const productName = productContainer.querySelector("p").textContent
        const productPrice = productContainer.querySelector(".fw-bold").textContent

        // Preenche o modal com as informações do produto
        document.getElementById("quickViewProductImg").src = productImg
        document.getElementById("quickViewProductName").textContent = productName
        document.getElementById("quickViewProductPrice").textContent = productPrice

        // Abre o modal
        const quickViewModal = window.bootstrap.Modal(document.getElementById("quickViewModal"))
        quickViewModal.show()
      })
    })
  })
}

// Função para inicializar filtros de cor
function initializeColorFilters() {
  const colorOptions = document.querySelectorAll(".color-option")

  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Toggle ativo
      this.classList.toggle("active")

      // Filtra produtos por cor (simulado)
      const activeColors = Array.from(document.querySelectorAll(".color-option.active")).map((el) =>
        el.getAttribute("data-color"),
      )

      // Se não houver cores selecionadas, mostra todos os produtos
      if (activeColors.length === 0) {
        document.getElementById("filter-all").click()
        return
      }

      // Simulação de filtro por cor (na prática, você precisaria de atributos de cor nos produtos)
      const products = document.querySelectorAll("#products > div")
      products.forEach((product) => {
        // Simulando atribuição de cores aos produtos existentes
        let productColor
        if (product.classList.contains("best")) productColor = "black"
        else if (product.classList.contains("new")) productColor = "blue"
        else if (product.classList.contains("sale")) productColor = "red"

        if (activeColors.includes(productColor)) {
          product.style.display = "block"
          setTimeout(() => product.classList.add("fade-in"), 10)
        } else {
          product.classList.remove("fade-in")
          product.style.display = "none"
        }
      })

      showToast("Filtro de cor aplicado!")
    })
  })
}

// Função para inicializar filtro de faixa de preço
function initializePriceRangeFilter() {
  const priceRange = document.getElementById("priceRange")
  const priceValue = document.getElementById("priceValue")

  if (priceRange) {
    priceRange.addEventListener("input", function () {
      const value = this.value
      priceValue.textContent = `Até R$${value},00`

      // Filtra produtos por preço (simulado)
      const products = document.querySelectorAll("#products > div")
      products.forEach((product) => {
        const priceText = product.querySelector(".fw-bold").textContent
        const price = Number.parseFloat(priceText.replace("R$", "").replace(",", "."))

        if (price <= value) {
          product.style.display = "block"
          setTimeout(() => product.classList.add("fade-in"), 10)
        } else {
          product.classList.remove("fade-in")
          product.style.display = "none"
        }
      })
    })
  }
}

// Função para carregar mais produtos (simulado)
function loadMoreProducts() {
  const loadMoreBtn = document.getElementById("loadMoreBtn")

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      // Simulação de carregamento
      this.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Carregando...'

      setTimeout(() => {
        // Produtos adicionais (simulados)
        const productsContainer = document.getElementById("products")

        // Adiciona novos produtos
        const newProducts = [
          {
            img: "/img/2.png",
            category: "best",
            badge: "Oferta",
            name: "Camisa Premium",
            price: "R$89,90",
          },
          {
            img: "/img/3.png",
            category: "new",
            badge: "Novo",
            name: "Camisa Casual",
            price: "R$69,90",
          },
          {
            img: "/img/4.png",
            category: "sale",
            badge: "-30%",
            name: "Camisa Esportiva",
            price: "R$79,90",
          },
        ]

        newProducts.forEach((product) => {
          const productHTML = `
                        <div class="col-md-6 col-lg-4 col-xl-3 p-2 ${product.category}">
                            <div class="collection-img position-relative">
                                <img src="${product.img}" class="w-100" alt="${product.name}">
                                <span class="position-absolute bg-primary text-white d-flex align-items-center justify-content-center">${product.badge}</span>
                            </div>
                            <div class="text-center">
                                <div class="rating mt-3">
                                    <span class="text-primary"><i class="fas fa-star"></i></span>
                                    <span class="text-primary"><i class="fas fa-star"></i></span>
                                    <span class="text-primary"><i class="fas fa-star"></i></span>
                                    <span class="text-primary"><i class="fas fa-star"></i></span>
                                    <span class="text-primary"><i class="fas fa-star"></i></span>
                                </div>
                                <p class="text-capitalize my-1">${product.name}</p>
                                <span class="fw-bold">${product.price}</span>
                            </div>
                        </div>
                    `

          productsContainer.insertAdjacentHTML("beforeend", productHTML)
        })

        // Reinicializa as ações dos produtos
        initializeProductActions()

        // Restaura o botão
        this.textContent = "Carregar Mais"

        // Anima os novos produtos
        animateProducts()

        showToast("Novos produtos carregados!")
      }, 1000)
    })
  }
}

// Função para inicializar visualização rápida
function initializeQuickView() {
  // Adiciona o modal ao body se não existir
  if (!document.getElementById("quickViewModal")) {
    const modalHTML = `
            <div class="modal fade quick-view-modal" id="quickViewModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Visualização Rápida</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img id="quickViewProductImg" src="/placeholder.svg" alt="Produto" class="img-fluid">
                                </div>
                                <div class="col-md-6 product-details">
                                    <h3 id="quickViewProductName"></h3>
                                    <div class="rating mb-3">
                                        <span class="text-primary"><i class="fas fa-star"></i></span>
                                        <span class="text-primary"><i class="fas fa-star"></i></span>
                                        <span class="text-primary"><i class="fas fa-star"></i></span>
                                        <span class="text-primary"><i class="fas fa-star"></i></span>
                                        <span class="text-primary"><i class="fas fa-star"></i></span>
                                        <span class="ms-2">(4.8/5)</span>
                                    </div>
                                    <p class="price" id="quickViewProductPrice"></p>
                                    <p class="mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    
                                    <div class="mb-3">
                                        <h6>Tamanho:</h6>
                                        <div class="size-options">
                                            <div class="size-option">P</div>
                                            <div class="size-option">M</div>
                                            <div class="size-option">G</div>
                                            <div class="size-option">GG</div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <h6>Cor:</h6>
                                        <div class="color-options">
                                            <div class="color-option color-black" data-color="black"></div>
                                            <div class="color-option color-white" data-color="white"></div>
                                            <div class="color-option color-red" data-color="red"></div>
                                            <div class="color-option color-blue" data-color="blue"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="d-flex align-items-center">
                                        <div class="input-group me-3" style="width: 130px;">
                                            <button class="btn btn-outline-secondary" type="button" id="decrementBtn">-</button>
                                            <input type="text" class="form-control text-center" value="1" id="quantityInput">
                                            <button class="btn btn-outline-secondary" type="button" id="incrementBtn">+</button>
                                        </div>
                                        <button class="btn bg-primary text-white">Adicionar ao Carrinho</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `

    document.body.insertAdjacentHTML("beforeend", modalHTML)

    // Adiciona funcionalidade aos botões de quantidade
    document.getElementById("decrementBtn").addEventListener("click", () => {
      const input = document.getElementById("quantityInput")
      const value = Number.parseInt(input.value)
      if (value > 1) input.value = value - 1
    })

    document.getElementById("incrementBtn").addEventListener("click", () => {
      const input = document.getElementById("quantityInput")
      const value = Number.parseInt(input.value)
      input.value = value + 1
    })

    // Adiciona funcionalidade aos botões de tamanho
    const sizeOptions = document.querySelectorAll(".size-option")
    sizeOptions.forEach((option) => {
      option.addEventListener("click", function () {
        sizeOptions.forEach((opt) => opt.classList.remove("active"))
        this.classList.add("active")
      })
    })

    // Adiciona funcionalidade aos botões de cor no modal
    const colorOptionsModal = document.querySelectorAll(".product-details .color-option")
    colorOptionsModal.forEach((option) => {
      option.addEventListener("click", function () {
        colorOptionsModal.forEach((opt) => opt.classList.remove("active"))
        this.classList.add("active")
      })
    })
  }
}

// Função para inicializar carrinho flutuante
function initializeFloatingCart() {
  // Adiciona o carrinho flutuante se não existir
  if (!document.querySelector(".floating-cart")) {
    const floatingCartHTML = `
            <div class="floating-cart">
                <i class="fas fa-shopping-cart"></i>
                <span class="badge rounded-pill">0</span>
            </div>
        `

    document.body.insertAdjacentHTML("beforeend", floatingCartHTML)

    // Adiciona evento de clique
    document.querySelector(".floating-cart").addEventListener("click", () => {
      window.location.href = "/html/carrinho.html"
    })
  }
}

// Função para atualizar o contador do carrinho
function updateCart(quantity) {
  const cartBadges = document.querySelectorAll(".nav-btns .badge, .floating-cart .badge")

  cartBadges.forEach((badge) => {
    const currentCount = Number.parseInt(badge.textContent)
    badge.textContent = currentCount + quantity
  })
}

// Função para mostrar toast de notificação
function showToast(message) {
  // Cria o toast se não existir
  if (!document.getElementById("notificationToast")) {
    const toastHTML = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div id="notificationToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Stash</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body" id="toastMessage"></div>
                </div>
            </div>
        `

    document.body.insertAdjacentHTML("beforeend", toastHTML)
  }

  // Atualiza a mensagem e mostra o toast
  document.getElementById("toastMessage").textContent = message
  const toast = window.bootstrap.Toast(document.getElementById("notificationToast"))
  toast.show()
}

// Função para animar produtos
function animateProducts() {
  const products = document.querySelectorAll("#products > div")

  products.forEach((product, index) => {
    product.classList.remove("fade-in")
    setTimeout(() => {
      product.classList.add("fade-in")
    }, index * 100)
  })
}

// Função para pesquisa
document.getElementById("search").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase()
  const products = document.querySelectorAll("#products > div")

  products.forEach((product) => {
    const productName = product.querySelector("p").textContent.toLowerCase()

    if (productName.includes(searchTerm)) {
      product.style.display = "block"
      setTimeout(() => product.classList.add("fade-in"), 10)
    } else {
      product.classList.remove("fade-in")
      product.style.display = "none"
    }
  })
})
