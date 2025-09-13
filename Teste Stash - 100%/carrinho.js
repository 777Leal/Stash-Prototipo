// ===================================
// CARRINHO.JS - Funcionalidades específicas da página do carrinho
// ===================================

let freteCalculado = null;
let cupomAplicado = null;

// ===================================
// INICIALIZAÇÃO DA PÁGINA DO CARRINHO
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('carrinho.html')) {
        inicializarPaginaCarrinho();
    }
});

function inicializarPaginaCarrinho() {
    renderizarCarrinho();
    configurarEventosCarrinho();
}

// ===================================
// RENDERIZAÇÃO DO CARRINHO
// ===================================
function renderizarCarrinho() {
    const carrinhoConteudo = document.getElementById('carrinhoConteudo');
    if (!carrinhoConteudo) return;

    if (carrinho.length === 0) {
        carrinhoConteudo.innerHTML = criarCarrinhoVazio();
        return;
    }

    carrinhoConteudo.innerHTML = `
        <div class="row">
            <div class="col-lg-8">
                <div id="itensCarrinho">
                    ${carrinho.map(item => criarItemCarrinho(item)).join('')}
                </div>
            </div>
            <div class="col-lg-4">
                ${criarResumoPedido()}
            </div>
        </div>
    `;

    configurarEventosItens();
}

function criarCarrinhoVazio() {
    return `
        <div class="carrinho-vazio">
            <i class="fas fa-shopping-cart"></i>
            <h3>Seu carrinho está vazio</h3>
            <p class="text-muted">Adicione produtos ao seu carrinho para continuar comprando.</p>
            <a href="produtos.html" class="btn btn-primary btn-lg">Explorar Produtos</a>
        </div>
    `;
}

function criarItemCarrinho(item) {
    return `
        <div class="item-carrinho" data-id="${item.id}">
            <div class="item-imagem">
                <i class="fas fa-tshirt fa-2x"></i>
            </div>
            <div class="item-info">
                <div class="item-nome">${item.nome}</div>
                <div class="item-detalhes">
                    Tamanho: ${item.tamanhoSelecionado} | Cor: ${item.corSelecionada}
                </div>
                <div class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="item-controles">
                <div class="quantidade-controle">
                    <button class="quantidade-btn" onclick="alterarQuantidade(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantidade-input" value="${item.quantidade}" 
                           min="1" max="10" onchange="atualizarQuantidade(${item.id}, this.value)">
                    <button class="quantidade-btn" onclick="alterarQuantidade(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="btn-remover" onclick="removerDoCarrinho(${item.id})">
                    <i class="fas fa-trash"></i> Remover
                </button>
            </div>
        </div>
    `;
}

function criarResumoPedido() {
    const subtotal = calcularSubtotal();
    const frete = freteCalculado ? freteCalculado.valor : 0;
    const desconto = cupomAplicado ? cupomAplicado.desconto : 0;
    const total = subtotal + frete - desconto;

    return `
        <div class="resumo-pedido">
            <div class="resumo-titulo">Resumo do Pedido</div>
            
            <div class="resumo-linha">
                <span>Subtotal (${carrinho.length} ${carrinho.length === 1 ? 'item' : 'itens'})</span>
                <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            
            ${cupomAplicado ? `
                <div class="resumo-linha" style="color: var(--color-success);">
                    <span>Desconto (${cupomAplicado.codigo})</span>
                    <span>-R$ ${desconto.toFixed(2).replace('.', ',')}</span>
                </div>
            ` : ''}
            
            <div class="resumo-linha">
                <span>Frete</span>
                <span>${frete > 0 ? 'R$ ' + frete.toFixed(2).replace('.', ',') : 'Calcular'}</span>
            </div>
            
            <div class="resumo-linha total">
                <span>Total</span>
                <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
            </div>

            ${criarCalculadoraFrete()}
            ${criarCupomDesconto()}
            
            <a href="produtos.html" class="btn-continuar">
                <i class="fas fa-arrow-left"></i> Continuar Comprando
            </a>
            
            <button class="btn-finalizar" onclick="finalizarCompra()">
                <i class="fas fa-credit-card"></i> Finalizar Compra
            </button>
        </div>
    `;
}

function criarCalculadoraFrete() {
    return `
        <div class="frete-calculadora">
            <h6><i class="fas fa-truck"></i> Calcular Frete</h6>
            <div class="frete-input">
                <input type="text" id="cepInput" placeholder="Digite seu CEP" maxlength="9">
                <button class="btn-cupom" onclick="calcularFrete()">Calcular</button>
            </div>
            <div id="opcoesFreteContainer" class="opcoes-frete" style="display: none;">
                <!-- Opções de frete serão inseridas aqui -->
            </div>
        </div>
    `;
}

function criarCupomDesconto() {
    return `
        <div class="cupom-desconto">
            <h6><i class="fas fa-tag"></i> Cupom de Desconto</h6>
            <div class="cupom-input">
                <input type="text" id="cupomInput" placeholder="Digite o código do cupom" 
                       ${cupomAplicado ? 'disabled value="' + cupomAplicado.codigo + '"' : ''}>
                <button class="btn-cupom" onclick="${cupomAplicado ? 'removerCupom()' : 'aplicarCupom()'}">
                    ${cupomAplicado ? 'Remover' : 'Aplicar'}
                </button>
            </div>
            ${cupomAplicado ? `
                <div style="color: var(--color-success); font-size: var(--font-size-sm); margin-top: var(--spacing-xs);">
                    <i class="fas fa-check"></i> Cupom aplicado com sucesso!
                </div>
            ` : ''}
        </div>
    `;
}

// ===================================
// FUNCIONALIDADES DO CARRINHO
// ===================================
function alterarQuantidade(produtoId, delta) {
    const item = carrinho.find(item => item.id === produtoId);
    if (!item) return;

    const novaQuantidade = item.quantidade + delta;
    
    if (novaQuantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }
    
    if (novaQuantidade > 10) {
        mostrarNotificacao('Quantidade máxima por produto é 10 unidades.', 'info');
        return;
    }

    item.quantidade = novaQuantidade;
    salvarCarrinho();
    atualizarBadges();
    renderizarCarrinho();
}

function atualizarQuantidade(produtoId, novaQuantidade) {
    const quantidade = parseInt(novaQuantidade);
    
    if (isNaN(quantidade) || quantidade <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }
    
    if (quantidade > 10) {
        mostrarNotificacao('Quantidade máxima por produto é 10 unidades.', 'info');
        return;
    }

    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.quantidade = quantidade;
        salvarCarrinho();
        atualizarBadges();
        renderizarCarrinho();
    }
}

function removerDoCarrinho(produtoId) {
    const index = carrinho.findIndex(item => item.id === produtoId);
    if (index > -1) {
        const produto = carrinho[index];
        carrinho.splice(index, 1);
        salvarCarrinho();
        atualizarBadges();
        renderizarCarrinho();
        mostrarNotificacao(`${produto.nome} removido do carrinho.`, 'info');
    }
}

function calcularSubtotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// ===================================
// SISTEMA DE FRETE
// ===================================
function calcularFrete() {
    const cepInput = document.getElementById('cepInput');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        mostrarNotificacao('Por favor, digite um CEP válido.', 'erro');
        return;
    }

    // Simular cálculo de frete
    mostrarNotificacao('Calculando frete...', 'info');
    
    setTimeout(() => {
        const opcoesFreteContainer = document.getElementById('opcoesFreteContainer');
        const opcoesFrete = [
            { nome: 'PAC', prazo: '8-12 dias úteis', valor: 15.90 },
            { nome: 'SEDEX', prazo: '3-5 dias úteis', valor: 25.90 },
            { nome: 'Expressa', prazo: '1-2 dias úteis', valor: 35.90 }
        ];

        opcoesFreteContainer.innerHTML = opcoesFrete.map((opcao, index) => `
            <div class="opcao-frete" onclick="selecionarFrete(${index})">
                <div>
                    <strong>${opcao.nome}</strong><br>
                    <small>${opcao.prazo}</small>
                </div>
                <div>
                    <strong>R$ ${opcao.valor.toFixed(2).replace('.', ',')}</strong>
                </div>
            </div>
        `).join('');

        opcoesFreteContainer.style.display = 'block';
        mostrarNotificacao('Frete calculado com sucesso!', 'sucesso');
    }, 1500);
}

function selecionarFrete(index) {
    const opcoesFrete = [
        { nome: 'PAC', prazo: '8-12 dias úteis', valor: 15.90 },
        { nome: 'SEDEX', prazo: '3-5 dias úteis', valor: 25.90 },
        { nome: 'Expressa', prazo: '1-2 dias úteis', valor: 35.90 }
    ];

    freteCalculado = opcoesFrete[index];
    
    // Atualizar interface
    document.querySelectorAll('.opcao-frete').forEach(opcao => {
        opcao.classList.remove('selecionada');
    });
    document.querySelectorAll('.opcao-frete')[index].classList.add('selecionada');
    
    renderizarCarrinho();
    mostrarNotificacao(`Frete ${freteCalculado.nome} selecionado.`, 'sucesso');
}

// ===================================
// SISTEMA DE CUPONS
// ===================================
function aplicarCupom() {
    const cupomInput = document.getElementById('cupomInput');
    const codigo = cupomInput.value.trim().toUpperCase();
    
    if (!codigo) {
        mostrarNotificacao('Digite um código de cupom.', 'erro');
        return;
    }

    // Cupons disponíveis
    const cuponsValidos = {
        'STASH10': { desconto: 10, tipo: 'percentual' },
        'BEMVINDO': { desconto: 15, tipo: 'percentual' },
        'FRETE20': { desconto: 20, tipo: 'fixo' },
        'PRIMEIRA': { desconto: 25, tipo: 'percentual' }
    };

    if (cuponsValidos[codigo]) {
        const cupom = cuponsValidos[codigo];
        const subtotal = calcularSubtotal();
        
        let valorDesconto;
        if (cupom.tipo === 'percentual') {
            valorDesconto = (subtotal * cupom.desconto) / 100;
        } else {
            valorDesconto = cupom.desconto;
        }

        cupomAplicado = {
            codigo: codigo,
            desconto: valorDesconto,
            tipo: cupom.tipo
        };

        renderizarCarrinho();
        mostrarNotificacao(`Cupom ${codigo} aplicado com sucesso!`, 'sucesso');
    } else {
        mostrarNotificacao('Cupom inválido ou expirado.', 'erro');
    }
}

function removerCupom() {
    cupomAplicado = null;
    renderizarCarrinho();
    mostrarNotificacao('Cupom removido.', 'info');
}

// ===================================
// FINALIZAÇÃO DA COMPRA
// ===================================
function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio.', 'erro');
        return;
    }

    if (!usuarioLogado) {
        mostrarNotificacao('Faça login para finalizar sua compra.', 'info');
        abrirModal('loginModal');
        return;
    }

    // Simular processo de checkout
    mostrarNotificacao('Redirecionando para o checkout...', 'info');
    
    setTimeout(() => {
        // Aqui seria redirecionado para página de checkout
        window.location.href = 'checkout.html';
    }, 1500);
}

// ===================================
// CONFIGURAÇÃO DE EVENTOS
// ===================================
function configurarEventosCarrinho() {
    // Máscara para CEP
    const cepInput = document.getElementById('cepInput');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            this.value = value;
        });
    }
}

function configurarEventosItens() {
    // Eventos já configurados via onclick nos elementos
    // Aqui podemos adicionar eventos adicionais se necessário
}

// ===================================
// EXPORTAR FUNÇÕES GLOBAIS
// ===================================
window.alterarQuantidade = alterarQuantidade;
window.atualizarQuantidade = atualizarQuantidade;
window.removerDoCarrinho = removerDoCarrinho;
window.calcularFrete = calcularFrete;
window.selecionarFrete = selecionarFrete;
window.aplicarCupom = aplicarCupom;
window.removerCupom = removerCupom;
window.finalizarCompra = finalizarCompra;

