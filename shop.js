// ---------------- LocalStorage функцууд ----------------
function getCartItems() {
    const cartItemsJSON = localStorage.getItem('cart');
    return cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
}

function saveCartItems(items) {
    localStorage.setItem('cart', JSON.stringify(items));
}

function getLikedItems() {
    const likedItemsJSON = localStorage.getItem('wishlist');
    return likedItemsJSON ? JSON.parse(likedItemsJSON) : [];
}

function saveLikedItems(items) {
    localStorage.setItem('wishlist', JSON.stringify(items));
}

// ---------------- Cart функцууд ----------------
function addToCart(id, name, price, img) {
    let cartItems = getCartItems();
    const existingIndex = cartItems.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cartItems[existingIndex].quantity = (cartItems[existingIndex].quantity || 1) + 1;
    } else {
        cartItems.push({id, name, price, img, quantity: 1});
    }

    saveCartItems(cartItems);
    displayCart();
}

function removeFromCart(id) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.id !== id);
    saveCartItems(cartItems);
    displayCart();
}

function displayCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const cartItems = getCartItems();

    if(cartItems.length === 0){
        container.innerHTML = '<p>Сагс хоосон байна.</p>';
        return;
    }

    const productGrid = document.createElement('div');
    productGrid.classList.add('product-grid');

    cartItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('product');
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Үнэ: ${Number(item.price).toLocaleString('en-US')}₮</p>
            <p>Тоо: ${item.quantity}</p>
            <div class="product-links">
                <button class="add-to-cart" data-id="${item.id}">➕ Нэмэх</button>
                <button class="remove-cart" data-id="${item.id}">❌ Устгах</button>
            </div>
        `;
        productGrid.appendChild(div);
    });

    container.innerHTML = '';
    container.appendChild(productGrid);

    // Event listener-үүд
    document.querySelectorAll('.remove-cart').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = cartItems.find(i => String(i.id) === String(btn.getAttribute('data-id')));
            if(item) addToCart(item.id, item.name, item.price, item.img);
        });
    });
}

// ---------------- Wishlist функцууд ----------------
function toggleWishlist(id, name, price, img, button) {
    let likedItems = getLikedItems();
    const itemIndex = likedItems.findIndex(item => item.id === id);

    if(itemIndex > -1){
        likedItems.splice(itemIndex, 1);
        button.innerHTML = '❤️ Таалагдсан';
        button.classList.remove('added');
    } else {
        likedItems.push({id, name, price, img});
        button.innerHTML = '💔 Хасах';
        button.classList.add('added');
    }
    saveLikedItems(likedItems);
}

function updateWishlistButtons() {
    const likedItems = getLikedItems();
    const buttons = document.querySelectorAll('.add-wishlist');

    buttons.forEach(button => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));
        const img = button.getAttribute('data-img');
        const isLiked = likedItems.some(item => item.id === id);

        if(isLiked){
            button.innerHTML = '💔 Хасах';
            button.classList.add('added');
        } else {
            button.innerHTML = '❤️ Таалагдсан';
            button.classList.remove('added');
        }

        button.addEventListener('click', () => toggleWishlist(id, name, price, img, button));
    });
}

// ---------------- Product хуудсанд товчлуурууд ----------------
function setupProductButtons() {
    // Cart товчлуурууд
    const cartButtons = document.querySelectorAll('.add-cart');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));
            const img = btn.getAttribute('data-img');
            addToCart(id, name, price, img);
        });
    });

    // Wishlist товчлуурууд
    updateWishlistButtons();
}

// ---------------- DOMContentLoaded ----------------
document.addEventListener('DOMContentLoaded', () => {
    setupProductButtons();
    displayCart();
});

