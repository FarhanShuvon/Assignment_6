// Cart array to store items
let cart = [];

// Spinner management
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("plants-container").classList.add("hidden");
  } else {
    document.getElementById("plants-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// Load plant details and show modal
const loadPlantDetails = async (plantId) => {
  try {
    const response = await fetch(`https://openapi.programming-hero.com/api/plant/${plantId}`);
    const data = await response.json();
    
    if (data.status && data.plants) {
      showPlantModal(data.plants);
    } else {
      console.error('Plant not found');
    }
  } catch (error) {
    console.error('Error loading plant details:', error);
  }
};

// Show plant details in modal
const showPlantModal = (plant) => {
  const modal = document.getElementById("plant-modal");
  const modalContent = document.getElementById("modal-content");
  
  modalContent.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">${plant.name}</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-3xl">×</button>
      </div>
      
      <!-- Modal Body -->
      <div class="p-6">
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Plant Image -->
          <div class="bg-gray-100 rounded-lg overflow-hidden">
            <img src="${plant.image}" alt="${plant.name}" 
                 class="w-full h-64 object-cover"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500" style="display: none;">
              <div class="text-center">
                <div class="text-6xl mb-2">🌱</div>
                <div>Image not available</div>
              </div>
            </div>
          </div>
          
          <!-- Plant Details -->
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Category</h3>
              <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ${plant.category}
              </span>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Price</h3>
              <span class="text-3xl font-bold text-gray-800">৳${plant.price}</span>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Description</h3>
              <p class="text-gray-600 leading-relaxed">${plant.description}</p>
            </div>
          </div>
        </div>
        
        <!-- Add to Cart Button -->
        <div class="mt-6 flex justify-center">
          <button onclick="addToCart('${plant.name.replace(/'/g, "\\'")}', ${plant.price}); closeModal();" 
                  class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200">
            Add to Cart - ৳${plant.price}
          </button>
        </div>
      </div>
    </div>
  `;
  
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
};

// Close modal
const closeModal = () => {
  const modal = document.getElementById("plant-modal");
  modal.classList.add("hidden");
  document.body.style.overflow = "auto"; // Restore scrolling
};

// Display plants in grid - Updated with click handlers
const displayPlants = (plants) => {
  const plantsContainer = document.getElementById("plants-container");
  plantsContainer.innerHTML = "";

  if (plants.length == 0) {
    plantsContainer.innerHTML = `
      <div class="col-span-full text-center py-10">
        <p class="text-xl font-medium text-gray-400">
          No plants found in this category.
        </p>
      </div>
    `;
    manageSpinner(false);
    return;
  }

  plants.forEach((plant) => {
    const plantCard = document.createElement("div");
    plantCard.className = "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-shadow duration-200";
    
    const cleanName = plant.name.replace(/'/g, "\\'");
    
    plantCard.innerHTML = `
      <div class="h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
        <img src="${plant.image}" alt="${plant.name}" 
             class="w-full h-full object-cover"
             style="display: block;"
             onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'text-center text-gray-500\\'><div class=\\'text-4xl mb-2\\'>🌱</div><div class=\\'text-sm\\'>Loading image...</div></div>';">
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="text-lg font-bold text-gray-800 mb-2">${plant.name}</h3>
        <p class="text-gray-600 text-sm mb-3 leading-relaxed flex-grow line-clamp-3">${plant.description}</p>
        
        <div class="flex justify-between items-center mb-3">
          <span class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            ${plant.category}
          </span>
          <span class="text-xl font-bold text-gray-800">৳${plant.price}</span>
        </div>
        
        <button onclick="event.stopPropagation(); addToCart('${cleanName}', ${plant.price})" 
                class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-full transition-colors duration-200">
          Add to Cart
        </button>
      </div>
    `;
    
    // Add click handler to the entire card
    plantCard.onclick = () => loadPlantDetails(plant.id);
    
    plantsContainer.appendChild(plantCard);
  });
  
  manageSpinner(false);
};

// Add item to cart
const addToCart = (name, price) => {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price: parseInt(price), quantity: 1 });
  }
  
  updateCartDisplay();
  console.log(`Added to cart: ${name} - ৳${price}`);
};

// Remove item from cart
const removeFromCart = (name) => {
  cart = cart.filter(item => item.name !== name);
  updateCartDisplay();
  console.log(`Removed from cart: ${name}`);
};

// Update cart display
const updateCartDisplay = () => {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  
  cartItems.innerHTML = "";
  let total = 0;
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center text-gray-500 py-4">
        <p class="text-sm">Your cart is empty</p>
      </div>
    `;
    cartTotal.textContent = "৳0";
    return;
  }
  
  cart.forEach(item => {
    total += item.price * item.quantity;
    
    const cartItem = document.createElement("div");
    cartItem.className = "bg-green-50 rounded-lg p-3 mb-3";
    cartItem.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex-1">
          <h4 class="font-medium text-gray-800 text-sm">${item.name}</h4>
          <p class="text-gray-600 text-xs">৳${item.price} × ${item.quantity}</p>
        </div>
        <button onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')" 
                class="text-gray-400 hover:text-gray-600 ml-2 text-lg">
          ×
        </button>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });
  
  cartTotal.textContent = `৳${total}`;
};

// Load all plants by default
const loadAllPlants = () => {
  manageSpinner(true);
  
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      console.log('All plants loaded:', data.plants?.length || 0);
      displayPlants(data.plants || []);
    })
    .catch((error) => {
      console.error('Error fetching all plants:', error);
      displayPlants([]);
    });
};

// Load plants by category
const loadCategoryPlants = (categoryId, categoryName) => {
  manageSpinner(true);
  
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      const allPlants = data.plants || [];
      const filteredPlants = allPlants.filter(plant => 
        plant.category === categoryName
      );
      
      console.log(`Category "${categoryName}" plants:`, filteredPlants.length);
      displayPlants(filteredPlants);
    })
    .catch((error) => {
      console.error('Error fetching plants:', error);
      displayPlants([]);
    });
};

// Utility function - remove active class from all categories
const removeActive = () => {
  const categoryButtons = document.querySelectorAll(".category-item");
  categoryButtons.forEach((btn) => {
    btn.classList.remove("bg-green-600", "text-white");
    btn.classList.add("text-gray-700", "hover:bg-gray-100");
  });
};

// Load and display categories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((json) => displayCategories(json.categories || json.data || json))
    .catch((error) => {
      console.error('Error fetching categories:', error);
      const fallbackData = [
        { id: 1, category_name: 'Fruit Tree' },
        { id: 2, category_name: 'Flowering Tree' },
        { id: 3, category_name: 'Shade Tree' },
        { id: 4, category_name: 'Medicinal Tree' }
      ];
      displayCategories(fallbackData);
    });
};

// Handle category click
const loadCategoryTrees = (id, categoryName) => {
  removeActive();
  const clickBtn = document.getElementById(`category-btn-${id}`);
  clickBtn.classList.add("bg-green-600", "text-white");
  clickBtn.classList.remove("text-gray-700", "hover:bg-gray-100");
  
  console.log(`Selected category: ${categoryName} (ID: ${id})`);
  
  if (id === 'all' || categoryName === 'All Trees') {
    loadAllPlants();
  } else {
    loadCategoryPlants(id, categoryName);
  }
};

// Display categories in sidebar
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";

  const allTreesItem = document.createElement("li");
  allTreesItem.id = `category-btn-all`;
  allTreesItem.onclick = () => loadCategoryTrees('all', 'All Trees');
  allTreesItem.className = `category-item px-4 py-3 cursor-pointer transition-colors duration-200 bg-green-600 text-white`;
  allTreesItem.textContent = 'All Trees';
  categoryContainer.appendChild(allTreesItem);

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const categoryItem = document.createElement("li");
    categoryItem.id = `category-btn-${category.id}`;
    categoryItem.onclick = () => loadCategoryTrees(category.id, category.category_name);
    categoryItem.className = `category-item px-4 py-3 cursor-pointer transition-colors duration-200 text-gray-700 hover:bg-gray-100`;
    categoryItem.textContent = category.category_name;
    categoryContainer.appendChild(categoryItem);
  }
};

// Initialize
loadCategories();
loadAllPlants();
updateCartDisplay();

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("plant-modal");
  if (event.target === modal) {
    closeModal();
  }
};
