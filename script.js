// Simple mock data – extend as you like
const products = [
  {
    id: 1,
    title: "Samsung Galaxy S23 5G (Green, 128 GB)",
    category: "Mobiles",
    price: 54999,
    mrp: 69999,
    rating: 4.6,
    ratingCount: 8123
  },
  {
    id: 2,
    title: "Apple iPhone 15 (Blue, 128 GB)",
    category: "Mobiles",
    price: 76999,
    mrp: 79999,
    rating: 4.8,
    ratingCount: 12034
  },
  {
    id: 3,
    title: "boAt Rockerz 450 Bluetooth Headset",
    category: "Electronics",
    price: 1499,
    mrp: 3990,
    rating: 4.2,
    ratingCount: 23041
  },
  {
    id: 4,
    title: "HP 15s Intel Core i5 12th Gen Laptop",
    category: "Electronics",
    price: 56999,
    mrp: 68999,
    rating: 4.3,
    ratingCount: 5321
  },
  {
    id: 5,
    title: "Men Slim Fit Solid Casual Shirt",
    category: "Fashion",
    price: 699,
    mrp: 1999,
    rating: 4.1,
    ratingCount: 9821
  },
  {
    id: 6,
    title: "Women A-Line Printed Kurta",
    category: "Fashion",
    price: 899,
    mrp: 2499,
    rating: 4.4,
    ratingCount: 7441
  },
  {
    id: 7,
    title: "Prestige 5 L Pressure Cooker",
    category: "Home & Kitchen",
    price: 1899,
    mrp: 2999,
    rating: 4.2,
    ratingCount: 1312
  },
  {
    id: 8,
    title: "Milton Duo Deluxe 1 L Flask",
    category: "Home & Kitchen",
    price: 899,
    mrp: 1599,
    rating: 4.5,
    ratingCount: 923
  },
  {
    id: 9,
    title: "Sony Bravia 55 inch 4K Smart TV",
    category: "Electronics",
    price: 64999,
    mrp: 89999,
    rating: 4.7,
    ratingCount: 3123
  },
  {
    id: 10,
    title: "Adidas Running Shoes For Men",
    category: "Fashion",
    price: 2999,
    mrp: 5999,
    rating: 4.3,
    ratingCount: 851
  }
];

const categoryBar = document.getElementById("categoryBar");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartDrawer = document.getElementById("cartDrawer");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartCount = document.getElementById("cartCount");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartDiscountEl = document.getElementById("cartDiscount");
const cartTotalEl = document.getElementById("cartTotal");

let activeCategory = "all";
let activeSearch = "";
let activeSort = "relevance";
let cart = loadCartFromStorage();

// Init
init();

function init() {
  renderCategories();
  renderProductGrid();
  updateCartView();
  attachEvents();
}

function attachEvents() {
  categorySelect.addEventListener("change", (e) => {
    activeCategory = e.target.value;
    markActiveCategoryButton();
    renderProductGrid();
  });

  sortSelect.addEventListener("change", (e) => {
    activeSort = e.target.value;
    renderProductGrid();
  });

  searchBtn.addEventListener("click", () => {
    activeSearch = searchInput.value.trim().toLowerCase();
    renderProductGrid();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      activeSearch = searchInput.value.trim().toLowerCase();
      renderProductGrid();
    }
  });

  openCartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
}

function renderCategories() {
  const uniqueCategories = [
    ...new Set(products.map((p) => p.category))
  ].sort();

  // Dropdown
  uniqueCategories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  // Horizontal bar
  // "All" button
  const allBtn = createCategoryButton("all", "All");
  categoryBar.appendChild(allBtn);

  uniqueCategories.forEach((cat) => {
    const btn = createCategoryButton(cat, cat);
    categoryBar.appendChild(btn);
  });

  markActiveCategoryButton();
}

function createCategoryButton(value, label) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.dataset.category = value;
  btn.addEventListener("click", () => {
    activeCategory = value;
    categorySelect.value = value === "all" ? "all" : value;
    markActiveCategoryButton();
    renderProductGrid();
  });
  return btn;
}

function markActiveCategoryButton() {
  const buttons = categoryBar.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.dataset.category === activeCategory
    );
  });
}

// Main listing
function renderProductGrid() {
  productGrid.innerHTML = "";

  let filtered = products.filter((p) => {
    const catOk =
      activeCategory === "all" || p.category === activeCategory;
    const searchOk =
      !activeSearch ||
      p.title.toLowerCase().includes(activeSearch);
    return catOk && searchOk;
  });

  // Sort
  if (activeSort === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeSort === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (activeSort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (!filtered.length) {
    productGrid.innerHTML =
      "<p>No products found for your search/filters.</p>";
    return;
  }

  filtered.forEach((product) => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const img = document.createElement("div");
  img.className = "product-image";
  img.textContent = "";

  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = product.title;

  const meta = document.createElement("div");
  meta.className = "product-meta";
  meta.innerHTML = `
      <span class="rating-badge">${product.rating} ★</span>
      <span>${product.ratingCount.toLocaleString()} Ratings</span>
  `;

  const priceRow = document.createElement("div");
  priceRow.className = "product-price-row";
  const discountPercent = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );
  priceRow.innerHTML = `
      <span class="product-price">₹${product.price.toLocaleString()}</span>
      <span class="product-mrp">₹${product.mrp.toLocaleString()}</span>
      <span class="product-discount">${discountPercent}% off</span>
  `;

  const actions = document.createElement("div");
  actions.className = "product-actions";

  const addBtn = document.createElement("button");
  addBtn.className = "btn-add-cart";
  addBtn.textContent = "ADD TO CART";
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product.id);
  });

  const wishBtn = document.createElement("button");
  wishBtn.className = "btn-wishlist";
  wishBtn.textContent = "♡";
  // Just a placeholder – hook to wishlist logic if needed

  actions.appendChild(addBtn);
  actions.appendChild(wishBtn);

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(priceRow);
  card.appendChild(actions);

  return card;
}

// Cart logic

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem("cstores_cart");
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (e) {
    return {};
  }
}

function saveCartToStorage() {
  localStorage.setItem("cstores_cart", JSON.stringify(cart));
}

function addToCart(productId) {
  if (!cart[productId]) {
    cart[productId] = 1;
  } else {
    cart[productId] += 1;
  }
  saveCartToStorage();
  updateCartView();
}

function updateCartView() {
  // Update count
  const totalQty = Object.values(cart).reduce(
    (sum, qty) => sum + qty,
    0
  );
  cartCount.textContent = totalQty;

  // Render items
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;
  let totalMrp = 0;

  Object.entries(cart).forEach(([productId, qty]) => {
    const product = products.find(
      (p) => p.id === Number(productId)
    );
    if (!product) return;

    subtotal += product.price * qty;
    totalMrp += product.mrp * qty;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    const left = document.createElement("div");
    const right = document.createElement("div");

    const title = document.createElement("div");
    title.className = "cart-item-title";
    title.textContent = product.title;

    const meta = document.createElement("div");
    meta.className = "cart-item-meta";
    meta.innerHTML = `
        <span>₹${product.price.toLocaleString()} x ${qty}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";

    const minusBtn = document.createElement("button");
    minusBtn.className = "qty-btn";
    minusBtn.textContent = "-";
    minusBtn.addEventListener("click", () =>
      changeQty(product.id, -1)
    );

    const qtySpan = document.createElement("span");
    qtySpan.textContent = qty;

    const plusBtn = document.createElement("button");
    plusBtn.className = "qty-btn";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () =>
      changeQty(product.id, 1)
    );

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () =>
      removeFromCart(product.id)
    );

    actions.appendChild(minusBtn);
    actions.appendChild(qtySpan);
    actions.appendChild(plusBtn);
    actions.appendChild(removeBtn);

    left.appendChild(title);
    left.appendChild(meta);
    left.appendChild(actions);

    const price = document.createElement("div");
    price.textContent =
      "₹" + (product.price * qty).toLocaleString();

    right.appendChild(price);

    itemEl.appendChild(left);
    itemEl.appendChild(right);

    cartItemsContainer.appendChild(itemEl);
  });

  const discount = totalMrp - subtotal;
  cartSubtotalEl.textContent = "₹" + totalMrp.toLocaleString();
  cartDiscountEl.textContent =
    "-₹" + discount.toLocaleString();
  cartTotalEl.textContent = "₹" + subtotal.toLocaleString();
}

function changeQty(productId, delta) {
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] <= 0) {
    delete cart[productId];
  }
  saveCartToStorage();
  updateCartView();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCartToStorage();
  updateCartView();
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}
