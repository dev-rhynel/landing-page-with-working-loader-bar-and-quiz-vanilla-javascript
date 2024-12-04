/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeLoader();
    initializeQuiz();
    initializeNavigation();
    updateCopyrightYear();
});

/**
 * Loader functionality
 */
function initializeLoader() {
    const loader = {
        element: document.getElementById('loader'),
        progressBar: document.querySelector('.loader-progress'),
        
        show() {
            this.element.classList.add('active');
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress > 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => this.hide(), 500);
                }
                this.progressBar.style.width = `${progress}%`;
            }, 200);
        },
        
        hide() {
            this.element.classList.remove('active');
            this.progressBar.style.width = '0%';
        }
    };

    window.showLoader = loader.show.bind(loader);
}

/**
 * Quiz functionality
 */
function initializeQuiz() {
    const quiz = {
        container: document.querySelector('.quiz-container'),
        questionBlocks: document.querySelectorAll('.question-block'),
        progressBar: document.querySelector('.progress'),
        progressText: document.querySelector('.progress-text'),
        prevBtn: document.querySelector('.prev-btn'),
        nextBtn: document.querySelector('.next-btn'),
        congratsSection: document.getElementById('congrats'),
        restartBtn: document.querySelector('.restart-btn'),
        
        state: {
            currentQuestion: 1,
            totalQuestions: document.querySelectorAll('.question-block').length,
            responses: {}
        },

        /**
         * Updates the progress bar and text
         */
        updateProgress() {
            const progress = (this.state.currentQuestion / this.state.totalQuestions) * 100;
            this.progressBar.style.width = `${progress}%`;
            this.progressText.textContent = `Question ${this.state.currentQuestion}/${this.state.totalQuestions}`;
        },

        /**
         * Displays the specified question
         * @param {number} questionNumber - The question number to display
         */
        showQuestion(questionNumber) {
            this.questionBlocks.forEach(block => {
                block.classList.add('hidden');
                if (block.dataset.question == questionNumber) {
                    block.classList.remove('hidden');
                }
            });

            this.prevBtn.disabled = questionNumber === 1;
            this.nextBtn.textContent = questionNumber === this.state.totalQuestions ? 'Submit' : 'Next';
            
            this.updateProgress();
        },

        /**
         * Validates the current question's response
         * @returns {boolean} - Whether the current question is valid
         */
        validateCurrentQuestion() {
            const currentBlock = document.querySelector(`[data-question="${this.state.currentQuestion}"]`);
            
            if (this.state.currentQuestion === 3) {
                const emailInput = currentBlock.querySelector('input[type="email"]');
                return emailInput.value.trim() !== '' && emailInput.checkValidity();
            } else {
                const selectedOption = currentBlock.querySelector('input[type="radio"]:checked');
                return selectedOption !== null;
            }
        },

        /**
         * Collects and stores the response for the current question
         */
        collectResponse() {
            const currentBlock = document.querySelector(`[data-question="${this.state.currentQuestion}"]`);
            
            if (this.state.currentQuestion === 3) {
                this.state.responses.email = currentBlock.querySelector('input[type="email"]').value;
            } else {
                const selectedOption = currentBlock.querySelector('input[type="radio"]:checked');
                if (selectedOption) {
                    this.state.responses[selectedOption.name] = selectedOption.value;
                }
            }
        },

        /**
         * Resets the quiz to its initial state
         */
        reset() {
            this.state.currentQuestion = 1;
            this.state.responses = {};
            document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
            document.querySelector('input[type="email"]').value = '';
            this.congratsSection.classList.add('hidden');
            this.container.closest('.quiz-section').classList.remove('hidden');
            this.showQuestion(1);
        },

        /**
         * Initializes quiz event listeners
         */
        initializeEventListeners() {
            this.prevBtn.addEventListener('click', () => {
                if (this.state.currentQuestion > 1) {
                    this.state.currentQuestion--;
                    this.showQuestion(this.state.currentQuestion);
                }
            });

            this.nextBtn.addEventListener('click', () => {
                if (!this.validateCurrentQuestion()) {
                    alert('Please answer the current question before proceeding.');
                    return;
                }

                this.collectResponse();

                if (this.state.currentQuestion < this.state.totalQuestions) {
                    this.state.currentQuestion++;
                    this.showQuestion(this.state.currentQuestion);
                } else {
                    showLoader();
                    setTimeout(() => {
                        console.log('Quiz Responses:', this.state.responses);
                        this.container.closest('.quiz-section').classList.add('hidden');
                        this.congratsSection.classList.remove('hidden');
                    }, 1500);
                }
            });

            this.restartBtn.addEventListener('click', () => this.reset());
        }
    };

    // Initialize quiz
    quiz.initializeEventListeners();
    quiz.showQuestion(1);
}

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const nav = {
        menuToggle: document.querySelector('.menu-toggle'),
        navLinks: document.querySelector('.nav-links'),

        initializeEventListeners() {
            // Mobile menu toggle
            this.menuToggle.addEventListener('click', () => {
                this.navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.menuToggle.contains(e.target) && !this.navLinks.contains(e.target)) {
                    this.navLinks.classList.remove('active');
                }
            });

            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        this.navLinks.classList.remove('active');
                    }
                });
            });
        }
    };

    nav.initializeEventListeners();
}

/**
 * Updates the copyright year in the footer
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Form submission handling
 */
function initializeFormSubmission() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeFormSubmission();
});
