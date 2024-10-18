// Select form elements
const orderForm = document.getElementById('orderForm');
const confirmation = document.getElementById('confirmation');
const ordersList = document.getElementById('ordersList');

// Function to fetch products
async function fetchProducts() {
    const response = await fetch('https://localhost:3000/products');
    return response.json();
}

// Function to fetch orders
async function fetchOrders() {
    const response = await fetch('http://localhost:3000/orders');
    return response.json();
}

// Function to submit the order (Create)
async function submitOrder(orderData) {
    const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    return response.json();
}

// Function to update an order (Update)
async function updateOrder(orderId, updatedData) {
    const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });
    return response.json();
}

// Function to delete an order (Delete)
async function deleteOrder(orderId) {
    await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: 'DELETE',
    });
}

// Function to display orders
function displayOrders(orders) {
    ordersList.innerHTML = ''; // Clear previous orders
    orders.forEach(order => {
        const li = document.createElement('li');
        li.textContent = `${order.customerName} ordered ${order.product} - Status: ${order.status}`;

        // Update button
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => {
            const updatedStatus = prompt('Enter new status:', order.status);
            if (updatedStatus) {
                updateOrder(order.id, { ...order, status: updatedStatus })
                    .then(() => fetchOrders().then(displayOrders));
            }
        };

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            deleteOrder(order.id).then(() => fetchOrders().then(displayOrders));
        };

        li.appendChild(updateButton);
        li.appendChild(deleteButton);
        ordersList.appendChild(li);
    });
}

// Handle form submission
orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const orderData = {
        customerName: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        product: document.getElementById('product').value,
        quantity: 1, // You could add a quantity field in the form if needed
        status: 'Pending',
    };

    // Submit order to the server
    const result = await submitOrder(orderData);

    // Show confirmation
    confirmation.style.display = 'block';
    confirmation.innerHTML = `
        <h4>Thank you for your order, ${result.customerName}!</h4>
        <p>Your order for ${result.product} will be delivered shortly.</p>
    `;

    // Reset the form
    orderForm.reset();

    // Refresh the orders list
    fetchOrders().then(displayOrders);
});

// Initial fetch of orders
fetchOrders().then(displayOrders);
