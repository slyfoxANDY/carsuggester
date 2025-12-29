// State Management
let currentCar = null;
let comparisonCars = [];
let quizAnswers = {};

// Page Navigation
function showHome() {
    switchPage('home-page');
    updateNavLink('home');
}

function showCars() {
    switchPage('cars-page');
    updateNavLink('cars');
    loadCars();
}

function showQuiz() {
    switchPage('quiz-page');
    updateNavLink('quiz');
    initializeQuiz();
}

function showComparison() {
    switchPage('compare-page');
    updateNavLink('compare');
    loadComparison();
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function updateNavLink(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
}

// Car Display and Filtering
function loadCars() {
    const grid = document.getElementById('cars-grid');
    grid.innerHTML = '';
    
    cars.forEach(car => {
        const card = createCarCard(car);
        grid.appendChild(card);
    });
}

function createCarCard(car) {
    const div = document.createElement('div');
    div.className = 'car-card';
    
    div.innerHTML = `
        <div class="car-card-image">
            🚗
        </div>
        <div class="car-card-content">
            <div class="car-card-brand">${car.brand}</div>
            <h3 class="car-card-title">${car.name}</h3>
            <div class="car-card-specs">
                <span>⚡ ${car.horsepower} hp</span>
                <span>🔋 ${car.fuelType}</span>
            </div>
            <div class="car-card-specs">
                <span>⏱️ ${car.acceleration}s 0-60</span>
                <span>💰 ${car.price}</span>
            </div>
            <div class="car-card-footer">
                <span class="car-card-price">${car.price}</span>
                <button class="view-btn" onclick="openCarDetail(${car.id})">View</button>
            </div>
        </div>
    `;
    
    return div;
}

function filterCars() {
    const searchTerm = document.getElementById('carSearch').value.toLowerCase();
    const brandFilter = document.getElementById('brandFilter').value;
    
    const grid = document.getElementById('cars-grid');
    grid.innerHTML = '';
    
    const filtered = cars.filter(car => {
        const matchesSearch = car.name.toLowerCase().includes(searchTerm) || 
                            car.brand.toLowerCase().includes(searchTerm) ||
                            car.category.toLowerCase().includes(searchTerm);
        const matchesBrand = !brandFilter || car.brand === brandFilter;
        
        return matchesSearch && matchesBrand;
    });
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No cars found matching your criteria</p>';
        return;
    }
    
    filtered.forEach(car => {
        const card = createCarCard(car);
        grid.appendChild(card);
    });
}

// Car Detail Modal
function openCarDetail(carId) {
    currentCar = cars.find(c => c.id === carId);
    if (!currentCar) return;
    
    // Populate modal
    document.getElementById('carDetailName').textContent = `${currentCar.brand} ${currentCar.name}`;
    document.getElementById('carDetailRating').textContent = '⭐'.repeat(Math.floor(currentCar.rating));
    document.getElementById('carDetailScore').textContent = currentCar.rating.toFixed(1);
    
    // Overview Tab
    document.getElementById('carDetailCategory').textContent = currentCar.category;
    document.getElementById('carDetailYear').textContent = currentCar.year;
    document.getElementById('carDetailPrice').textContent = currentCar.price;
    document.getElementById('carDetailFuel').textContent = currentCar.fuelType;
    document.getElementById('carDetailDescription').textContent = currentCar.description;
    
    // Engine Tab
    document.getElementById('carDetailEngineType').textContent = currentCar.engineType;
    document.getElementById('carDetailDisplacement').textContent = currentCar.displacement;
    document.getElementById('carDetailHP').textContent = `${currentCar.horsepower} hp`;
    document.getElementById('carDetailTorque').textContent = currentCar.torque;
    document.getElementById('carDetailTransmission').textContent = currentCar.transmission;
    document.getElementById('carDetailFuelEconomy').textContent = currentCar.fuelEconomy;
    
    // Performance Tab
    updatePerformanceBar('carPerfAccel', currentCar.acceleration, 0, 10, 's 0-60');
    updatePerformanceBar('carPerfSpeed', currentCar.topSpeed, 100, 230, ' mph');
    updatePerformanceBar('carPerfHandling', currentCar.handling, 0, 100, '/100');
    updatePerformanceBar('carPerfComfort', currentCar.comfort, 0, 100, '/100');
    
    // Interior Tab
    document.getElementById('carDetailSeating').textContent = currentCar.seating + ' seats';
    document.getElementById('carDetailCargo').textContent = currentCar.cargo;
    document.getElementById('carDetailFeatures').textContent = currentCar.features;
    document.getElementById('carDetailTech').textContent = currentCar.technology;
    
    // Pros & Cons Tab
    populateProsCons();
    
    // Show modal
    document.getElementById('carDetailModal').classList.add('active');
}

function updatePerformanceBar(elementId, value, min, max, unit) {
    const percentage = ((value - min) / (max - min)) * 100;
    const fillElement = document.getElementById(elementId);
    const valueElement = document.getElementById(elementId.replace('carPerf', 'carPerfVal'));
    
    fillElement.style.width = Math.min(percentage, 100) + '%';
    valueElement.textContent = value + unit;
}

function populateProsCons() {
    const prosList = document.getElementById('carDetailPros');
    const consList = document.getElementById('carDetailCons');
    
    prosList.innerHTML = '';
    consList.innerHTML = '';
    
    currentCar.pros.forEach(pro => {
        const li = document.createElement('li');
        li.textContent = pro;
        prosList.appendChild(li);
    });
    
    currentCar.cons.forEach(con => {
        const li = document.createElement('li');
        li.textContent = con;
        consList.appendChild(li);
    });
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

function closeModal() {
    document.getElementById('carDetailModal').classList.remove('active');
}

function addToComparison() {
    if (!currentCar) return;
    
    if (comparisonCars.length >= 3) {
        alert('You can compare up to 3 cars. Please remove one first.');
        return;
    }
    
    if (comparisonCars.find(c => c.id === currentCar.id)) {
        alert('This car is already in the comparison.');
        return;
    }
    
    comparisonCars.push(currentCar);
    alert(`${currentCar.brand} ${currentCar.name} added to comparison!`);
    closeModal();
}

// Quiz Functionality
function initializeQuiz() {
    const container = document.getElementById('quizContent');
    container.innerHTML = '';
    quizAnswers = {};
    
    const progressDiv = document.createElement('div');
    progressDiv.className = 'quiz-progress';
    progressDiv.innerHTML = `
        <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: 0%"></div>
        </div>
        <p id="progressText">Question 1 of ${quizQuestions.length}</p>
    `;
    container.appendChild(progressDiv);
    
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.id = `question-${index}`;
        questionDiv.style.display = index === 0 ? 'block' : 'none';
        
        questionDiv.innerHTML = `
            <h3>${q.question}</h3>
            <div class="quiz-options">
                ${q.options.map((opt, optIndex) => `
                    <label class="quiz-option">
                        <input type="radio" name="q${index}" value="${optIndex}" 
                               onchange="selectAnswer(${index}, ${optIndex})">
                        <span>${opt.text}</span>
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(questionDiv);
    });
    
    // Navigation buttons
    const navDiv = document.createElement('div');
    navDiv.style.marginTop = '2rem';
    navDiv.style.display = 'flex';
    navDiv.style.gap = '1rem';
    navDiv.style.justifyContent = 'flex-end';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-secondary';
    prevBtn.textContent = 'Previous';
    prevBtn.id = 'prevBtn';
    prevBtn.style.display = 'none';
    prevBtn.onclick = () => prevQuestion();
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = 'Next';
    nextBtn.id = 'nextBtn';
    nextBtn.onclick = () => nextQuestion();
    
    navDiv.appendChild(prevBtn);
    navDiv.appendChild(nextBtn);
    container.appendChild(navDiv);
}

let currentQuestion = 0;

function selectAnswer(questionIndex, optionIndex) {
    if (!quizAnswers[questionIndex]) {
        quizAnswers[questionIndex] = {};
    }
    
    const scores = quizQuestions[questionIndex].options[optionIndex].score;
    Object.keys(scores).forEach(key => {
        quizAnswers[questionIndex][key] = scores[key];
    });
}

function nextQuestion() {
    if (!quizAnswers[currentQuestion]) {
        alert('Please select an answer');
        return;
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        updateQuizDisplay();
    } else {
        calculateQuizResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        updateQuizDisplay();
    }
}

function updateQuizDisplay() {
    // Hide all questions
    document.querySelectorAll('.quiz-question').forEach((q, i) => {
        q.style.display = i === currentQuestion ? 'block' : 'none';
    });
    
    // Update progress
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    document.querySelector('.quiz-progress-fill').style.width = progress + '%';
    document.getElementById('progressText').textContent = 
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    
    // Update buttons
    document.getElementById('prevBtn').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('nextBtn').textContent = 
        currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next';
}

function calculateQuizResults() {
    // Calculate total scores by category
    const totalScores = {
        economical: 0,
        practical: 0,
        comfort: 0,
        sporty: 0
    };
    
    Object.keys(quizAnswers).forEach(questionIndex => {
        Object.keys(quizAnswers[questionIndex]).forEach(category => {
            totalScores[category] += quizAnswers[questionIndex][category];
        });
    });
    
    // Find best matching cars
    const recommendations = [];
    cars.forEach(car => {
        let score = 0;
        
        if (totalScores.economical >= 15) score += car.fuelEconomy.includes('52') ? 5 : 0;
        if (totalScores.sporty >= 15) score += car.horsepower >= 500 ? 5 : 0;
        if (totalScores.comfort >= 15) score += car.comfort >= 90 ? 5 : 0;
        if (totalScores.practical >= 15) score += car.seating >= 5 ? 5 : 0;
        
        if (score > 0) {
            recommendations.push({ car, score });
        }
    });
    
    // Sort by score and get top 6
    recommendations.sort((a, b) => b.score - a.score);
    const topRecs = recommendations.slice(0, 6);
    
    // Display results
    const container = document.getElementById('quizContent');
    container.innerHTML = `
        <div class="quiz-results">
            <h2>Your Perfect Cars! 🎯</h2>
            <p>Based on your preferences, here are the best matches for you:</p>
            <div class="quiz-results-cards">
                ${topRecs.map(rec => `
                    <div class="quiz-result-card" onclick="openCarDetail(${rec.car.id})">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🚗</div>
                        <div class="quiz-result-card-name">${rec.car.brand}</div>
                        <div style="font-size: 0.9rem; color: #999;">${rec.car.name}</div>
                        <div class="quiz-result-card-score">${rec.score * 10}%</div>
                        <div style="font-size: 0.9rem; color: #666;">${rec.car.price}</div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-primary" onclick="showCars()" style="margin-top: 2rem;">
                Explore All Cars
            </button>
        </div>
    `;
}

// Comparison Functionality
function loadComparison() {
    const container = document.getElementById('comparisonContent');
    
    if (comparisonCars.length === 0) {
        container.innerHTML = '<p class="empty-message">Select cars from the database to compare them here</p>';
        return;
    }
    
    let html = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th class="comparison-spec-label">Specification</th>
                    ${comparisonCars.map(car => `
                        <th style="text-align: center;">
                            <div>${car.brand}</div>
                            <div style="font-size: 0.9rem; font-weight: normal;">${car.name}</div>
                            <button class="remove-btn" onclick="removeFromComparison(${car.id})">Remove</button>
                        </th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="comparison-spec-label">Category</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.category}</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Price</td>
                    ${comparisonCars.map(car => `<td style="text-align: center; color: var(--primary-color); font-weight: bold;">${car.price}</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Engine</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.engineType}</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Horsepower</td>
                    ${comparisonCars.map(car => `<td style="text-align: center; font-weight: bold;">${car.horsepower} hp</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Torque</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.torque}</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">0-60 mph</td>
                    ${comparisonCars.map(car => `<td style="text-align: center; font-weight: bold;">${car.acceleration}s</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Top Speed</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.topSpeed} mph</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Fuel Economy</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.fuelEconomy}</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Transmission</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.transmission}</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Handling (0-100)</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.handling}/100</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Comfort (0-100)</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.comfort}/100</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Seating</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.seating} seats</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Cargo Space</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">${car.cargo}</td>`).join('')}
                </tr>
                <tr>
                    <td class="comparison-spec-label">Rating</td>
                    ${comparisonCars.map(car => `<td style="text-align: center;">⭐ ${car.rating.toFixed(1)}</td>`).join('')}
                </tr>
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function removeFromComparison(carId) {
    comparisonCars = comparisonCars.filter(c => c.id !== carId);
    loadComparison();
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    showHome();
});
