
    document.addEventListener('DOMContentLoaded', function() {
        
        let itemLinksKey = `links_${window.location.pathname}`; // Unique key for item's links

        const addLinkBtn = document.getElementById('addLinkBtn');
        const cancelLinkBtn = document.getElementById('cancelLinkBtn');
        const linkForm = document.getElementById('linkForm');
        const submitLink = document.getElementById('submitLink');
        const linksContainer = document.getElementById('linksContainer');

        // Load links from localStorage on page load
        loadLinksFromStorage();

        addLinkBtn.addEventListener('click', function() {
            linkForm.style.display = 'block';
            clearForm();
        });

        cancelLinkBtn.addEventListener('click', function() {
            linkForm.style.display = 'none';
            clearForm();
        });

        submitLink.addEventListener('click', function() {
            const linkName = document.getElementById('linkName').value;
            const linkURL = document.getElementById('linkURL').value;

            if (linkName && linkURL) {
                if (submitLink.dataset.mode === 'edit') {
                    // Editing existing link
                    editLink(submitLink.dataset.index, linkName, linkURL);
                } else {
                    // Adding new link
                    addLink(linkName, linkURL);
                }
            } else {
                alert('Please fill out both fields.');
            }
        });

        // Function to add a new link
        function addLink(linkName, linkURL) {
            const newLink = createLinkElement(linkName, linkURL);
            linksContainer.appendChild(newLink);

            // Save link to localStorage for the current item
            saveLinkToStorage(linkName, linkURL);

            // Clear form inputs and hide form
            linkForm.style.display = 'none';
            clearForm();
        }

        // Function to edit an existing link
        function editLink(index, linkName, linkURL) {
            const linkItems = document.querySelectorAll('.link-item');
            const linkItem = linkItems[index];
            linkItem.querySelector('span').textContent = linkName;
            linkItem.querySelector('a').setAttribute('href', linkURL);

            // Update link in localStorage
            updateLinkInStorage(index, linkName, linkURL);

            // Clear form inputs and hide form
            linkForm.style.display = 'none';
            clearForm();
        }

        // Function to create a new link item element with edit and delete buttons
        function createLinkElement(linkName, linkURL) {
            const newLink = document.createElement('div');
            newLink.classList.add('link-item');
            newLink.innerHTML = `
                <span>${linkName}</span> 
                <a href="${linkURL}" target="_blank">Visit</a> 
                <span class="editLinkBtn" title="Edit">&#x270E;</span> 
                <span class="deleteLinkBtn" title="Delete">&#x2716;</span>
            `;

            // Apply CSS class for black color
            newLink.querySelector('.editLinkBtn').classList.add('black-icon');
            newLink.querySelector('.deleteLinkBtn').classList.add('black-icon');

            // Add event listener for edit button
            const editBtn = newLink.querySelector('.editLinkBtn');
            editBtn.addEventListener('click', function() {
                const index = Array.from(linksContainer.children).indexOf(newLink);
                populateFormForEdit(index, linkName, linkURL);
            });

            // Add event listener for delete button
            const deleteBtn = newLink.querySelector('.deleteLinkBtn');
            deleteBtn.addEventListener('click', function() {
                deleteLink(newLink);
            });

            return newLink;
        }

        // Function to populate form fields for editing
        function populateFormForEdit(index, linkName, linkURL) {
            linkForm.style.display = 'block';
            document.getElementById('linkName').value = linkName;
            document.getElementById('linkURL').value = linkURL;
            submitLink.textContent = 'Update';
            submitLink.dataset.mode = 'edit';
            submitLink.dataset.index = index;
        }

        // Function to delete a link
        function deleteLink(linkItem) {
            linkItem.remove();

            // Update localStorage after deletion
            updateLocalStorageAfterDeletion();
        }

        // Function to update localStorage after deletion
        function updateLocalStorageAfterDeletion() {
            const linkItems = document.querySelectorAll('.link-item');
            const updatedLinks = Array.from(linkItems).map((item, index) => {
                const linkName = item.querySelector('span').textContent;
                const linkURL = item.querySelector('a').getAttribute('href');
                return { name: linkName, url: linkURL };
            });

            localStorage.setItem(itemLinksKey, JSON.stringify(updatedLinks));
        }

        // Function to clear form inputs
        function clearForm() {
            document.getElementById('linkName').value = '';
            document.getElementById('linkURL').value = '';
            delete submitLink.dataset.mode;
            delete submitLink.dataset.index;
            submitLink.textContent = 'Add Link';
        }

        // Function to load links from localStorage for the current item
        function loadLinksFromStorage() {
            const storedLinks = JSON.parse(localStorage.getItem(itemLinksKey)) || [];
            storedLinks.forEach(link => {
                const newLink = createLinkElement(link.name, link.url); 
                linksContainer.appendChild(newLink);
            });
        }

        // Function to save link to localStorage for the current item
        function saveLinkToStorage(linkName, linkURL) {
            let storedLinks = JSON.parse(localStorage.getItem(itemLinksKey)) || [];
            storedLinks.push({ name: linkName, url: linkURL }); 
            localStorage.setItem(itemLinksKey, JSON.stringify(storedLinks));
        }

        // Function to update link in localStorage for the current item
        function updateLinkInStorage(index, linkName, linkURL) {
            let storedLinks = JSON.parse(localStorage.getItem(itemLinksKey)) || [];
            storedLinks[index] = { name: linkName, url: linkURL }; 
            localStorage.setItem(itemLinksKey, JSON.stringify(storedLinks));
        }
        
    });

