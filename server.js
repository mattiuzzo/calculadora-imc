const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Função para classificar IMC
function classificarIMC(imc) {
  if (imc < 18.5) {
    return {
      categoria: 'Magreza',
      classe: 'magreza',
      cor: '#3498db',
      descricao: 'Você está abaixo do peso ideal'
    };
  } else if (imc >= 18.5 && imc <= 24.9) {
    return {
      categoria: 'Eutrofia',
      classe: 'eutrofia',
      cor: '#2ecc71',
      descricao: 'Você está no peso ideal'
    };
  } else if (imc >= 25 && imc <= 29.9) {
    return {
      categoria: 'Sobrepeso',
      classe: 'sobrepeso',
      cor: '#f39c12',
      descricao: 'Você está acima do peso'
    };
  } else if (imc >= 30 && imc <= 34.9) {
    return {
      categoria: 'Obesidade Grau I',
      classe: 'obesidade-i',
      cor: '#e67e22',
      descricao: 'Atenção: Obesidade Grau I'
    };
  } else if (imc >= 35 && imc <= 40) {
    return {
      categoria: 'Obesidade Grau II',
      classe: 'obesidade-ii',
      cor: '#e74c3c',
      descricao: 'Atenção: Obesidade Grau II'
    };
  } else {
    return {
      categoria: 'Obesidade Grau III',
      classe: 'obesidade-iii',
      cor: '#c0392b',
      descricao: 'Atenção: Obesidade Grau III'
    };
  }
}

// Rota para calcular IMC
app.post('/api/calcular-imc', (req, res) => {
  try {
    const { peso, altura } = req.body;

    // Validações
    if (!peso || !altura) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Peso e altura são obrigatórios'
      });
    }

    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    if (isNaN(pesoNum) || isNaN(alturaNum)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Peso e altura devem ser números válidos'
      });
    }

    if (pesoNum <= 0 || alturaNum <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Peso e altura devem ser maiores que zero'
      });
    }

    if (alturaNum > 3) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Altura deve ser em metros (ex: 1.75)'
      });
    }

    // Cálculo do IMC
    const imc = pesoNum / (alturaNum * alturaNum);
    const classificacao = classificarIMC(imc);

    res.json({
      sucesso: true,
      dados: {
        peso: pesoNum,
        altura: alturaNum,
        imc: parseFloat(imc.toFixed(2)),
        classificacao: classificacao
      }
    });
  } catch (erro) {
    console.error('Erro no cálculo:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao processar o cálculo'
    });
  }
});

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensagem: 'API da Calculadora de IMC está funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});