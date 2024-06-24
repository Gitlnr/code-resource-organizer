// script.js

document.addEventListener('DOMContentLoaded', function() {
    const titleContent = document.getElementById('titleContent');

    // Toggle items display on title click
    document.querySelectorAll('.title').forEach(function(titleElement) {
        titleElement.addEventListener('click', function() {
            const title = this.dataset.title;
            const itemList = document.getElementById(`${title.replace(' ', '_')}_items`);
            if (itemList.style.display === 'none') {
                itemList.style.display = 'block';
            } else {
                itemList.style.display = 'none';
            }
        });
    });

    // Show sign modal on click
    document.getElementById('signinBtn').addEventListener('click', function() {
        document.getElementById('signModal').style.display = 'block';
    });

    // Show add item modal on click
    document.querySelectorAll('.add-item-btn').forEach(function(addItemLink) {
        addItemLink.addEventListener('click', function(event) {
            event.preventDefault();
            const title = this.dataset.title;
            document.getElementById('itemTitle').value = title;
            document.getElementById('addItemModal').style.display = 'block';
        });
    });

    // Handle form submission for adding items
    document.getElementById('addItemForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('itemTitle').value;
        const newItem = document.getElementById('newItem').value;
        
        fetch('/add_item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `itemTitle=${encodeURIComponent(title)}&newItem=${encodeURIComponent(newItem)}`
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => {
            console.error('Error adding item:', error);
        });

        // After adding the item dynamically, add the link to navigate to a new page
        const newItemLink = document.createElement('a');
        newItemLink.href = `/item/${encodeURIComponent(title)}/${encodeURIComponent(newItem)}`;
        newItemLink.textContent = newItem;
        const newItemBox = document.createElement('div');
        newItemBox.classList.add('item-box');
        newItemBox.appendChild(newItemLink);
        // Add other elements like edit and delete icons as needed
        const itemList = document.getElementById(`${title.replace(' ', '_')}_items`);
        itemList.appendChild(newItemBox);
    });

    // Handle click on edit item icon (✎)
    document.querySelectorAll('.edit-item').forEach(function(editItemIcon) {
        editItemIcon.addEventListener('click', function() {
            const title = this.dataset.title;
            const item = this.dataset.item;
            document.getElementById('editItemTitle').value = title;
            document.getElementById('oldItem').value = item;
            document.getElementById('newItem').value = item;
            document.getElementById('editItemModal').style.display = 'block';
        });
    });

    // Handle click on delete item icon (×)
    document.querySelectorAll('.delete-item').forEach(function(deleteItemIcon) {
        deleteItemIcon.addEventListener('click', function() {
            const title = this.dataset.title;
            const item = this.dataset.item;
            if (confirm(`Are you sure you want to delete the item "${item}" under the title "${title}"?`)) {
                fetch('/delete_item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `title=${encodeURIComponent(title)}&item=${encodeURIComponent(item)}`
                })
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                });
            }
        });
    });

    // Handle click on title link to display items
    document.querySelectorAll('.title-link').forEach(function(titleLink) {
        titleLink.addEventListener('click', function(event) {
            event.preventDefault();
            const title = this.dataset.title;

            fetch(`/get_items/${encodeURIComponent(title)}`)
                .then(response => response.json())
                .then(data => {
                    titleContent.innerHTML = `
                        <section class="title-section">
                            <h2>${title}</h2>
                            <button class="add-item-btn" data-title="${title}">+ Add Item</button>
                            <div class="items">
                                ${data.items.map(item => `
                                    <div class="item-box">
                                        <p>${item}</p>
                                        <span class="edit-item" data-title="${title}" data-item="${item}">✎</span>
                                        <span class="delete-item" data-title="${title}" data-item="${item}">×</span>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    `;

                    // Add item functionality within the dynamically created content
                    document.querySelector('.add-item-btn').addEventListener('click', function() {
                        const title = this.dataset.title;
                        document.getElementById('itemTitle').value = title;
                        document.getElementById('addItemModal').style.display = 'block';
                    });

                    // Edit item functionality
                    document.querySelectorAll('.edit-item').forEach(function(editItemIcon) {
                        editItemIcon.addEventListener('click', function() {
                            const title = this.dataset.title;
                            const item = this.dataset.item;
                            document.getElementById('editItemTitle').value = title;
                            document.getElementById('oldItem').value = item;
                            document.getElementById('newItem').value = item;
                            document.getElementById('editItemModal').style.display = 'block';
                        });
                    });

                    // Delete item functionality
                    document.querySelectorAll('.delete-item').forEach(function(deleteItemIcon) {
                        deleteItemIcon.addEventListener('click', function() {
                            const title = this.dataset.title;
                            const itemToDelete = this.dataset.item;
                            if (confirm(`Are you sure you want to delete "${itemToDelete}"?`)) {
                                fetch('/delete_item', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    body: `title=${encodeURIComponent(title)}&item=${encodeURIComponent(itemToDelete)}`
                                })
                                .then(response => {
                                    if (response.redirected) {
                                        window.location.href = response.url;
                                    }
                                });
                            }
                        });
                    });
                });
        });
    });

    // Handle click on edit icon (✎)
    document.querySelectorAll('.edit').forEach(function(editIcon) {
        editIcon.addEventListener('click', function() {
            const title = this.dataset.title;
            document.getElementById('oldTitle').value = title;
            document.getElementById('newTitle').value = title;
            document.getElementById('editTitleModal').style.display = 'block';
        });
    });

    // Handle click on delete icon (×)
    document.querySelectorAll('.delete').forEach(function(deleteIcon) {
        deleteIcon.addEventListener('click', function() {
            const titleToDelete = this.dataset.title;
            if (confirm(`Are you sure you want to delete "${titleToDelete}"?`)) {
                fetch('/delete_title', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `titleToDelete=${encodeURIComponent(titleToDelete)}`
                })
                .then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                });
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Function to display the default link
        function displayDefaultLink() {
            const defaultLinkContainer = document.createElement('div');
            defaultLinkContainer.innerHTML = `
                <div class="default-link">
                    <a href="https://www.w3schools.com/" target="_blank">Default Link</a>
                </div>
            `;
            linksContainer.appendChild(defaultLinkContainer);
        }
    
        // Get all item boxes
        const itemBoxes = document.querySelectorAll('.item-box');
    
        // Loop through each item box and add click event listener
        itemBoxes.forEach(function(itemBox) {
            itemBox.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
    
                // Check if the clicked item is "Array" under "Data Structure"
                const title = itemBox.parentElement.parentElement.querySelector('.title').textContent.trim();
                const item = itemBox.querySelector('a').textContent.trim();
    
                if (title === "Data Structure" && item === "Array") {
                    // Display the default link
                    displayDefaultLink();
                }
            });
        });
    });
    
// Show add title modal on click
document.getElementById('addTitle').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('addTitleModal').style.display = 'block';
});
});
