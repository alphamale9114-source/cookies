// Mock data for available food listings
const mockFoodListings = [
    {
        id: 1,
        title: 'Canteen Lunch Extras',
        type: 'Vegetarian Meals',
        quantity: 25,
        availableFrom: '12:30 PM',
        availableTo: '1:30 PM',
        source: 'canteen'
    },
    {
        id: 2,
        title: 'Tech Event Refreshments',
        type: 'Snacks and Beverages',
        quantity: 50,
        availableFrom: '4:00 PM',
        availableTo: '5:00 PM',
        source: 'event'
    }
];

// DOM Elements
const foodReportForm = document.getElementById('foodReportForm');
const foodListingsContainer = document.getElementById('foodListings');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    displayFoodListings();
    setupFormValidation();
});

// Display food listings
function displayFoodListings() {
    foodListingsContainer.innerHTML = mockFoodListings.map(food => `
        <div class="food-item" data-id="${food.id}">
            <h3>${food.title}</h3>
            <p>Type: ${food.type}</p>
            <p>Quantity: ${food.quantity} servings</p>
            <p>Available: ${food.availableFrom} - ${food.availableTo}</p>
            <button onclick="registerForFood(${food.id})">Register for This</button>
        </div>
    `).join('');
}

// Handle food registration
function registerForFood(foodId) {
    const food = mockFoodListings.find(f => f.id === foodId);
    if (food) {
        showMessage('success', `Successfully registered for ${food.title}! You will receive a confirmation email shortly.`);
    }
}

// Form validation and submission
function setupFormValidation() {
    foodReportForm.addEventListener('submit', handleFormSubmit);
    
    // Set minimum date-time for availability fields
    const now = new Date();
    const availableFrom = document.getElementById('availableFrom');
    const availableTo = document.getElementById('availableTo');
    
    availableFrom.min = now.toISOString().slice(0, 16);
    availableTo.min = now.toISOString().slice(0, 16);
    
    // Ensure 'Available To' is after 'Available From'
    availableFrom.addEventListener('change', () => {
        availableTo.min = availableFrom.value;
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        source: document.getElementById('source').value,
        foodType: document.getElementById('foodType').value,
        quantity: document.getElementById('quantity').value,
        availableFrom: document.getElementById('availableFrom').value,
        availableTo: document.getElementById('availableTo').value,
        description: document.getElementById('description').value
    };

    // Validate form data
    if (!validateFormData(formData)) {
        showMessage('error', 'Please fill all required fields correctly.');
        return;
    }

    // Mock API call
    submitFoodReport(formData);
}

// Validate form data
function validateFormData(data) {
    return data.source && 
           data.foodType && 
           data.quantity > 0 && 
           data.availableFrom && 
           data.availableTo && 
           new Date(data.availableTo) > new Date(data.availableFrom);
}

// Submit food report (mock API call)
function submitFoodReport(data) {
    // Simulate API call
    setTimeout(() => {
        showMessage('success', 'Food availability reported successfully!');
        foodReportForm.reset();
        
        // Add new listing to mock data
        const newListing = {
            id: mockFoodListings.length + 1,
            title: `${data.source.charAt(0).toUpperCase() + data.source.slice(1)} Food`,
            type: data.foodType,
            quantity: parseInt(data.quantity),
            availableFrom: new Date(data.availableFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            availableTo: new Date(data.availableTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: data.source
        };
        
        mockFoodListings.unshift(newListing);
        displayFoodListings();
    }, 1000);
}

// Show message to user
function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('foodReportForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Additional utility functions
function formatDateTime(date) {
    return new Date(date).toLocaleString();
}

// Event listeners for dynamic updates
window.addEventListener('resize', () => {
    // Handle responsive layout changes if needed
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    showMessage('error', 'Something went wrong. Please try again later.');
});