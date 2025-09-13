// ===================================
// DADOS DE PRODUTOS
// ===================================
const produtosData = [
    {
        id: 1,
        nome: "Camisa Ctime Elegante",
        preco: 79.50,
        categoria: "claras",
        imagem: "placeholder",
        descricao: "Camisa elegante e confortável para o dia a dia",
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Branco", "Azul Claro"],
        estoque: 15
    },
    {
        id: 2,
        nome: "Camisa Ctime Premium",
        preco: 89.90,
        categoria: "claras",
        imagem: "placeholder",
        descricao: "Camisa premium com tecido de alta qualidade",
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Branco", "Cinza Claro"],
        estoque: 12
    },
    {
        id: 3,
        nome: "Camisa Ctime Casual",
        preco: 69.90,
        categoria: "claras",
        imagem: "placeholder",
        descricao: "Camisa casual para momentos descontraídos",
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Cinza", "Bege"],
        estoque: 20
    },
    {
        id: 4,
        nome: "Camisa Ctime Moderna",
        preco: 85.00,
        categoria: "claras",
        imagem: "placeholder",
        descricao: "Design moderno e contemporâneo",
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Branco", "Off-White"],
        estoque: 8
    },
    {
        id: 5,
        nome: "Camisa Ctime Black",
        preco: 95.00,
        categoria: "escuras",
        imagem: "placeholder",
        descricao: "Camisa preta clássica e versátil",
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Preto"],
        estoque: 18
    },
    {
        id: 6,
        nome: "Camisa Ctime Azul Escuro",
        preco: 92.50,
        categoria: "escuras",
        imagem: "placeholder",
        descricao: "Camisa azul escuro para ocasiões especiais",
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Azul Escuro", "Marinho"],
        estoque: 10
    }
];

// ===================================
// ESTADO DA APLICAÇÃO
// ===================================
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null;
let filtroAtivo = '*';

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    configurarNavbar();
    configurarModais();
    carregarProdutos();
    atualizarBadges();
    configurarFiltros();
    configurarPesquisa();
    verificarUsuarioLogado();
}

// ===================================
// CONFIGURAÇÃO DA NAVBAR
// ===================================
function configurarNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // Efeito de scroll na navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle do menu mobile
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Atualizar aria-expanded
        const isExpanded = mobileMenu.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
    });

    // Fechar menu mobile ao clicar em um link
    const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Configurar botões de ação
    const loginBtn = document.getElementById('loginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const searchBtn = document.getElementById('searchBtn');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const carrinhoBtn = document.getElementById('carrinhoBtn');
    const favoritosBtn = document.getElementById('favoritosBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => abrirModal('loginModal'));
    }
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            abrirModal('loginModal');
            fecharMenuMobile();
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', () => abrirModal('searchModal'));
    }
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', () => {
            abrirModal('searchModal');
            fecharMenuMobile();
        });
    }
    if (carrinhoBtn) {
        carrinhoBtn.addEventListener('click', () => window.location.href = 'carrinho.html');
    }
    if (favoritosBtn) {
        favoritosBtn.addEventListener('click', () => window.location.href = 'favoritos.html');
    }
}

function fecharMenuMobile() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
}

// ===================================
// CONFIGURAÇÃO DOS MODAIS
// ===================================
function configurarModais() {
    // Modal de pesquisa
    const searchModal = document.getElementById('searchModal');
    const closeSearchModal = document.getElementById('closeSearchModal');
    
    if (closeSearchModal) {
        closeSearchModal.addEventListener('click', () => fecharModal('searchModal'));
    }

    // Modal de login
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const criarContaBtn = document.getElementById('criarContaBtn');
    
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => fecharModal('loginModal'));
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', processarLogin);
    }
    
    if (criarContaBtn) {
        criarContaBtn.addEventListener('click', () => {
            fecharModal('loginModal');
            window.location.href = 'cadastro.html';
        });
    }

    // Fechar modais ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            const modalId = e.target.id;
            fecharModal(modalId);
        }
    });

    // Fechar modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modaisAbertos = document.querySelectorAll('.modal-overlay.active');
            modaisAbertos.forEach(modal => {
                fecharModal(modal.id);
            });
        }
    });
}

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focar no primeiro input se existir
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================================
// SISTEMA DE LOGIN
// ===================================
function processarLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Validação básica
    if (!email || !password) {
        mostrarNotificacao('Por favor, preencha todos os campos.', 'erro');
        return;
    }

    // Verificar se é admin
    if (email === 'admin@stash.com' && password === '123456789') {
        const adminUser = {
            id: 'admin',
            nome: 'Administrador',
            email: email,
            tipo: 'admin'
        };
        
        localStorage.setItem('usuarioLogado', JSON.stringify(adminUser));
        mostrarNotificacao('Login realizado com sucesso! Redirecionando para o painel administrativo...', 'sucesso');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
        return;
    }

    // Simular login de usuário comum
    const usuario = {
        id: Date.now(),
        nome: email.split('@')[0],
        email: email,
        tipo: 'cliente'
    };

    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    usuarioLogado = usuario;
    
    mostrarNotificacao('Login realizado com sucesso!', 'sucesso');
    fecharModal('loginModal');
    atualizarInterfaceUsuario();
}

function verificarUsuarioLogado() {
    if (usuarioLogado) {
        atualizarInterfaceUsuario();
    }
}

function atualizarInterfaceUsuario() {
    const loginBtn = document.getElementById('loginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    
    if (usuarioLogado) {
        // Atualizar botão de login para mostrar usuário
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
            loginBtn.title = `Olá, ${usuarioLogado.nome}`;
            loginBtn.onclick = () => mostrarMenuUsuario();
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.innerHTML = '<i class="fas fa-user-circle"></i><span>Minha Conta</span>';
            mobileLoginBtn.onclick = () => mostrarMenuUsuario();
        }
    }
}

function mostrarMenuUsuario() {
    // Implementar menu do usuário (perfil, pedidos, logout)
    const opcoes = [
        'Meu Perfil',
        'Meus Pedidos',
        'Favoritos',
        'Sair'
    ];
    
    // Por enquanto, apenas logout
    if (confirm('Deseja sair da sua conta?')) {
        logout();
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    usuarioLogado = null;
    mostrarNotificacao('Logout realizado com sucesso!', 'sucesso');
    
    // Restaurar botões originais
    const loginBtn = document.getElementById('loginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user"></i>';
        loginBtn.title = 'Login';
        loginBtn.onclick = () => abrirModal('loginModal');
    }
    
    if (mobileLoginBtn) {
        mobileLoginBtn.innerHTML = '<i class="fas fa-user"></i><span>Login</span>';
        mobileLoginBtn.onclick = () => abrirModal('loginModal');
    }
}

// ===================================
// SISTEMA DE PESQUISA
// ===================================
function configurarPesquisa() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    const searchResults = document.getElementById('searchResults');
    const resultsContainer = document.getElementById('resultsContainer');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const termo = searchInput.value.trim();
            if (termo) {
                realizarPesquisa(termo);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const termo = this.value.trim();
            if (termo.length >= 2) {
                realizarPesquisa(termo);
            } else {
                searchResults.style.display = 'none';
            }
        });
    }

    // Configurar tags de sugestão
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const termo = this.dataset.search;
            searchInput.value = termo;
            realizarPesquisa(termo);
        });
    });
}

function realizarPesquisa(termo) {
    const resultados = produtosData.filter(produto => 
        produto.nome.toLowerCase().includes(termo.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(termo.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(termo.toLowerCase())
    );

    exibirResultadosPesquisa(resultados);
}

function exibirResultadosPesquisa(resultados) {
    const searchResults = document.getElementById('searchResults');
    const resultsContainer = document.getElementById('resultsContainer');

    if (!searchResults || !resultsContainer) return;

    if (resultados.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum produto encontrado.</p>';
    } else {
        resultsContainer.innerHTML = resultados.map(produto => `
            <div class="search-result-item" onclick="irParaProduto(${produto.id})">
                <div class="placeholder-image" style="width: 60px; height: 60px; margin-right: 1rem;">
                    <i class="fas fa-tshirt"></i>
                </div>
                <div>
                    <h6>${produto.nome}</h6>
                    <p class="text-muted">${produto.descricao}</p>
                    <span class="fw-bold">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        `).join('');
    }

    searchResults.style.display = 'block';
}

function irParaProduto(produtoId) {
    fecharModal('searchModal');
    // Redirecionar para página do produto ou mostrar detalhes
    window.location.href = `produto.html?id=${produtoId}`;
}

// ===================================
// SISTEMA DE PRODUTOS
// ===================================
function carregarProdutos() {
    const produtosList = document.getElementById('produtosList');
    if (!produtosList) return;

    // Carregar apenas produtos em destaque na home (primeiros 4)
    const produtosDestaque = produtosData.slice(0, 4);
    
    produtosList.innerHTML = produtosDestaque.map(produto => criarCardProduto(produto)).join('');
}

function criarCardProduto(produto) {
    const isFavorito = favoritos.includes(produto.id);
    
    return `
        <div class="col-md-6 col-lg-4 col-xl-3 p-2 ${produto.categoria}" data-categoria="${produto.categoria}">
            <div class="product-card">
                <div class="collection-img position-relative">
                    <div class="placeholder-image">
                        <i class="fas fa-tshirt fa-3x"></i>
                        <p>${produto.nome}</p>
                    </div>
                </div>
                <div class="collection-content text-center">
                    <div class="rating mt-3">
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                        <span class="text-primary"><i class="fas fa-star"></i></span>
                    </div>
                    <p class="text-capitalize my-1">${produto.nome}</p>
                    <span class="fw-bold text-dark">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    
                    <div class="product-actions">
                        <button class="product-btn btn-add-cart" onclick="adicionarAoCarrinho(${produto.id})">
                            <i class="fas fa-shopping-cart"></i> Comprar
                        </button>
                        <button class="product-btn btn-favorite ${isFavorito ? 'active' : ''}" onclick="toggleFavorito(${produto.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===================================
// SISTEMA DE FILTROS
// ===================================
function configurarFiltros() {
    const filterButtons = document.querySelectorAll('.filter-button-group .btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active-filter-btn'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active-filter-btn');
            
            // Aplicar filtro
            const filtro = this.dataset.filter;
            aplicarFiltro(filtro);
        });
    });
}

function aplicarFiltro(filtro) {
    filtroAtivo = filtro;
    const produtos = document.querySelectorAll('.collection-list > [class*="col-"]');
    
    produtos.forEach(produto => {
        if (filtro === '*' || produto.classList.contains(filtro.replace('.', ''))) {
            produto.style.display = 'block';
            produto.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            produto.style.display = 'none';
        }
    });
}

// ===================================
// SISTEMA DE CARRINHO
// ===================================
function adicionarAoCarrinho(produtoId) {
    const produto = produtosData.find(p => p.id === produtoId);
    if (!produto) return;

    // Verificar se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1,
            tamanhoSelecionado: 'M',
            corSelecionada: produto.cores[0]
        });
    }

    salvarCarrinho();
    atualizarBadges();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`, 'sucesso');
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// ===================================
// SISTEMA DE FAVORITOS
// ===================================
function toggleFavorito(produtoId) {
    const index = favoritos.indexOf(produtoId);
    
    if (index > -1) {
        favoritos.splice(index, 1);
        mostrarNotificacao('Produto removido dos favoritos!', 'info');
    } else {
        favoritos.push(produtoId);
        mostrarNotificacao('Produto adicionado aos favoritos!', 'sucesso');
    }

    salvarFavoritos();
    atualizarBadges();
    atualizarBotoesFavoritos();
}

function salvarFavoritos() {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function atualizarBotoesFavoritos() {
    const botoesFavoritos = document.querySelectorAll('.btn-favorite');
    
    botoesFavoritos.forEach(botao => {
        const produtoId = parseInt(botao.getAttribute('onclick').match(/\d+/)[0]);
        const isFavorito = favoritos.includes(produtoId);
        
        if (isFavorito) {
            botao.classList.add('active');
        } else {
            botao.classList.remove('active');
        }
    });
}

// ===================================
// ATUALIZAÇÃO DE BADGES
// ===================================
function atualizarBadges() {
    const carrinhoBadge = document.getElementById('carrinhoBadge');
    const favoritosBadge = document.getElementById('favoritosBadge');

    if (carrinhoBadge) {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        carrinhoBadge.textContent = totalItens;
        carrinhoBadge.style.display = totalItens > 0 ? 'block' : 'none';
    }

    if (favoritosBadge) {
        favoritosBadge.textContent = favoritos.length;
        favoritosBadge.style.display = favoritos.length > 0 ? 'block' : 'none';
    }
}

// ===================================
// SISTEMA DE NOTIFICAÇÕES
// ===================================
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <div class="notificacao-content">
            <i class="fas fa-${getIconeNotificacao(tipo)}"></i>
            <span>${mensagem}</span>
        </div>
    `;

    // Adicionar estilos se não existirem
    if (!document.getElementById('notificacao-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notificacao-styles';
        styles.textContent = `
            .notificacao {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 3000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
                border-left: 4px solid;
            }
            .notificacao.show { transform: translateX(0); }
            .notificacao-sucesso { border-left-color: #27ae60; }
            .notificacao-erro { border-left-color: #e74c3c; }
            .notificacao-info { border-left-color: #3498db; }
            .notificacao-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notificacao-sucesso i { color: #27ae60; }
            .notificacao-erro i { color: #e74c3c; }
            .notificacao-info i { color: #3498db; }
        `;
        document.head.appendChild(styles);
    }

    // Adicionar ao DOM
    document.body.appendChild(notificacao);

    // Mostrar notificação
    setTimeout(() => notificacao.classList.add('show'), 100);

    // Remover após 4 segundos
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, 300);
    }, 4000);
}

function getIconeNotificacao(tipo) {
    switch (tipo) {
        case 'sucesso': return 'check-circle';
        case 'erro': return 'exclamation-circle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

// ===================================
// UTILITÁRIOS
// ===================================
function formatarPreco(preco) {
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

function obterProdutoPorId(id) {
    return produtosData.find(produto => produto.id === id);
}

// ===================================
// EXPORTAR FUNÇÕES GLOBAIS
// ===================================
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.toggleFavorito = toggleFavorito;
window.irParaProduto = irParaProduto;

