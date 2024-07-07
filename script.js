document.addEventListener('DOMContentLoaded', function () {
    // Fetch products from JSON
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            displayProducts(data.products);
        });

    function displayProducts(products) {
        const productContainer = document.querySelector('.product-container');
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item', 'flex', 'flex-col', 'gap-2');

            productElement.innerHTML = `
                <div style="background-image: url('${product.image}');"></div>
                <div>
                    <p class="text-base font-medium text-black">${product.name}</p>
                    <p class="text-sm text-gray-600">${product.price} VND</p>
                    <button class="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
                </div>
            `;
            productContainer.appendChild(productElement);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function () {
                const itemName = this.dataset.name;
                const itemPrice = parseInt(this.dataset.price);
                addToCart(itemName, itemPrice);
            });
        });
    }

    // Cart functionality
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartIcon.addEventListener('mouseover', function () {
        cartDropdown.classList.add('visible');
    });

    cartIcon.addEventListener('mouseout', function () {
        cartDropdown.classList.remove('visible');
    });

    cartDropdown.addEventListener('mouseover', function () {
        cartDropdown.classList.add('visible');
    });

    cartDropdown.addEventListener('mouseout', function () {
        cartDropdown.classList.remove('visible');
    });

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCart();
    }

    function removeFromCart(name) {
        const itemIndex = cart.findIndex(item => item.name === name);
        if (itemIndex > -1) {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity === 0) {
                cart.splice(itemIndex, 1);
            }
            updateCart();
        }
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'flex', 'justify-between', 'items-center', 'border-b', 'py-2');
            cartItem.innerHTML = `
                <div>
                    <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                    <p class="text-gray-600">Số lượng: ${item.quantity}</p>
                </div>
                <div class="flex items-center">
                    <span class="text-gray-800 mr-4">${item.price * item.quantity} VND</span>
                    <button class="text-red-500 remove-from-cart" data-name="${item.name}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });
        cartTotal.textContent = `${total} VND`;
        localStorage.setItem('cart', JSON.stringify(cart));

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function () {
                const itemName = this.dataset.name;
                removeFromCart(itemName);
            });
        });
    }

    updateCart();
});
