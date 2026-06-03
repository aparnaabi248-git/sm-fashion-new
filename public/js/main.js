// Global Auth State and Utility functions

const getToken = () => localStorage.getItem('token');
const getUserInfo = () => JSON.parse(localStorage.getItem('userInfo'));

const updateNavAuth = () => {
  const userInfo = getUserInfo();
  const authLink = document.getElementById('authLink');
  
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
  }
};

const logout = (e) => {
  if(e) e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  window.location.href = '/login.html';
};

// Cart Logic
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

const updateCartCount = () => {
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    countEl.innerText = totalItems;
  }
};

const addToCart = (id, name, price, image) => {
  const existItem = cart.find(x => x.product === id);
  if (existItem) {
    cart = cart.map(x => x.product === existItem.product ? { ...x, qty: x.qty + 1 } : x);
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

document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  updateCartCount();
});
