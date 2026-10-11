
const products = [
    {
        id: 1,
        name: "Samsung Galaxy S24 Ultra",
        category: "Elektronika",
        price: 11999000,
        oldPrice: 13999000,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1707580302635-4e1f2e9b4a80?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Simsiz Bluetooth quloqchin",
        category: "Elektronika",
        price: 249000,
        oldPrice: 349000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Sport krossovkasi",
        category: "Poyabzal",
        price: 429000,
        oldPrice: 549000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Aqlli qo‘l soati",
        category: "Elektronika",
        price: 599000,
        oldPrice: 749000,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Zamonaviy ryukzak",
        category: "Aksessuar",
        price: 199000,
        oldPrice: 279000,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Klassik sport futbolkasi",
        category: "Kiyim",
        price: 149000,
        oldPrice: 199000,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Zamonaviy quyosh ko‘zoynagi",
        category: "Aksessuar",
        price: 129000,
        oldPrice: 179000,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Uy uchun stol chirog‘i",
        category: "Uy uchun",
        price: 189000,
        oldPrice: 239000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
    }
];

const $ = (selector) => document.querySelector(selector);

let activeCategory = "Barchasi";
let searchQuery = "";
let favorites = new Set();
let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("uzum-cart") || "[]"
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            products.some(product => product.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    }

    const savedFavorites = JSON.parse(
        localStorage.getItem("uzum-favorites") || "[]"
    );

    if (Array.isArray(savedFavorites)) {
        favorites = new Set(
            savedFavorites.filter(id =>
                products.some(product => product.id === id)
            )
        );
    }
} catch (error) {
    cart = [];
    favorites = new Set();
}

// NARXNI CHIROYLI FORMATLASH

function formatPrice(price) {
    return price.toLocaleString("uz-UZ") + " so‘m";
}

// XAVFSIZ HTML MATN

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// MAHSULOTLARNI CHIQARISH

function renderProducts() {
    const grid = $("#productsGrid");

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            activeCategory === "Barchasi" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery);

        const matchesFavorites =
            !showingFavorites || favorites.has(product.id);

        return matchesCategory && matchesSearch && matchesFavorites;
    });

    $("#resultCount").textContent =
        filteredProducts.length + " ta mahsulot";

    $("#emptyMessage").hidden = filteredProducts.length !== 0;

    grid.innerHTML = filteredProducts.map(product => {
        const discount = Math.round(
            (1 - product.price / product.oldPrice) * 100
        );

        return `
            <article class="product-card">
                <div class="product-picture">
                    <span class="discount">-${discount}%</span>

                    <button
                        class="favorite-btn ${favorites.has(product.id) ? "active" : ""}"
                        data-favorite="${product.id}"
                        aria-label="Sevimlilarga qo‘shish"
                    >${favorites.has(product.id) ? "♥" : "♡"}</button>

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                    >
                </div>

                <div class="product-info">
                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <h3>${escapeHTML(product.name)}</h3>

                    <div class="rating">
                        ★ ${product.rating}
                        <span> • Xaridorlar tanlovi</span>
                    </div>

                    <div class="old-price">
                        ${formatPrice(product.oldPrice)}
                    </div>

                    <div class="product-price">
                        ${formatPrice(product.price)}
                    </div>

                    <button
                        class="add-btn"
                        data-add="${product.id}"
                    >+ Savatga qo‘shish</button>
                </div>
            </article>
        `;
    }).join("");
}

let showingFavorites = false;

// QIDIRUV

$("#searchForm").addEventListener("submit", event => {
    event.preventDefault();

    searchQuery = $("#searchInput").value
        .toLowerCase()
        .trim();

    showingFavorites = false;
    renderProducts();
});

// KATEGORIYALAR

$("#categoryNav").addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;
    showingFavorites = false;

    $("#categoryNav").querySelectorAll("button").forEach(item => {
        item.classList.toggle("active", item === button);
    });

    renderProducts();
});

// KATALOG TUGMASI

$("#catalogBtn").addEventListener("click", () => {
    $("#categoryNav").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// SEVIMLILAR

$("#favoritesBtn").addEventListener("click", () => {
    showingFavorites = !showingFavorites;
    activeCategory = "Barchasi";
    searchQuery = "";
    $("#searchInput").value = "";

    $("#categoryNav").querySelectorAll("button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === "Barchasi"
        );
    });

    renderProducts();

    $("#products").scrollIntoView({ behavior: "smooth" });

    showToast(
        showingFavorites
            ? "Sevimli mahsulotlaringiz"
            : "Barcha mahsulotlar"
    );
});

// MAHSULOT TUGMALARI

$("#productsGrid").addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const favoriteButton = event.target.closest("[data-favorite]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
    }

    if (favoriteButton) {
        toggleFavorite(Number(favoriteButton.dataset.favorite));
    }
});

function toggleFavorite(id) {
    if (favorites.has(id)) {
        favorites.delete(id);
        showToast("Sevimlilardan olib tashlandi");
    } else {
        favorites.add(id);
        showToast("Sevimlilarga qo‘shildi");
    }

    localStorage.setItem(
        "uzum-favorites",
        JSON.stringify([...favorites])
    );

    renderProducts();
}

// SAVATCHA

function saveCart() {
    localStorage.setItem("uzum-cart", JSON.stringify(cart));
}

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: id, quantity: 1 });
    }

    saveCart();
    renderCart();
    showToast("Mahsulot savatga qo‘shildi");
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    showToast("Mahsulot savatdan olib tashlandi");
}

function renderCart() {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);

        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    $("#cartCount").textContent = count;
    $("#cartTotal").textContent = formatPrice(total);

    if (cart.length === 0) {
        $("#cartItems").innerHTML = `
            <div class="cart-empty">
                <div style="font-size:40px">🛒</div>
                <p>Savatchangiz hozircha bo‘sh.</p>
                <p>O‘zingizga yoqqan mahsulotni tanlang!</p>
            </div>
        `;
        return;
    }

    $("#cartItems").innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return "";

        return `
            <div class="cart-item">
                <div>
                    <h3>${escapeHTML(product.name)}</h3>
                    <p>${formatPrice(product.price * item.quantity)}</p>

                    <div class="quantity-controls">
                        <button data-minus="${item.id}" aria-label="Kamaytirish">−</button>
                        <span>${item.quantity}</span>
                        <button data-plus="${item.id}" aria-label="Ko‘paytirish">+</button>
                    </div>
                </div>

                <button
                    class="remove-btn"
                    data-remove="${item.id}"
                >O‘chirish</button>
            </div>
        `;
    }).join("");
}

$("#cartItems").addEventListener("click", event => {
    const minus = event.target.closest("[data-minus]");
    const plus = event.target.closest("[data-plus]");
    const remove = event.target.closest("[data-remove]");

    if (minus) changeQuantity(Number(minus.dataset.minus), -1);
    if (plus) changeQuantity(Number(plus.dataset.plus), 1);
    if (remove) removeFromCart(Number(remove.dataset.remove));
});

// SAVATCHANI OCHISH VA YOPISH

function openCart() {
    $("#cartDrawer").classList.add("open");
    $("#overlay").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    $("#cartDrawer").classList.remove("open");
    $("#overlay").classList.remove("open");
    document.body.style.overflow = "";
}

$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
});

// DEMO TUGMALARI

$("#loginBtn").addEventListener("click", () => {
    showToast("Login sahifasini keyingi bosqichda yaratamiz.");
});

$("#checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Avval savatchaga mahsulot qo‘shing.");
        return;
    }

    showToast("Buyurtma sahifasi keyingi bosqichda yaratiladi.");
});

// XABAR

let toastTimer;

function showToast(message) {
    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// SAYTNI ISHGA TUSHIRISH

renderProducts();
renderCart();
