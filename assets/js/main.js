// DOM Elements
const categoriesContainer = document.querySelector('.categories-container');
const expandedCategoriesContainer = document.getElementById('expanded-categories');
const expandBtn = document.getElementById('expand-categories');
const generateBtn = document.getElementById('generate-btn');
const generateMoreBtn = document.getElementById('generate-more-btn');
const languageSelect = document.getElementById('language');
const quantitySelect = document.getElementById('quantity');
const loadingElement = document.getElementById('loading');
const resultsContainer = document.getElementById('results-container');
const statusResults = document.getElementById('status-results');
const toast = document.getElementById('toast');

// Current selection
let currentMood = 'love';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupCategorySelection();

    expandBtn.addEventListener('click', function() {
        if (expandedCategoriesContainer.style.display === 'grid') {
            expandedCategoriesContainer.style.display = 'none';
            expandBtn.innerHTML = '<i class="fas fa-chevron-down"></i> More Categories';
        } else {
            expandedCategoriesContainer.style.display = 'grid';
            expandBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Less Categories';
        }
    });

    generateBtn.addEventListener('click', generateStatuses);
    generateMoreBtn.addEventListener('click', generateStatuses);
});

function setupCategorySelection() {
    const allCategories = document.querySelectorAll('.category');
    allCategories.forEach(category => {
        category.addEventListener('click', function() {
            allCategories.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            currentMood = this.getAttribute('data-mood');
        });
    });
}

function generateStatuses() {
    loadingElement.style.display = 'block';
    resultsContainer.style.display = 'none';

    const language = languageSelect.value;
    const quantity = parseInt(quantitySelect.value);

    // Simulate API call delay
    setTimeout(() => {
        let statuses = [];
        if (statusData[currentMood] && statusData[currentMood][language]) {
            statuses = [...statusData[currentMood][language]];
        } else {
            statuses = [...statusData[currentMood].english];
        }

        const shuffled = shuffleArray(statuses);
        const selectedStatuses = shuffled.slice(0, Math.min(quantity, shuffled.length));

        displayStatuses(selectedStatuses);

        loadingElement.style.display = 'none';
        resultsContainer.style.display = 'block';
        generateMoreBtn.style.display = 'flex';

        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }, 800);
}

function displayStatuses(statuses) {
    statusResults.innerHTML = '';
    statuses.forEach(status => {
        const card = document.createElement('div');
        card.className = 'status-card';
        card.innerHTML = `
            <p class="status-text">${status}</p>
            <div class="status-actions">
                <button class="action-btn copy-btn" data-status="${status}">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="action-btn share-btn" data-status="${status}">
                    <i class="fas fa-share-alt"></i> Share
                </button>
                <button class="action-btn download-btn" data-status="${status}">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        `;
        statusResults.appendChild(card);
    });
    addActionListeners();
}

function addActionListeners() {
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            copyToClipboard(status);
        });
    });

    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            shareStatus(status);
        });
    });

    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            downloadStatus(status);
        });
    });
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('Status copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Failed to copy text');
        });
}

function shareStatus(text) {
    if (navigator.share) {
        navigator.share({
            title: 'WhatsApp Status',
            text: text,
            url: window.location.href
        })
        .catch(err => console.log('Error sharing:', err));
    } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    }
}

function downloadStatus(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsapp-status-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}