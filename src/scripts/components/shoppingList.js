// O export é usado para permitir o acesso por outro arquivo separado.
export class shoppingList {
    // O construtor está sendo usado para inicializar as funções.
    constructor() {
        // Cria uma array vazia.
        this.list = [];

        // Chama as funções.
        this.selectors();
        this.events();
    }

    // Função responsável por armazenar os seletores.
    selectors() {
        this.quantityInput = document.querySelector(".shopping-form-quantity-input");
        this.incrementButton = document.querySelector(".shopping-form-increment-button");
        this.decrementButton = document.querySelector(".shopping-form-decrement-button");
        this.form = document.querySelector(".shopping-form");
        this.itemInput = document.querySelector(".shopping-form-item-input");
        this.items = document.querySelector(".shopping-items");
    }

    // Função responsável por armazenar os eventos.
    events() {
        // O bind serve para dizer que é para ignorar o this assim evitando de ficar com um valor indefinido nos .value.
        this.incrementButton.addEventListener("click", this.incrementQuantity.bind(this));
        this.decrementButton.addEventListener("click", this.decrementQuantity.bind(this));
        this.form.addEventListener("submit", this.addItemToList.bind(this));
    }

    // Função responsável por fazer o botão "+" funcionar.
    incrementQuantity() {
        // Armazena o valor number do input de quantidade.
        const currentValue = Number(this.quantityInput.value);
        // Armazena o valor do input e soma com mais 1.
        const newValue = currentValue + 1;
        // Retorna o valor com o resultado da soma.
        this.quantityInput.value = newValue;
    }

    // Função responsável por fazer o botão "-" funcionar.
    decrementQuantity() {
        // Armazena o valor number do input de quantidade.
        const currentValue = Number(this.quantityInput.value);
        // Armazena o valor do input e subtrai por menos 1.
        const newValue = currentValue - 1;

        // Se o valor armazenado no newValue for maior que zero ele irá executar o bloco de comandos.
        if (newValue > 0) {
            // Retorna o valor com o resultado da subtração.
            this.quantityInput.value = newValue;
        }
    }

    // Função responsável por armazenar as informações enviadas e mostra-las na tela.
    addItemToList(e) {
        // Evita que a pagina recarregue ao enviar o form.
        e.preventDefault();

        // Está armazenando o evento de clique, e o target é usado para armazenar o elemento na qual foi disparado.
        // Quando colocado "[]" ele pega uma propriedade especifica(sendo filho).
        const itemName = e.target["item-name"].value;
        const itemQuantity = e.target["item-quantity"].value;

        // Se o input de item name for diferente que vazio irá executar o bloco de comandos.
        if (itemName !== "") {
            // Criado um objeto para armazenar as informações.
            const item = {
                name: itemName,
                quantity: itemQuantity,
            };

            // Irá adicionar um novo elemento/item na lista array vazia.
            this.list.push(item);
            // Após adicionar vai executar a função chamada.
            this.renderListItems();
            // Em seguida irá limpar os inputs.
            this.resetInputs();
        }
    }

    // Função responsável por enviar as informações da lista para o HTML.
    renderListItems() {
        // Criado uma string vazia.
        let itemsStructure = "";

        // Percorre por todo o objeto e seus elementos retornando-os.
        this.list.forEach((item) => {
            itemsStructure += `
            <li class="shopping-item">
                <span>
                    ${item.name}
                </span>

                <span>
                    ${item.quantity}
                </span>
            </li>
            `;
        });

        // Está mandando a conversão da string convertida para HTML para a string vazia.
        this.items.innerHTML = itemsStructure;
    }

    // Função responsável por limpar os inputs.
    resetInputs() {
        this.itemInput.value = "";
        this.quantityInput.value = 1;
    }
}
