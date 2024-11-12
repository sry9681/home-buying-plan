(function() {
    // Cache DOM elements
    const elements = {
        addPersonModal: document.getElementById('addPersonModal'),
        editPersonsModal: document.getElementById('editPersonsModal'),
        personName: document.getElementById('personName'),
        contributionAmount: document.getElementById('contributionAmount'),
        savePersonConfirm: document.getElementById('savePersonConfirm'),
        savePersonCancel: document.getElementById('savePersonCancel'),
        addPersonButton: document.getElementById('addPersonButton'),
        editPersonsClose: document.getElementById('editPersonsClose'),
        personsList: document.getElementById('personsList'),
        activeContributors: document.getElementById('activeContributors'),
        manageContributorsButton: document.getElementById('manageContributorsButton'),
        savingsChart: document.getElementById('savingsChart'),
        selectedPerson: document.getElementById('selectedPerson')
    };

    let savingsChartInstance = null;

    function showToast(message, isSuccess = true) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast ' + (isSuccess ? 'success' : 'error') + ' show';
        setTimeout(() => toast.className = toast.className.replace('show', ''), 3000);
    }

    function updatePersonsList() {
        fetch('/api/persons/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(persons => {
                // Update the dropdown
                elements.selectedPerson.innerHTML = '<option value="">Select a person</option>';
                persons.forEach(person => {
                    const option = new Option(
                        `${person.name} ($${person.contribution_amount})`, 
                        person.id
                    );
                    option.dataset.amount = person.contribution_amount;
                    elements.selectedPerson.add(option);
                });

                // Update the edit modal list
                elements.personsList.innerHTML = '';
                persons.forEach(person => {
                    const item = document.createElement('div');
                    item.className = 'person-item';
                    item.innerHTML = `
                        <div class="person-info">${person.name} - $${person.contribution_amount}</div>
                        <div class="person-actions">
                            <button class="mdl-button mdl-js-button mdl-button--icon edit-person-button" 
                                    data-person-id="${person.id}">
                                <i class="material-icons">edit</i>
                            </button>
                            <button class="mdl-button mdl-js-button mdl-button--icon delete-person-button" 
                                    data-person-id="${person.id}">
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    `;
                    elements.personsList.appendChild(item);

                    // Add click handlers directly to the buttons
                    const editButton = item.querySelector('.edit-person-button');
                    const deleteButton = item.querySelector('.delete-person-button');

                    if (editButton) {
                        editButton.addEventListener('click', () => {
                            editPerson(person.id, person.name, person.contribution_amount, item);
                        });
                    }

                    if (deleteButton) {
                        deleteButton.addEventListener('click', () => {
                            deletePerson(person.id, item);
                        });
                    }
                });
            })
            .catch(error => {
                console.error('Error loading persons:', error);
                showToast('Error loading contributors', false);
            });
    }

    // Also add event delegation for the personsList
    elements.personsList?.addEventListener('click', (e) => {
        const editButton = e.target.closest('.edit-person-button');
        const deleteButton = e.target.closest('.delete-person-button');

        if (editButton) {
            const personId = editButton.dataset.personId;
            const item = editButton.closest('.person-item');
            const personName = item.querySelector('.person-info').textContent.split(' - ')[0];
            const personAmount = parseInt(item.querySelector('.person-info').textContent.split('$')[1]);
            editPerson(personId, personName, personAmount, item);
        }

        if (deleteButton) {
            const personId = deleteButton.dataset.personId;
            const item = deleteButton.closest('.person-item');
            deletePerson(personId, item);
        }
    });

    function updateActiveContributors(persons) {
        elements.activeContributors.innerHTML = '';
        /* persons.forEach(person => {
            const item = document.createElement('div');
            item.className = 'active-contributor';
            item.innerHTML = `
                <span class="contributor-name">${person.name}</span>
                <span class="contributor-amount">$${person.contribution_amount}</span>
            `;
            elements.activeContributors.replaceChildren(item);
        }); */
        updateSavingsChart(persons);
    }

    function updateSavingsChart(persons) {
        const totalMonthlyContribution = persons.reduce((sum, person) => 
            sum + person.contribution_amount, 0);

        const monthlyData = Array(12).fill(totalMonthlyContribution)
            .map((amount, index) => amount * (index + 1));

        if (savingsChartInstance) {
            savingsChartInstance.destroy();
        }

        savingsChartInstance = new Chart(elements.savingsChart, {
            type: 'line',
            data: {
                labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
                datasets: [{
                    label: 'Total Savings',
                    data: monthlyData,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        }
                    }
                }
            }
        });
    }

    function editPerson(personId, currentName, currentAmount, listItem) {
        // Create edit form
        const editForm = document.createElement('div');
        editForm.className = 'edit-person-form';
        editForm.innerHTML = `
            <input type="text" class="edit-name" value="${currentName}" placeholder="Name">
            <input type="number" class="edit-amount" value="${currentAmount}" placeholder="Amount">
            <div class="edit-buttons">
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored save-edit">Save</button>
                <button class="mdl-button mdl-js-button mdl-button--raised cancel-edit">Cancel</button>
            </div>
        `;

        // Store original content
        const originalContent = listItem.innerHTML;

        // Replace content with edit form
        listItem.innerHTML = '';
        listItem.appendChild(editForm);

        // Add event listeners for save and cancel
        const saveButton = editForm.querySelector('.save-edit');
        const cancelButton = editForm.querySelector('.cancel-edit');
        const nameInput = editForm.querySelector('.edit-name');
        const amountInput = editForm.querySelector('.edit-amount');

        saveButton.addEventListener('click', () => {
            const newName = nameInput.value.trim();
            const newAmount = amountInput.value;

            if (!newName || !newAmount) {
                showToast('Please fill in all fields', false);
                return;
            }

            fetch('/api/persons/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({
                    id: personId,
                    name: newName,
                    contribution_amount: newAmount
                })
            })
            .then(response => response.json())
            .then(data => {
                showToast('Person updated successfully!', true);
                updatePersonsList();
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Error updating person', false);
                listItem.innerHTML = originalContent;
            });
        });

        cancelButton.addEventListener('click', () => {
            listItem.innerHTML = originalContent;
            // Reattach event listeners after restoring content
            const newEditButton = listItem.querySelector('.edit-person-button');
            const newDeleteButton = listItem.querySelector('.delete-person-button');
            newEditButton.addEventListener('click', () => {
                editPerson(personId, currentName, currentAmount, listItem);
            });
            newDeleteButton.addEventListener('click', () => {
                deletePerson(personId, listItem);
            });
        });
    }

    function deletePerson(personId, listItem) {
        if (confirm('Are you sure you want to delete this person?')) {
            fetch('/api/persons/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({ id: personId })
            })
            .then(response => response.json())
            .then(data => {
                showToast('Person deleted successfully!', true);
                updatePersonsList();
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Error deleting person', false);
            });
        }
    }

    // Event Listeners
    elements.manageContributorsButton?.addEventListener('click', () => {
        updatePersonsList();
        elements.editPersonsModal.style.display = 'block';
    });

    elements.addPersonButton?.addEventListener('click', () => {
        elements.editPersonsModal.style.display = 'none';
        elements.addPersonModal.style.display = 'block';
    });

    elements.savePersonConfirm?.addEventListener('click', () => {
        const name = elements.personName.value.trim();
        const amount = elements.contributionAmount.value;

        if (!name || !amount) {
            showToast('Please fill in all fields', false);
            return;
        }

        fetch('/api/persons/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                name: name,
                contribution_amount: amount
            })
        })
        .then(response => response.json())
        .then(data => {
            showToast('Person added successfully!', true);
            clearAndCloseAddPersonModal();
            updatePersonsList(); // This will update both dropdown and active contributors
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error adding person', false);
        });
    });

    // Function to clear inputs and close add person modal
    function clearAndCloseAddPersonModal() {
        elements.personName.value = '';
        elements.contributionAmount.value = '';
        elements.addPersonModal.style.display = 'none';
    }

    // Updated cancel button handler
    elements.savePersonCancel?.addEventListener('click', () => {
        clearAndCloseAddPersonModal();
    });

    // Updated close button handler
    elements.editPersonsClose?.addEventListener('click', () => {
        elements.editPersonsModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.addPersonModal) {
            clearAndCloseAddPersonModal();
        }
        if (e.target === elements.editPersonsModal) {
            elements.editPersonsModal.style.display = 'none';
        }
    });

    // Add escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearAndCloseAddPersonModal();
            elements.editPersonsModal.style.display = 'none';
        }
    });

    // Add dropdown change handler
    elements.selectedPerson?.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        if (selectedOption.value) {
            const amount = parseInt(selectedOption.dataset.amount);
            updateSavingsChart([{ contribution_amount: amount }]);
        } else {
            updateSavingsChart([]); // Reset chart when no person is selected
        }
    });

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        updatePersonsList();
    });
})(); 