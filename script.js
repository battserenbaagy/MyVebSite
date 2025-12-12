/**
 * Local Storage-оос таалагдсан бүтээгдэхүүнүүдийг авах функц
 * @returns {Array<Object>} Таалагдсан бүтээгдэхүүнүүдийн жагсаалт
 */
function getLikedItems() {
    const likedItemsJSON = localStorage.getItem('wishlist');
    return likedItemsJSON ? JSON.parse(likedItemsJSON) : [];
}

/**
 * Local Storage-д таалагдсан бүтээгдэхүүнүүдийг хадгалах функц
 * @param {Array<Object>} items Хадгалах бүтээгдэхүүнүүдийн жагсаалт
 */
function saveLikedItems(items) {
    localStorage.setItem('wishlist', JSON.stringify(items));
}

/**
 * Local Storage-оос сагсны бүтээгдэхүүнүүдийг авах функц
 * @returns {Array<Object>} Сагсны бүтээгдэхүүнүүдийн жагсаалт
 */
function getCartItems() {
    const cartItemsJSON = localStorage.getItem('cart');
    return cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
}

/**
 * Local Storage-д сагсны бүтээгдэхүүнүүдийг хадгалах функц
 * @param {Array<Object>} items Хадгалах бүтээгдэхүүнүүдийн жагсаалт
 */
function saveCartItems(items) {
    localStorage.setItem('cart', JSON.stringify(items));
}

/**
 * Сагсанд нэмэх функц
 */
function addToCart(id, name, price, img) {
    let cartItems = getCartItems();
    const existingItemIndex = cartItems.findIndex(item => item.id === id);

    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity =
            (cartItems[existingItemIndex].quantity || 1) + 1;
    } else {
        const newItem = { id, name, price, img, quantity: 1 };
        cartItems.push(newItem);
    }

    saveCartItems(cartItems);

    // ✔ Зассан хэсэг — template literal зөв болгов
    alert(`${name} бүтээгдэхүүн сагсанд нэмэгдлээ!`);
}

/**
 * Таалагдсан бүтээгдэхүүнийг нэмэх эсвэл устгах
 */
function toggleWishlist(id, name, price, img, button) {
    let likedItems = getLikedItems();
    const itemIndex = likedItems.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        likedItems.splice(itemIndex, 1);
        if (button) {
            button.innerHTML = '❤️ Таалагдсан';
            button.classList.remove('added');
        }
    } else {
        likedItems.push({ id, name, price, img });
        if (button) {
            button.innerHTML = '💔 Хасах';
            button.classList.add('added');
        }
    }

    saveLikedItems(likedItems);

    if (document.getElementById('liked-items-list')) {
        displayWishlist();
    }
}

/**
 * Нүүр хуудасны wishlist товчлууруудыг шинэчлэх
 */
function updateWishlistButtons() {
    const likedItems = getLikedItems();

    document.querySelectorAll('.add-wishlist').forEach(button => {
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        const img = button.dataset.img;
        const isLiked = likedItems.some(item => item.id === id);

        if (isLiked) {
            button.innerHTML = '💔 Хасах';
            button.classList.add('added');
        } else {
            button.innerHTML = '❤️ Таалагдсан';
            button.classList.remove('added');
        }

        // ✔ Event listener давхардахаас сэргийлж remove хийж дахин холбов
        button.onclick = () => toggleWishlist(id, name, price, img, button);
    });
}

/**
 * Wishlist хуудас дээр харуулах
 */
function displayWishlist() {
    const listContainer = document.getElementById('liked-items-list');
    if (!listContainer) return;

    const likedItems = getLikedItems();
    listContainer.innerHTML = '';

    if (likedItems.length === 0) {
        listContainer.innerHTML =
            '<p>Таалагдсан бараа алга байна.</p>';
        return;
    }

    const productGrid = document.createElement('div');
    productGrid.classList.add('product-grid');

    likedItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('product');

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Үнэ: ${item.price.toLocaleString('en-US')}₮</p>
            <div class="product-links">
                <button class="add-to-cart-wishlist"
                    data-id="${item.id}"
                    data-name="${item.name}"
                    data-price="${item.price}"
                    data-img="${item.img}">
                    🛒 Сагсанд нэмэх
                </button>
                <button class="remove-wishlist" data-id="${item.id}">
                    🗑️ Устгах
                </button>
            </div>
        `;

        productGrid.appendChild(div);
    });

    listContainer.appendChild(productGrid);

    // Устгах товч
    document.querySelectorAll('.remove-wishlist').forEach(btn => {
        btn.onclick = () => {
            toggleWishlist(btn.dataset.id, "", 0, "", null);
        };
    });

    // Wishlist дээрх сагсанд нэмэх товч
    document.querySelectorAll('.add-to-cart-wishlist').forEach(btn => {
        btn.onclick = () => {
            addToCart(
                btn.dataset.id,
                btn.dataset.name,
                parseInt(btn.dataset.price),
                btn.dataset.img
            );
        };
    });
}

// Хуудас ачаалахад ажиллуулах
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistButtons();

    if (document.getElementById('liked-items-list')) {
        displayWishlist();
    }
});
