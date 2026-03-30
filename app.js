document.addEventListener('DOMContentLoaded', () => {
  const itemsContainer = document.getElementById('items-container');
  const sortOptions = document.getElementById('sort-options');
  const editFormContainer = document.getElementById('edit-form-container');
  const editForm = document.getElementById('editForm');
  const editName = document.getElementById('editName');
  const editBrand = document.getElementById('editBrand');
  const editPrice = document.getElementById('editPrice');
  const editWeight = document.getElementById('editWeight');
  const editQuantity = document.getElementById('editQuantity');
  const editStore = document.getElementById('editStore');
  const editCategory = document.getElementById('editCategory');
  const editImage = document.getElementById('editImage');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutMessage = document.getElementById('checkout-message');
  const addProductBtn = document.getElementById('addProductBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const closeModalIcon = document.getElementById('closeModalIcon');
  const modalTitle = document.getElementById('modalTitle');

  // Serverless Data Persistence
  const defaultItems = [
    { name: 'Apples', brand: 'FreshFarm', price: 1.99, weight: '1kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Produce', image: 'image/apple.png' },
    { name: 'Milk', brand: 'Organic Valley', price: 3.99, weight: '1L', quantity: '1 bottle', store: 'Ambatogrocery', category: 'Dairy', image: 'image/milk.png' },
    { name: 'Bananas', brand: 'FreshLand', price: 2.49, weight: '1kg', quantity: '3 bunches', store: 'Ambatogrocery', category: 'Produce', image: 'image/banana.png' },
    { name: 'Eggs', brand: 'HappyHens', price: 4.29, weight: '12 pcs', quantity: '1 dozen', store: 'Ambatogrocery', category: 'Dairy', image: 'image/egg.png' },
    { name: 'Orange', brand: 'FreshFarm', price: 1.79, weight: '1kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Produce', image: 'image/orange.png' },
    { name: 'Chocolate', brand: 'FreshFarm', price: 12.79, weight: '2kg', quantity: '1 units', store: 'Ambatogrocery', category: 'Dairy', image: 'image/choco.png' },
  ];

  let items = JSON.parse(localStorage.getItem('inventory')) || defaultItems;
  let cart = [];
  let editingIndex = null;

  const saveInventory = () => localStorage.setItem('inventory', JSON.stringify(items));

  function displayItems(filteredItems = items) {
    itemsContainer.innerHTML = '';
    filteredItems.forEach((item) => {
      const mainIndex = items.indexOf(item);
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.innerHTML = `
        <img src="${item.image || 'image/banana.png'}" alt="${item.name}" class="product-image">
        <div class="product-item">
          <p><strong>${item.name}</strong></p>
          <p style="color:var(--accent); font-weight:700; font-size:16px; margin: 4px 0">₱${item.price.toFixed(2)}</p>
          <div style="display:flex; gap:10px; opacity:0.6; font-size:11px">
            <span>${item.weight}</span>
            <span>|</span>
            <span>${item.category}</span>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:5px; align-items: flex-end;">
           <button class="remove-btn" data-index="${mainIndex}">
             <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
           </button>
           <button class="edit-btn" data-index="${mainIndex}">Edit</button>
           <button class="add-to-cart-btn" data-index="${mainIndex}">Add</button>
        </div>
      `;
      itemsContainer.appendChild(itemDiv);
    });
  }

  function sortItems(criteria) {
    let sortedItems = [...items];
    switch (criteria) {
      case 'name':
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      case 'category':
        sortedItems.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }
    displayItems(sortedItems);
  }

  function openEditForm(index = null) {
    editingIndex = index;
    if (index !== null) {
      modalTitle.innerText = 'Edit Product';
      const item = items[index];
      editName.value = item.name;
      editBrand.value = item.brand;
      editPrice.value = item.price;
      editWeight.value = item.weight || '';
      editQuantity.value = item.quantity || '';
      editStore.value = item.store || '';
      editCategory.value = item.category || '';
    } else {
      modalTitle.innerText = 'Add New Product';
      editForm.reset();
    }
    editFormContainer.classList.remove('hidden');
  }

  function closeEditForm() {
    editFormContainer.classList.add('hidden');
    editForm.reset();
    editingIndex = null;
  }

  function saveEdit(e) {
    e.preventDefault();
    const newItemData = {
      name: editName.value,
      brand: editBrand.value,
      price: parseFloat(editPrice.value) || 0,
      weight: editWeight.value,
      quantity: editQuantity.value,
      store: editStore.value,
      category: editCategory.value,
    };
    const file = editImage.files[0];
    const processSave = (imageUrl = null) => {
      if (imageUrl) newItemData.image = imageUrl;
      if (editingIndex !== null) {
        items[editingIndex] = { ...items[editingIndex], ...newItemData };
      } else {
        newItemData.image = imageUrl || 'image/banana.png';
        items.push(newItemData);
      }
      saveInventory();
      displayItems(); 
      closeEditForm();
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => processSave(event.target.result);
      reader.readAsDataURL(file);
    } else {
      processSave(editingIndex !== null ? items[editingIndex].image : null);
    }
  }

  function addToCart(index) {
    const item = items[index];
    const existingCartItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingCartItem) {
      existingCartItem.count = (existingCartItem.count || 1) + 1;
    } else {
      cart.push({ ...item, count: 1 });
    }
    updateCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
  }

  function removeItem(index) {
    if (confirm('Are you sure you want to delete this product?')) {
      items.splice(index, 1);
      saveInventory();
      displayItems();
    }
  }

  function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((cartItem, index) => {
      const itemDiv = document.createElement('li');
      itemDiv.innerHTML = `
        <div style="flex:1">
          <p style="margin:0; font-size:14px; color:var(--primary)"><strong>${cartItem.name}</strong></p>
          <p style="margin:0; font-size:12px; color:var(--text-muted)">Qty: ${cartItem.count} • ₱${cartItem.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn" data-index="${index}">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      `;
      cartItems.appendChild(itemDiv);
      total += cartItem.price * cartItem.count;
    });
    cartTotal.textContent = total.toFixed(2);
  }

  function searchItems() {
    const query = searchInput.value.toLowerCase();
    const filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.store.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    displayItems(filteredItems);
  }

  function handleCheckout() {
    if (cart.length === 0) return alert('Your cart is empty!');
    cart = [];
    updateCart();
    checkoutMessage.classList.remove('hidden');
    setTimeout(() => checkoutMessage.classList.add('hidden'), 3000);
  }

  // Event Listeners
  addProductBtn.addEventListener('click', () => openEditForm());
  editForm.addEventListener('submit', saveEdit);
  cancelEditBtn.addEventListener('click', closeEditForm);
  closeModalIcon.addEventListener('click', closeEditForm);
  searchBtn.addEventListener('click', searchItems);
  searchInput.addEventListener('keyup', searchItems);
  checkoutBtn.addEventListener('click', handleCheckout);

  itemsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const index = btn.getAttribute('data-index');
    if (btn.classList.contains('edit-btn')) {
      openEditForm(index);
    } else if (btn.classList.contains('add-to-cart-btn')) {
      addToCart(index);
    } else if (btn.classList.contains('remove-btn')) {
      removeItem(index);
    }
  });

  cartItems.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || !btn.classList.contains('remove-from-cart-btn')) return;
    removeFromCart(btn.getAttribute('data-index'));
  });

  sortOptions.addEventListener('change', (e) => sortItems(e.target.value));

  displayItems(); 
});
