// Price Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin/index.html';
        return;
    }

    // DOM Elements
    const priceItemsContainer = document.getElementById('priceItemsContainer');
    const saveAllBtn = document.getElementById('savePricesBtn');
    
    // Sample data - In a real app, this would come from an API
    const riceVariants = [
        { 
            id: 'basmati', 
            name: 'Basmati Rice', 
            category: 'Premium Rice', 
            variant: '1kg',
            price: 120, 
            image: 'https://via.placeholder.com/80?text=Basmati-1kg',
            unit: 'packet',
            stock: 50
        },
        { 
            id: 'basmati-5kg', 
            name: 'Basmati Rice', 
            category: 'Premium Rice', 
            variant: '5kg',
            price: 550, 
            image: 'https://via.placeholder.com/80?text=Basmati-5kg',
            unit: 'packet',
            stock: 30
        },
        { 
            id: 'jeerakasala', 
            name: 'Jeerakasala Rice', 
            category: 'Premium Rice',
            variant: '1kg',
            price: 150, 
            image: 'https://via.placeholder.com/80?text=Jeerakasala-1kg',
            unit: 'packet',
            stock: 40
        },
        { 
            id: 'jeerakasala-5kg', 
            name: 'Jeerakasala Rice', 
            category: 'Premium Rice',
            variant: '5kg',
            price: 700, 
            image: 'https://via.placeholder.com/80?text=Jeerakasala-5kg',
            unit: 'packet',
            stock: 25
        },
        { 
            id: 'kaima', 
            name: 'Kaima Rice', 
            category: 'Regular Rice', 
            variant: '1kg',
            price: 80, 
            image: 'https://via.placeholder.com/80?text=Kaima-1kg',
            unit: 'packet',
            stock: 60
        },
        { 
            id: 'kaima-5kg', 
            name: 'Kaima Rice', 
            category: 'Regular Rice', 
            variant: '5kg',
            price: 350, 
            image: 'https://via.placeholder.com/80?text=Kaima-5kg',
            unit: 'packet',
            stock: 35
        },
        { 
            id: 'matta', 
            name: 'Matta Rice', 
            category: 'Kerala Rice',
            variant: '1kg',
            price: 70, 
            image: 'https://via.placeholder.com/80?text=Matta-1kg',
            unit: 'packet',
            stock: 45
        },
        { 
            id: 'matta-5kg', 
            name: 'Matta Rice', 
            category: 'Kerala Rice',
            variant: '5kg',
            price: 320, 
            image: 'https://via.placeholder.com/80?text=Matta-5kg',
            unit: 'packet',
            stock: 28
        },
        { 
            id: 'red-matta', 
            name: 'Red Matta Rice', 
            category: 'Kerala Rice',
            variant: '1kg',
            price: 85, 
            image: 'https://via.placeholder.com/80?text=RedMatta-1kg',
            unit: 'packet',
            stock: 30
        },
        { 
            id: 'red-matta-5kg', 
            name: 'Red Matta Rice', 
            category: 'Kerala Rice',
            variant: '5kg',
            price: 400, 
            image: 'https://via.placeholder.com/80?text=RedMatta-5kg',
            unit: 'packet',
            stock: 22
        }
    ];

    // Initialize the page
    function init() {
        displayRiceVariants();
        setupEventListeners();
    }

    // Group variants by category
    function groupByCategory(variants) {
        return variants.reduce((groups, variant) => {
            const category = variant.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(variant);
            return groups;
        }, {});
    }

    // Sort variants by name and then by variant
    function sortVariants(variants) {
        return variants.sort((a, b) => {
            if (a.name === b.name) {
                // If same name, sort by variant (1kg before 5kg)
                return a.variant.localeCompare(b.variant);
            }
            return a.name.localeCompare(b.name);
        });
    }

    // Create a category header
    function createCategoryHeader(category) {
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <h2>${category}</h2>
            <div class="category-actions">
                <button class="expand-category"><i class="fas fa-chevron-down"></i></button>
            </div>
        `;
        return header;
    }

    // Create a product card
    function createProductCard(variant) {
        const itemElement = document.createElement('div');
        itemElement.className = 'price-item';
        itemElement.dataset.id = variant.id;
        
        itemElement.innerHTML = `
            <div class="product-image">
                <img src="${variant.image}" alt="${variant.name} ${variant.variant}">
                <span class="variant-badge">${variant.variant}</span>
            </div>
            <div class="item-details">
                <h3 class="item-name">${variant.name} <span class="variant">${variant.variant}</span></h3>
                <div class="item-meta">
                    <span class="stock"><i class="fas fa-box"></i> Stock: ${variant.stock}</span>
                    <span class="unit"><i class="fas fa-weight-hanging"></i> ${variant.unit}</span>
                </div>
                <div class="price-input">
                    <div class="price-field">
                        <label>Price:</label>
                        <div class="input-group">
                            <span class="input-group-text">₹</span>
                            <input type="number" value="${variant.price}" min="0" step="1">
                            <span class="input-group-text">/ ${variant.unit}</span>
                        </div>
                    </div>
                    <button class="save-btn" data-id="${variant.id}">
                        <i class="fas fa-save"></i> Update
                    </button>
                </div>
            </div>
        `;
        
        return itemElement;
    }

    // Display rice variants in the UI, grouped by category
    function displayRiceVariants() {
        if (!priceItemsContainer) return;
        
        // Check if we have data in localStorage, otherwise use sample data
        const savedVariants = localStorage.getItem('riceVariants');
        const variants = savedVariants ? JSON.parse(savedVariants) : riceVariants;
        
        if (variants.length === 0) {
            priceItemsContainer.innerHTML = '<div class="no-items">No rice variants found.</div>';
            return;
        }
        
        priceItemsContainer.innerHTML = '';
        
        // Group variants by category
        const variantsByCategory = groupByCategory(variants);
        
        // For each category
        Object.entries(variantsByCategory).forEach(([category, categoryVariants]) => {
            // Create category section
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            // Add category header
            const categoryHeader = createCategoryHeader(category);
            categorySection.appendChild(categoryHeader);
            
            // Create products container
            const productsContainer = document.createElement('div');
            productsContainer.className = 'products-grid';
            
            // Sort variants and add to container
            sortVariants(categoryVariants).forEach(variant => {
                productsContainer.appendChild(createProductCard(variant));
            });
            
            // Add products to category section
            categorySection.appendChild(productsContainer);
            
            // Add category section to main container
            priceItemsContainer.appendChild(categorySection);
            
            // Add click handler for category header to toggle expansion
            categoryHeader.addEventListener('click', (e) => {
                if (!e.target.closest('.category-actions') && !e.target.closest('.expand-category')) {
                    return;
                }
                const section = e.target.closest('.category-section');
                section.classList.toggle('collapsed');
                const icon = section.querySelector('.expand-category i');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            });
        });
    }

    // Save a single price update
    function savePrice(variantId, newPrice) {
        // In a real app, this would be an API call
        const variants = JSON.parse(localStorage.getItem('riceVariants') || JSON.stringify(riceVariants));
        const variantIndex = variants.findIndex(v => v.id === variantId);
        
        if (variantIndex !== -1) {
            variants[variantIndex].price = parseFloat(newPrice);
            localStorage.setItem('riceVariants', JSON.stringify(variants));
            showNotification('Price updated successfully!', 'success');
            return true;
        }
        
        showNotification('Failed to update price. Please try again.', 'error');
        return false;
    }

    // Save all prices
    function saveAllPrices() {
        const priceInputs = document.querySelectorAll('.price-input input');
        let allSaved = true;
        
        priceInputs.forEach(input => {
            const item = input.closest('.price-item');
            const variantId = item.dataset.id;
            const newPrice = input.value;
            
            if (!savePrice(variantId, newPrice)) {
                allSaved = false;
            }
        });
        
        if (allSaved) {
            showNotification('All prices saved successfully!', 'success');
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // In a real app, you might want to use a proper notification library
        alert(`${type.toUpperCase()}: ${message}`);
    }

    // Set up event listeners
    function setupEventListeners() {
        // Save button click
        priceItemsContainer.addEventListener('click', function(e) {
            const saveBtn = e.target.closest('.save-btn');
            if (!saveBtn) return;
            
            e.preventDefault();
            
            const item = saveBtn.closest('.price-item');
            const variantId = item.dataset.id;
            const priceInput = item.querySelector('input');
            const newPrice = priceInput.value;
            
            savePrice(variantId, newPrice);
        });
        
        // Save all button click
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to save all changes?')) {
                    saveAllPrices();
                }
            });
        }
    }

    // Initialize the page
    init();
});
