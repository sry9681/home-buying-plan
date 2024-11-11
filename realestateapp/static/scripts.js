// Use an IIFE to avoid polluting the global scope
(function() {
    // Cache DOM elements
    const elements = {
        homePrice: document.getElementById('homePrice'),
        homePriceValue: document.getElementById('homePriceValue'),
        minPrice: document.getElementById('minPrice'),
        maxPrice: document.getElementById('maxPrice'),
        downPayment: document.getElementById('downPayment'),
        closingCosts: document.getElementById('closingCosts'),
        closingCostsValue: document.getElementById('closingCostsValue'),
        closingCostsDollar: document.getElementById('closingCostsDollar'),
        loanAmountSpan: document.getElementById('loanAmount'),
        loanTerm: document.getElementById('loanTerm'),
        interestRate: document.getElementById('interestRate'),
        propertyTax: document.getElementById('propertyTax'),
        insurance: document.getElementById('insurance'),
        hoa: document.getElementById('hoa'),
        gas: document.getElementById('gas'),
        electricity: document.getElementById('electricity'),
        internet: document.getElementById('internet'),
        waterTrash: document.getElementById('waterTrash'),
        monthlyCost: document.getElementById('monthlyCost'),
        person1Contribution: document.getElementById('person1Contribution'),
        person2Contribution: document.getElementById('person2Contribution'),
        totalSavings: document.getElementById('totalSavings'),
        savingsGoal: document.getElementById('savingsGoal'),
        goalMetMonth: document.getElementById('goalMetMonth'),
        chartCanvas: document.getElementById('homePriceChart')
    };

    let homePriceChartInstance = null;

    function updateSlider() {
        const min = parseInt(elements.minPrice.value);
        const max = parseInt(elements.maxPrice.value);
        
        if (min >= max) {
            alert("Minimum price must be less than maximum price");
            elements.minPrice.value = elements.homePrice.min;
            elements.maxPrice.value = elements.homePrice.max;
            return;
        }

        elements.homePrice.min = min;
        elements.homePrice.max = max;
        elements.homePrice.value = Math.min(Math.max(elements.homePrice.value, min), max);
        updateCalculations();
    }

    function updateCalculations() {
        const price = parseInt(elements.homePrice.value);
        const payment = parseInt(elements.downPayment.value);
        const closing = parseFloat(elements.closingCosts.value);
        const term = parseInt(elements.loanTerm.value);
        const rate = parseFloat(elements.interestRate.value) / 100 / 12;
        const propertyTaxRate = parseFloat(elements.propertyTax.value) / 100 / 12;
        const insuranceRate = parseFloat(elements.insurance.value) / 100 / 12;
        const hoaFee = parseFloat(elements.hoa.value);
        const gasFee = parseFloat(elements.gas.value);
        const electricityFee = parseFloat(elements.electricity.value);
        const internetFee = parseFloat(elements.internet.value);
        const waterTrashFee = parseFloat(elements.waterTrash.value);
        
        elements.homePriceValue.textContent = `$${price.toLocaleString()}`;
        elements.closingCostsValue.textContent = `${closing.toFixed(1)}%`;
        
        const totalClosingCosts = price * (closing / 100);
        const loanAmount = price - (payment - totalClosingCosts);
        const closingCosts = totalClosingCosts;
        
        const monthlyPayments = term * 12;
        const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, monthlyPayments)) / (Math.pow(1 + rate, monthlyPayments) - 1);
        const monthlyPropertyTax = price * propertyTaxRate;
        const monthlyInsurance = price * insuranceRate;
        
        const totalMonthlyCost = monthlyPayment + monthlyPropertyTax + monthlyInsurance + hoaFee + gasFee + electricityFee + internetFee + waterTrashFee;
        
        const totalContribution = parseFloat(elements.person1Contribution.value || 0) + parseFloat(elements.person2Contribution.value || 0);
        const savings = totalContribution - totalMonthlyCost;

        // Instead of updating DOM directly, return the calculated values
        return {
            loanAmount,
            closingCosts,
            monthlyPayment,
            totalMonthlyCost,
            savings
        };
    }

    // Update event listeners
    document.querySelectorAll('input[type="number"], input[type="range"], select').forEach(input => {
        input.addEventListener('input', () => {
            const results = updateCalculations();
            // Update DOM with results
            elements.loanAmountSpan.textContent = `Loan Amount: $${results.loanAmount.toLocaleString()}`;
            elements.closingCostsDollar.textContent = `($${results.closingCosts.toLocaleString()})`;
            elements.monthlyCost.textContent = `Total Monthly Cost: $${results.totalMonthlyCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            elements.totalSavings.textContent = `Total Savings: $${results.savings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            updateChart(results.totalMonthlyCost, results.savings);
        });
    });

    function initializeChart() {
        // Use default values to create the initial chart
        const defaultMonthlyPayment = 1000; // Example default value
        const defaultSavings = 500; // Example default value
        updateChart(defaultMonthlyPayment, defaultSavings);
    }

    function updateChart(monthlyCostValue, monthlySavingsValue) {
        const term = parseInt(elements.loanTerm.value) * 12;
        
        const monthlyCosts = Array(term).fill(monthlyCostValue);
        const totalSpent = monthlyCosts.map((cost, index) => cost * (index + 1));
        const cumulativeSavings = Array(term).fill(monthlySavingsValue).map((savings, index) => savings * (index + 1));

        const savingsGoalValue = parseFloat(elements.savingsGoal.value);
        const savingsGoalData = Array(term).fill(savingsGoalValue);
        let goalMetMonthValue = cumulativeSavings.findIndex(savings => savings >= savingsGoalValue) + 1;

        elements.goalMetMonth.textContent = `Goal Met Month: ${goalMetMonthValue > 0 ? goalMetMonthValue : '-'}`;

        let xAxisMax = goalMetMonthValue > 0 ? Math.ceil(goalMetMonthValue * 1.15) : term;

        const ctx = elements.chartCanvas.getContext('2d');
        if (homePriceChartInstance) {
            homePriceChartInstance.destroy();
        }

        homePriceChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: term }, (_, i) => i + 1),
                datasets: [{
                    label: 'Monthly Cost',
                    data: monthlyCosts,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }, {
                    label: 'Total Spent on Home',
                    data: totalSpent,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                }, {
                    label: 'Cumulative Savings',
                    data: cumulativeSavings,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                }, {
                    label: 'Savings Goal',
                    data: savingsGoalData,
                    borderColor: 'rgb(0, 0, 0)',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Months'
                        },
                        beginAtZero: true,
                        max: xAxisMax
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

        if (goalMetMonthValue > 0) {
            homePriceChartInstance.data.datasets.push({
                label: 'Goal Met Point',
                data: Array(term).fill(null).map((_, index) => index + 1 === goalMetMonthValue ? cumulativeSavings[index] : null),
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(255, 0, 0)',
                pointRadius: 5,
                pointHoverRadius: 7,
                showLine: false
            });
        }

        homePriceChartInstance.update();
    }

    // DOM content loaded event
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded and parsed');
        componentHandler.upgradeAllRegistered();
        const results = updateCalculations();
        elements.loanAmountSpan.textContent = `Loan Amount: $${results.loanAmount.toLocaleString()}`;
        elements.closingCostsDollar.textContent = `($${results.closingCosts.toLocaleString()})`;
        elements.monthlyCost.textContent = `Total Monthly Cost: $${results.totalMonthlyCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        elements.totalSavings.textContent = `Total Savings: $${results.savings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        initializeChart();
        updateChart(results.totalMonthlyCost, results.savings);
    });

    function showToast(message, isSuccess = true) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast ' + (isSuccess ? 'success' : 'error') + ' show';
        
        // Hide the toast after 3 seconds
        setTimeout(function() {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }

    document.getElementById('saveButton')?.addEventListener('click', function() {
        // Get CSRF token
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // Gather all the calculation data
        const calculationData = {
            home_price: elements.homePrice.value,
            down_payment: elements.downPayment.value,
            closing_costs: elements.closingCosts.value,
            loan_term: elements.loanTerm.value,
            interest_rate: elements.interestRate.value,
            property_tax: elements.propertyTax.value,
            insurance_rate: elements.insurance.value,
            hoa: elements.hoa.value,
            gas: elements.gas.value,
            electricity: elements.electricity.value,
            internet: elements.internet.value,
            water_trash: elements.waterTrash.value,
            person1_contribution: elements.person1Contribution.value,
            person2_contribution: elements.person2Contribution.value,
            savings_goal: elements.savingsGoal.value
        };

        // Send the data to your API endpoint
        fetch('/api/mortgage-calculation/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(calculationData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showToast('Calculation saved successfully!', true);
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error saving calculation', false);
        });
    });
})();