// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartItemsContainer = document.getElementById('cart-items');
const emptyCartDiv = document.getElementById('empty-cart');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const cartCount = document.querySelector('.cart-count');

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCartItems();
    calculateTotals();
});

// Display cart items
function displayCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'none';
        emptyCartDiv.style.display = 'block';
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    document.querySelector('.cart-summary').style.display = 'block';
    emptyCartDiv.style.display = 'none';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItem);
    });
}

// Create cart item element
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);
    
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-info">
            <h4>${item.title}</h4>
            <div class="cart-item-category">${item.category}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    
    return cartItem;
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    calculateTotals();
    updateCartCount();
    showUpdateNotification('Quantity updated');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    calculateTotals();
    updateCartCount();
    showUpdateNotification('Item removed from cart');
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 5.99 : 0;
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Update cart count in navbar
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Simulate checkout process
    const total = document.getElementById('total').textContent;
    const confirmed = confirm(`Proceed with checkout?\nTotal: ${total}`);
    
    if (confirmed) {
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        alert('Order placed successfully! Thank you for shopping with us.');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

// Show update notification
function showUpdateNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #17a2b8;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Clear entire cart
function clearCart() {
    const confirmed = confirm('Are you sure you want to clear your cart?');
    if (confirmed) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        calculateTotals();
        updateCartCount();
        showUpdateNotification('Cart cleared');
    }
}