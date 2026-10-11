const products = [
    {
        id: 1,
        name: "Smartfon",
        category: "Elektronika",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Noutbuk",
        category: "Kompyuter texnikasi",
        price: 6500000,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Quloqchin",
        category: "Aksessuarlar",
        price: 350000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    }
];

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const product = products.find(item => item.id === productId);

const formatPrice = price =>
    new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";

function showToast(text) {
    const toast = document.getElementById("toast");

    toast.textContent = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("uzum-cart")) || [];

    const count = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    document.getElementById("cartCount").textContent = count;
}

if (product) {
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productCategory").textContent = product.category;
    document.getElementById("productPrice").textContent =
        formatPrice(product.price);

    document.getElementById("productImage").src = product.image;
    document.getElementById("productImage").alt = product.name;

    document.title = product.name + " | Uzum Market";

    document.getElementById("addToCart").addEventListener("click", () => {
        const quantity = Number(
            document.getElementById("quantity").value
        );

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
            showToast("Mahsulot sonini 1 dan 99 gacha kiriting.");
            return;
        }

        const cart = JSON.parse(localStorage.getItem("uzum-cart")) || [];

        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                quantity: quantity
            });
        }

        localStorage.setItem("uzum-cart", JSON.stringify(cart));

        updateCartCount();
        showToast("Mahsulot savatga qo‘shildi!");
    });
} else {
    document.querySelector(".product").innerHTML = `
        <div>
            <h2>Mahsulot topilmadi</h2>
            <p>Mahsulotni bosh sahifadan tanlang.</p>
            <br>
            <a href="index.html">Bosh sahifaga qaytish</a>
        </div>
    `;
}

document.getElementById("cartBtn").addEventListener("click", () => {
    window.location.href = "cart.html";
});


updateCartCount();