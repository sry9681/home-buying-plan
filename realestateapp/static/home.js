(function() {
    // Cache DOM elements
    const elements = {
        selectedHome: document.getElementById('selectedHome'),
        contributorsDropdown: document.getElementById('contributorsDropdown'),
        dropdownContent: document.querySelector('.dropdown-content'),
        selectedContributorsList: document.getElementById('selectedContributorsList'),
        loanAmountSpan: document.getElementById('loanAmount'),
        monthlyCost: document.getElementById('monthlyCost'),
        totalSavings: document.getElementById('totalSavings'),
        goalMetMonth: document.getElementById('goalMetMonth'),
        chartCanvas: document.getElementById('homePriceChart'),
        savingsGoal: document.getElementById('savingsGoal')
    };

    let homePriceChartInstance = null;

    // Add dropdown toggle functionality
    elements.contributorsDropdown?.addEventListener('click', function(e) {
        const container = this.closest('.dropdown-container');
        container.classList.toggle('active');
        e.stopPropagation();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-container')) {
            document.querySelectorAll('.dropdown-container').forEach(container => {
                container.classList.remove('active');
            });
        }
    });

    // Handle checkbox changes
    document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedContributors();
            updateChartWithSelectedContributors();
        });
    });

    function updateSelectedContributors() {
        const selectedContributors = [];
        document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked').forEach(checkbox => {
            selectedContributors.push({
                id: checkbox.value,
                name: checkbox.dataset.name,
                contribution_amount: parseInt(checkbox.dataset.amount)
            });
        });

        // Update the selected contributors list
        elements.selectedContributorsList.innerHTML = selectedContributors.map(contributor => `
            <div class="selected-contributor">
                ${contributor.name} ($${contributor.contribution_amount})
            </div>
        `).join('');

        return selectedContributors;
    }

    function updateChartWithSelectedContributors() {
        const selectedContributors = updateSelectedContributors();
        loadHomeData(elements.selectedHome.value, selectedContributors);
    }

    function loadHomeData(homeId, contributors = []) {
        if (!homeId) {
            updateChart(null, contributors);
            return;
        }

        fetch(`/api/mortgage-calculation/?id=${homeId}`)
            .then(response => response.json())
            .then(data => {
                updateChart(data, contributors);
            })
            .catch(error => {
                console.error('Error loading home:', error);
                updateChart(null, contributors);
            });
    }

    function updateChart(homeData, contributors) {
        if (homePriceChartInstance) {
            homePriceChartInstance.destroy();
        }

        const datasets = [];
        const totalMonthlyContribution = contributors.reduce((sum, person) => 
            sum + parseInt(person.contribution_amount || 0), 0);
        const savingsGoal = parseInt(elements.savingsGoal?.value) || 0;

        // Reset summary information
        elements.loanAmountSpan.textContent = 'Loan Amount: $0';
        elements.monthlyCost.textContent = 'Total Monthly Cost: $0';
        elements.totalSavings.textContent = 'Total Monthly Savings: $0';
        elements.goalMetMonth.textContent = 'Goal Met Month: -';

        let totalMonthlyCost = 0;
        let term = 12; // Default term if no home or goal selected

        if (homeData) {
            try {
                // Calculate monthly mortgage payment
                const principal = homeData.home_price - homeData.down_payment;
                const monthlyRate = (homeData.interest_rate / 100) / 12;
                const monthlyPayment = principal * 
                    (monthlyRate * Math.pow(1 + monthlyRate, homeData.loan_term * 12)) / 
                    (Math.pow(1 + monthlyRate, homeData.loan_term * 12) - 1);

                // Calculate total monthly cost including utilities and taxes
                const monthlyPropertyTax = (homeData.home_price * (homeData.property_tax / 100)) / 12;
                const monthlyInsurance = (homeData.home_price * (homeData.insurance_rate / 100)) / 12;
                totalMonthlyCost = monthlyPayment + monthlyPropertyTax + monthlyInsurance + 
                    homeData.hoa + homeData.gas + homeData.electricity + 
                    homeData.internet + homeData.water_trash;

                elements.loanAmountSpan.textContent = `Loan Amount: $${principal.toLocaleString()}`;
                elements.monthlyCost.textContent = `Total Monthly Cost: $${totalMonthlyCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            } catch (error) {
                console.error('Error calculating mortgage data:', error);
            }
        }

        // Calculate net monthly savings (contributions minus costs)
        const netMonthlySavings = totalMonthlyContribution - totalMonthlyCost;
        elements.totalSavings.textContent = `Total Monthly Savings: $${netMonthlySavings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

        // Calculate months needed to reach goal
        let goalMetMonth = 0;
        if (savingsGoal > 0 && netMonthlySavings > 0) {
            goalMetMonth = Math.ceil(savingsGoal / netMonthlySavings);
            elements.goalMetMonth.textContent = `Goal Met Month: ${goalMetMonth}`;
            // Set term to 15% of the months needed to reach goal
            term = Math.ceil(goalMetMonth * 1.15);
        }

        // Use the larger of the calculated term or default term
        term = Math.max(term, homeData ? homeData.loan_term * 12 : 12);

        if (homeData) {
            // Add monthly cost dataset
            datasets.push({
                label: 'Monthly Cost',
                data: Array(term).fill(totalMonthlyCost),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            });

            // Add cumulative cost dataset
            const totalSpent = Array(term).fill(totalMonthlyCost)
                .map((cost, index) => cost * (index + 1));
            datasets.push({
                label: 'Total Spent on Home',
                data: totalSpent,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            });
        }

        if (totalMonthlyContribution > 0) {
            // Add cumulative savings dataset
            const cumulativeSavings = Array(term).fill(netMonthlySavings)
                .map((savings, index) => savings * (index + 1));
            datasets.push({
                label: 'Cumulative Savings',
                data: cumulativeSavings,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            });
        }

        // Add savings goal line if set
        if (savingsGoal > 0) {
            datasets.push({
                label: 'Savings Goal',
                data: Array(term).fill(savingsGoal),
                borderColor: 'rgb(128, 128, 128)',
                borderDash: [5, 5],
                fill: false
            });

            // Add goal met point if applicable
            if (goalMetMonth > 0) {
                datasets.push({
                    label: 'Goal Met Point',
                    data: Array(term).fill(null).map((_, index) => 
                        index + 1 === goalMetMonth ? savingsGoal : null),
                    borderColor: 'rgb(255, 0, 0)',
                    backgroundColor: 'rgb(255, 0, 0)',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                });
            }
        }

        homePriceChartInstance = new Chart(elements.chartCanvas, {
            type: 'line',
            data: {
                labels: Array.from({ length: term }, (_, i) => `Month ${i + 1}`),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: {
                        min: 0,
                        max: goalMetMonth ? Math.ceil(goalMetMonth * 1.15) : term,  // Show only up to 15% past goal met month
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    },
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

    // Event Listeners
    elements.selectedHome?.addEventListener('change', (e) => {
        const selectedContributors = updateSelectedContributors();
        loadHomeData(e.target.value, selectedContributors);
    });

    elements.savingsGoal?.addEventListener('change', () => {
        const selectedContributors = updateSelectedContributors();
        loadHomeData(elements.selectedHome.value, selectedContributors);
    });

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        updateChart(null, []);
    });
})(); 