/* Vitta+ | Acessibilidade: tamanho da letra e alto contraste.
   JavaScript puro, sem bibliotecas. As escolhas ficam salvas no navegador. */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var CHAVE_FONTE = 'vitta-nivel-fonte';
  var CHAVE_CONTRASTE = 'vitta-alto-contraste';
  var NIVEIS = [
    { classe: '', nome: 'normal', texto: 'A+', acao: 'aumentar o tamanho da letra' },
    { classe: 'fonte-grande', nome: 'grande', texto: 'A+', acao: 'aumentar o tamanho da letra' },
    { classe: 'fonte-muito-grande', nome: 'muito grande', texto: 'A\u2212', acao: 'voltar ao tamanho normal da letra' }
  ];

  function ler(chave) {
    try { return window.localStorage.getItem(chave); } catch (erro) { return null; }
  }

  function gravar(chave, valor) {
    try { window.localStorage.setItem(chave, valor); } catch (erro) { /* sem armazenamento */ }
  }

  var botaoFonte = document.getElementById('botao-fonte');
  var botaoContraste = document.getElementById('botao-contraste');
  var aviso = document.getElementById('aviso-acessibilidade');
  var nivel = 0;

  function anunciar(mensagem) {
    if (aviso) { aviso.textContent = mensagem; }
  }

  function aplicarFonte(novoNivel) {
    nivel = novoNivel;
    raiz.classList.remove('fonte-grande', 'fonte-muito-grande');
    if (NIVEIS[nivel].classe) { raiz.classList.add(NIVEIS[nivel].classe); }
    if (botaoFonte) {
      botaoFonte.querySelector('.botao_acessibilidade__texto').textContent = NIVEIS[nivel].texto;
      botaoFonte.querySelector('.somente-leitor').textContent =
        ' ' + NIVEIS[nivel].acao + '. Tamanho atual: ' + NIVEIS[nivel].nome;
    }
  }

  function aplicarContraste(ativo) {
    raiz.classList.toggle('alto-contraste', ativo);
    if (botaoContraste) { botaoContraste.setAttribute('aria-pressed', ativo ? 'true' : 'false'); }
  }

  var salvo = parseInt(ler(CHAVE_FONTE), 10);
  aplicarFonte(salvo >= 0 && salvo < NIVEIS.length ? salvo : 0);
  aplicarContraste(ler(CHAVE_CONTRASTE) === 'sim');

  if (botaoFonte) {
    botaoFonte.parentNode.hidden = false;
    botaoFonte.addEventListener('click', function () {
      aplicarFonte((nivel + 1) % NIVEIS.length);
      gravar(CHAVE_FONTE, String(nivel));
      anunciar('Tamanho da letra: ' + NIVEIS[nivel].nome + '.');
    });
  }

  if (botaoContraste) {
    botaoContraste.parentNode.hidden = false;
    botaoContraste.addEventListener('click', function () {
      var ativo = !raiz.classList.contains('alto-contraste');
      aplicarContraste(ativo);
      gravar(CHAVE_CONTRASTE, ativo ? 'sim' : 'nao');
      anunciar(ativo ? 'Alto contraste ativado.' : 'Alto contraste desativado.');
    });
  }
})();