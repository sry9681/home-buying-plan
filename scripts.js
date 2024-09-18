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
    elements.closingCostsDollar.textContent = `($${totalClosingCosts.toLocaleString()})`;
    
    const totalDownPayment = payment + totalClosingCosts;
    
    if (totalDownPayment > price) {
        alert("Down payment plus closing costs cannot exceed home price");
        elements.downPayment.value = Math.max(0, price - totalClosingCosts);
        return;
    }

    const loanAmountValue = price - (payment - totalClosingCosts);
    elements.loanAmountSpan.textContent = `Loan Amount: $${loanAmountValue.toLocaleString()}`;
    
    const monthlyPayments = term * 12;
    
    const mortgagePayment = loanAmountValue * (rate * Math.pow(1 + rate, monthlyPayments)) / (Math.pow(1 + rate, monthlyPayments) - 1);
    const monthlyPropertyTax = price * propertyTaxRate;
    const monthlyInsurance = price * insuranceRate;
    
    const totalMonthlyCost = mortgagePayment + monthlyPropertyTax + monthlyInsurance + hoaFee + gasFee + electricityFee + internetFee + waterTrashFee;
    
    elements.monthlyCost.textContent = `Total Monthly Cost: $${totalMonthlyCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    const totalContribution = parseFloat(elements.person1Contribution.value || 0) + parseFloat(elements.person2Contribution.value || 0);
    const savings = totalContribution - totalMonthlyCost;
    elements.totalSavings.textContent = `Total Savings: $${savings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    updateChart(totalMonthlyCost, savings);
}

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
// Function to calculate and update the loan amount
function calculateAndUpdateLoanAmount() {
    const homePrice = parseInt(document.getElementById('homePrice').value, 10);
    const downPayment = parseInt(document.getElementById('downPayment').value, 10);
    const loanAmount = homePrice - downPayment;
    document.getElementById('loanAmount').textContent = `Loan Amount: $${loanAmount.toLocaleString()}`;
}

// Add event listeners
Object.values(elements).forEach(element => {
    if (element && element.addEventListener) {
        element.addEventListener('input', updateCalculations);
    }
});

elements.minPrice.addEventListener('change', updateSlider);
elements.maxPrice.addEventListener('change', updateSlider);
['downPayment', 'homePrice', 'closingCosts'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateAndUpdateLoanAmount);
});

// Initialize MDL components
componentHandler.upgradeAllRegistered();

// Initial calculation
updateSlider();

// DOM content loaded event
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    componentHandler.upgradeAllRegistered();
    calculateAndUpdateLoanAmount();
    initializeChart(); // Initialize the chart with default values
    updateCalculations(); // Then update with actual input values
});

// Function to save data
function saveData() {
    const inputs = document.querySelectorAll('input[type="number"], input[type="range"], select');
    inputs.forEach(input => {
        localStorage.setItem(input.name, input.value);
    });
}

// Event listener to save data on input change
document.querySelectorAll('input[type="number"], input[type="range"], select').forEach(input => {
    input.addEventListener('change', saveData);
});

// Function to load data
function loadData() {
    const inputs = document.querySelectorAll('input[type="number"], input[type="range"], select');
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.name);
        if (savedValue) {
            input.value = savedValue;
        }
    });
}

// Load data on page load
document.addEventListener('DOMContentLoaded', loadData);