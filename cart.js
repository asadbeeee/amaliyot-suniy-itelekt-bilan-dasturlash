    
const products = [
    {
        id: 1,
        name: "Smartfon",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 2,
        name: "Noutbuk",
        price: 6500000,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 3,
        name: "Quloqchin",
        price: 350000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"
    }
];

const cartItems = document.getElementById("cartItems");

const formatPrice = price =>
    new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";

function getCart() {
    return JSON.parse(localStorage.getItem("uzum-cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("uzum-cart", JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();

    const validCart = cart.filter(item =>
        products.some(product => product.id === item.id)
    );

    cartItems.innerHTML = "";

    if (validCart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty">
                <h2>Savatingiz hozircha bo‘sh 🛒</h2>
                <p>O‘zingizga yoqqan mahsulotlarni tanlang.</p>
                <a href="index.html">Xarid qilish</a>
            </div>
        `;

        document.getElementById("itemsCount").textContent = "0 ta";
        document.getElementById("totalPrice").textContent = "0 so‘m";
        document.getElementById("checkoutBtn").disabled = true;

        saveCart([]);
        return;
    }

    saveCart(validCart);

    let total = 0;
    let count = 0;

    validCart.forEach(item => {
        const product = products.find(p => p.id === item.id);

        const quantity = Math.max(
            1,
            Math.min(99, Math.floor(Number(item.quantity) || 1))
        );

        item.quantity = quantity;

        total += product.price * quantity;
        count += quantity;

        const card = document.createElement("article");
        card.className = "cart-card";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;

        const info = document.createElement("div");
        info.className = "item-info";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "item-price";
        price.textContent = formatPrice(product.price * quantity);

        const quantityBox = document.createElement("div");
        quantityBox.className = "quantity";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.setAttribute("aria-label", "Mahsulot sonini kamaytirish");

        const quantityText = document.createElement("span");
        quantityText.textContent = quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Mahsulot sonini oshirish");

        minus.disabled = quantity <= 1;
        plus.disabled = quantity >= 99;

        minus.addEventListener("click", () => changeQuantity(item.id, -1));
        plus.addEventListener("click", () => changeQuantity(item.id, 1));

        quantityBox.append(minus, quantityText, plus);
        info.append(name, price, quantityBox);

        const remove = document.createElement("button");
        remove.className = "remove";
        remove.textContent = "🗑️ O‘chirish";

        remove.addEventListener("click", () => {
            saveCart(getCart().filter(p => p.id !== item.id));
            renderCart();
        });

        card.append(img, info, remove);
        cartItems.appendChild(card);
    });

    saveCart(validCart);

    document.getElementById("itemsCount").textContent = count + " ta";
    document.getElementById("totalPrice").textContent = formatPrice(total);
    document.getElementById("checkoutBtn").disabled = false;
}

function changeQuantity(id, amount) {
    const cart = getCart();

    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity = Math.max(
        1,
        Math.min(99, item.quantity + amount)
    );

    saveCart(cart);
    renderCart();
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
    document.getElementById("checkoutMessage").textContent =
        "Buyurtma berish uchun keyingi bosqichda yetkazib berish ma’lumotlarini qo‘shamiz.";
});

renderCart();
