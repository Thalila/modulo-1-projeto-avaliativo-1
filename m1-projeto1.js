let produtoAtual;

function adicionarItemLista(e) {
	e.preventDefault();
	const item = Object.fromEntries(new FormData(e.target).entries()).produto;
	if (item.trim() !== '') {
		criarElemItemLista(item);
		adicionarItemLocalStorage({ nome: item, valor: 0 });
		e.target.reset();
	}
}

function criarElemItemLista(produto, temValor = false) {
	const input = document.createElement('input');
	input.type = 'checkbox';
	input.addEventListener('change', riscarItemLista);

	const span = document.createElement('span');
	span.innerText = produto;

	const button = document.createElement('button');
	button.innerText = 'X';
	button.addEventListener('click', excluirItemLista);

	const li = document.createElement('li');

	if (temValor) {
		li.classList.add('riscar');
		input.checked = true;
	}

	li.appendChild(input);
	li.appendChild(span);
	li.appendChild(button);

	const lista = document.getElementById('lista');
	lista.appendChild(li);
}

function excluirItemLista(e) {
	e.target.parentNode.remove();

	const nomeProduto = e.target.previousElementSibling.innerText;
	const produtos = pegarProdutosLocalStorage();

	produtos.forEach((item, i) => {
		if (item.nome === nomeProduto) {
			produtos.splice(i, 1);
		}
	});

	salvarProdutosLocalStorage(produtos);
	atualizarValorTotal();
}

function riscarItemLista(e) {
	produtoAtual = e.target.nextElementSibling.textContent;

	if (e.target.checked) {
		e.target.parentNode.classList.add('riscar');
		document.getElementById('popUp').style.display = 'block';
	} else {
		e.target.parentNode.classList.remove('riscar');
		atualizarValorProduto(produtoAtual, 0);
	}
}

function adicionarValor(e) {
	e.preventDefault();
	const valor = Number(Object.fromEntries(new FormData(e.target).entries()).valor);
	if (!isNaN(valor) && valor >= 0) {
		atualizarValorProduto(produtoAtual, valor);
		document.getElementById('popUp').style.display = 'none';
		e.target.reset();
	}
}

function atualizarValorProduto(nome, valor) {
	const produtos = pegarProdutosLocalStorage();
	produtos.forEach((item, i) => {
		if (item.nome === nome) {
			produtos[i].valor = valor;
		}
	});
	salvarProdutosLocalStorage(produtos);
	atualizarValorTotal();
}

function atualizarValorTotal() {
	let total = 0;

	pegarProdutosLocalStorage().forEach((produto) => {
		total += produto.valor;
	});

	document.getElementById('valorTotal').innerText = total;
}

function adicionarItemLocalStorage(item) {
	const produtos = pegarProdutosLocalStorage();
	produtos.push(item);
	salvarProdutosLocalStorage(produtos);
}

function pegarProdutosLocalStorage() {
	return JSON.parse(localStorage.getItem('produtos')) || [];
}

function salvarProdutosLocalStorage(produtos) {
	localStorage.setItem('produtos', JSON.stringify(produtos));
}

const buscaPrincipal = document.getElementById('buscaPrincipal');
buscaPrincipal.addEventListener('submit', adicionarItemLista);

const popUp = document.getElementById('formPopUp');
popUp.addEventListener('submit', adicionarValor);

pegarProdutosLocalStorage().forEach((item) => {
	criarElemItemLista(item.nome, item.valor > 0);
});
atualizarValorTotal();
