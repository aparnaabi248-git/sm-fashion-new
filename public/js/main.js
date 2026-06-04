// Global Auth State and Utility Functions

const getToken = () => localStorage.getItem('token');

const getUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo'));
  } catch (error) {
    return null;
  }
};

// Update Navbar Authentication
const updateNavAuth = () => {
  const userInfo = getUserInfo();
  const authLink = document.getElementById('authLink');

  // Prevent null error
  if (!authLink) return;

  if (userInfo) {
    if (userInfo.isAdmin) {
      authLink.innerHTML = `
        <a href="/admin/dashboard.html">Admin</a>
        <a href="#" onclick="logout(event)" style="margin-left:20px;">Logout</a>
      `;
    } else {
      authLink.innerHTML = `
        <a href="/profile.html">${userInfo.name}</a>
        <a href="#" onclick="logout(event)" style="margin-left:20px;">Logout</a>
      `;
    }
  } else {
    authLink.innerHTML = `
      <a href="/login.html">Login</a>
    `;
  }
};

// Logout
const logout = (e) => {
  if (e) e.preventDefault();

  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');

  window.location.href = '/login.html';
};

// Cart Logic
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

// Update Cart Count
const updateCartCount = () => {
  const countEl = document.getElementById('cartCount');

  if (!countEl) return;

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  countEl.innerText = totalItems;
};

// Add To Cart
const addToCart = (id, name, price, image) => {
  const existItem = cart.find(item => item.product === id);

  if (existItem) {
    cart = cart.map(item =>
      item.product === id
        ? { ...item, qty: item.qty + 1 }
        : item
    );
  } else {
    cart.push({
      product: id,
      name,
      price,
      image,
      qty: 1
    });
  }

  localStorage.setItem('cartItems', JSON.stringify(cart));
  updateCartCount();

  alert(`${name} added to cart!`);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  updateCartCount();
});