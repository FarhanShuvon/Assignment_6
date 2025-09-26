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
  
  // Load plants by category - Filter from all plants
  const loadCategoryPlants = (categoryId, categoryName) => {
    manageSpinner(true);
    
    // Get all plants first, then filter by category name
    fetch("https://openapi.programming-hero.com/api/plants")
      .then((res) => res.json())
      .then((data) => {
        const allPlants = data.plants || [];
        
        // Filter plants by category name
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
  
  // Display plants in grid - Fixed image loading
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
      plantCard.className = "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full";
      
      // Clean the plant name for onclick (remove special characters)
      const cleanName = plant.name.replace(/'/g, "\\'");
      
      plantCard.innerHTML = `
        <div class="h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
          <img src="${plant.image}" alt="${plant.name}" 
               class="w-full h-full object-cover"
               style="display: block;"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'text-center text-gray-500\\'><div class=\\'text-4xl mb-2\\'>🌱</div><div class=\\'text-sm\\'>Loading image...</div></div>';">
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <h3 class="text-xl font-bold text-gray-800 mb-2">${plant.name}</h3>
          <p class="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">${plant.description}</p>
          
          <div class="flex justify-between items-center mb-4">
            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ${plant.category}
            </span>
            <span class="text-2xl font-bold text-gray-800">৳${plant.price}</span>
          </div>
          
          <button onclick="addToCart('${cleanName}', ${plant.price})" 
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 mt-auto">
            Add to Cart
          </button>
        </div>
      `;
      plantsContainer.appendChild(plantCard);
    });
    
    manageSpinner(false);
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
  
    // Add "All Trees" option first
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
  
  // Cart functionality
  const addToCart = (name, price) => {
    console.log(`Added to cart: ${name} - ৳${price}`);
    alert(`Added ${name} to cart for ৳${price}`);
  };
  
  // Initialize
  loadCategories();
  loadAllPlants();
  