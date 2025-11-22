const form = document.getElementById('imcForm');
const resultadoDiv = document.getElementById('resultado');
const erroDiv = document.getElementById('erro');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;

    try {
        const resposta = await fetch('/api/calcular-imc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ peso, altura })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            exibirResultado(dados.dados);
            fecharErro();
        } else {
            exibirErro(dados.mensagem);
        }
    } catch (erro) {
        console.error('Erro:', erro);
        exibirErro('Erro ao conectar com o servidor. Tente novamente.');
    }
});

function exibirResultado(dados) {
    const { imc, classificacao, peso, altura } = dados;

    document.getElementById('imcNumero').textContent = imc;
    document.getElementById('pesoBkp').textContent = `${peso} kg`;
    document.getElementById('alturaBkp').textContent = `${altura} m`;

    const classificacaoDiv = document.getElementById('classificacao');
    classificacaoDiv.className = `resultado-classificacao ${classificacao.classe}`;
    classificacaoDiv.innerHTML = `
        <div class="categoria">${classificacao.categoria}</div>
        <div class="descricao">${classificacao.descricao}</div>
    `;

    resultadoDiv.classList.remove('hidden');
    erroDiv.classList.add('hidden');

    // Scroll para o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function exibirErro(mensagem) {
    document.getElementById('mensagemErro').textContent = mensagem;
    erroDiv.classList.remove('hidden');
    resultadoDiv.classList.add('hidden');

    // Scroll para o erro
    erroDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function fecharErro() {
    erroDiv.classList.add('hidden');
}

function limparResultado() {
    form.reset();
    resultadoDiv.classList.add('hidden');
    erroDiv.classList.add('hidden');
    document.getElementById('peso').focus();
}