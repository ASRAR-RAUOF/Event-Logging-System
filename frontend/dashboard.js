const API_BASE_URL = 'http://localhost:3000/api';
let currentPage = 1;
const limit = 10;

// Function to format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

// Function to format JSON for display
function formatJSON(data) {
    return JSON.stringify(data, null, 2);
}

// Function to fetch and display events
async function fetchEvents(page = 1) {
    try {
        // Get filter values
        const eventType = document.getElementById('eventType').value;
        const sourceApp = document.getElementById('sourceApp').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Build query string
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(eventType && { eventType }),
            ...(sourceApp && { sourceApplicationId: sourceApp }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate })
        });

        // Fetch events
        const response = await fetch(`${API_BASE_URL}/events?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Display events
        displayEvents(data.events);
        // Update pagination
        updatePagination(data.totalPages, page);
        
        // Store current page
        currentPage = page;
    } catch (error) {
        console.error('Error fetching events:', error);
        alert('Error fetching events. Please check the console for details.');
    }
}

// Function to display events in table
function displayEvents(events) {
    const tbody = document.getElementById('eventsTable');
    tbody.innerHTML = ''; // Clear existing content

    events.forEach(event => {
        const row = tbody.insertRow();
        
        // Add cells with data
        row.insertCell(0).textContent = formatDate(event.timestamp);
        row.insertCell(1).textContent = event.eventType;
        row.insertCell(2).textContent = event.sourceApplicationId;
        
        // Format payload cell
        const payloadCell = row.insertCell(3);
        payloadCell.textContent = JSON.stringify(event.dataPayload);
        payloadCell.style.maxWidth = '200px';
        payloadCell.style.overflow = 'hidden';
        payloadCell.style.textOverflow = 'ellipsis';
        payloadCell.style.whiteSpace = 'nowrap';
        
        // Add hash with truncation
        const hashCell = row.insertCell(4);
        hashCell.textContent = `${event.hash.substring(0, 8)}...`;
        hashCell.title = event.hash; // Show full hash on hover
    });
}

// Function to update pagination controls
function updatePagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => fetchEvents(currentPage - 1);
        pagination.appendChild(prevButton);
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => fetchEvents(i);
        if (i === currentPage) {
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
        }
        pagination.appendChild(button);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => fetchEvents(currentPage + 1);
        pagination.appendChild(nextButton);
    }
}

// Function to verify chain integrity
async function verifyChain() {
    try {
        const response = await fetch(`${API_BASE_URL}/events/verify`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const resultSpan = document.getElementById('verifyResult');
        resultSpan.textContent = data.isValid ? 
            '✅ Chain integrity verified' : 
            '❌ Chain integrity compromised';
        resultSpan.style.color = data.isValid ? 'green' : 'red';
    } catch (error) {
        console.error('Error verifying chain:', error);
        alert('Error verifying chain integrity. Please check the console for details.');
    }
}

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    // Initial load of events
    fetchEvents(1);

    // Add event listeners for filter changes
    const filterElements = ['eventType', 'sourceApp', 'startDate', 'endDate'];
    filterElements.forEach(id => {
        document.getElementById(id).addEventListener('change', () => fetchEvents(1));
    });
});

