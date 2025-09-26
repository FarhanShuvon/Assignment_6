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
    fetch("https://openapi.programming-hero.com/api/categories") // promise of response
      .then((res) => res.json()) // promise of json data
      .then((json) => displayCategories(json.data || json.categories || json))
      .catch((error) => {
        console.error('Error fetching categories:', error);
        // Fallback data if API fails
        const fallbackData = [
          { id: 1, name: 'All Trees' },
          { id: 2, name: 'Fruit Trees' },
          { id: 3, name: 'Flowering Trees' },
          { id: 4, name: 'Shade Trees' },
          { id: 5, name: 'Medicinal Trees' },
          { id: 6, name: 'Timber Trees' },
          { id: 7, name: 'Evergreen Trees' },
          { id: 8, name: 'Ornamental Plants' },
          { id: 9, name: 'Bamboo' },
          { id: 10, name: 'Climbers' },
          { id: 11, name: 'Aquatic Plants' }
        ];
        displayCategories(fallbackData);
      });
  };
  
  // Handle category click
  const loadCategoryTrees = (id, categoryName) => {
    removeActive(); // remove all active class
    const clickBtn = document.getElementById(`category-btn-${id}`);
    clickBtn.classList.add("bg-green-600", "text-white"); // add active class
    clickBtn.classList.remove("text-gray-700", "hover:bg-gray-100"); // remove hover effects
    
    console.log(`Selected category: ${categoryName} (ID: ${id})`);
    // Here you would load trees for this category
    // loadTreesByCategory(id);
  };
  
  // Display categories in sidebar
  const displayCategories = (categories) => {
    // 1. get the container & empty
    const categoryContainer = document.getElementById("category-container");
    categoryContainer.innerHTML = "";
  
    // 2. get into every category
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      // 3. create Element
      const categoryItem = document.createElement("li");
      categoryItem.id = `category-btn-${category.id || i + 1}`;
      categoryItem.onclick = () => loadCategoryTrees(category.id || i + 1, category.name || category.category_name);
      categoryItem.className = `category-item px-4 py-3 cursor-pointer transition-colors duration-200 ${
        i === 0 ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`;
      categoryItem.textContent = category.name || category.category_name || 'Category';
  
      // 4. append into container
      categoryContainer.appendChild(categoryItem);
    }
  };
  
  // Initialize - load categories when page loads
  loadCategories();
  