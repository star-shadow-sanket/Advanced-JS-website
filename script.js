document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Mobile Menu & Theme Toggle --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Hamburger Menu Logic
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    // Dark/Light Mode Logic (with LocalStorage)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        let theme = 'dark';
        if (body.classList.contains('light-mode')) {
            theme = 'light';
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        localStorage.setItem('theme', theme);
    });

    /* --- 2. Scroll Reveal Animations --- */
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    /* --- 3. Image Carousel Logic --- */
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    let counter = 0;
    const size = carouselImages[0].clientWidth;
    let autoSlideInterval;

    function updateCarousel() {
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        dots.forEach(dot => dot.classList.remove('active'));
        dots[counter].classList.add('active');
    }

    function nextSlide() {
        if (counter >= carouselImages.length - 1) counter = -1;
        counter++;
        updateCarousel();
    }

    function prevSlide() {
        if (counter <= 0) counter = carouselImages.length;
        counter--;
        updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            counter = index;
            updateCarousel();
            resetInterval();
        });
    });

    function startInterval() {
        autoSlideInterval = setInterval(nextSlide, 4000); // Auto slide every 4s
    }

    function resetInterval() {
        clearInterval(autoSlideInterval);
        startInterval();
    }

    // Handle window resize for carousel calculations
    window.addEventListener('resize', () => {
        carouselSlide.style.transition = 'none';
        updateCarousel();
        setTimeout(() => { carouselSlide.style.transition = 'transform 0.5s ease-in-out'; }, 10);
    });

    startInterval();

    /* --- 4. Interactive Quiz Logic --- */
    const quizData = [
        {
            question: "Which CSS property is used to create a flex container?",
            options: ["display: flex;", "float: left;", "position: absolute;", "grid-template: flex;"],
            correct: 0
        },
        {
            question: "What does 'DOM' stand for in JavaScript?",
            options: ["Data Object Model", "Document Object Model", "Dynamic Output Method", "Document Oriented Model"],
            correct: 1
        },
        {
            question: "Which of the following is NOT a JavaScript data type?",
            options: ["String", "Boolean", "Float", "Undefined"],
            correct: 2
        },
        {
            question: "How do you add a media query in CSS?",
            options: ["@media", "@query", "#media", "media()"],
            correct: 0
        },
        {
            question: "Which method is used to parse a JSON string into a JS object?",
            options: ["JSON.stringify()", "JSON.parse()", "JSON.objectify()", "JSON.convert()"],
            correct: 1
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let selectedOptionIndex = null;

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressText = document.getElementById('progress');
    const scoreText = document.getElementById('score-display');
    const nextQuizBtn = document.getElementById('next-quiz-btn');
    const prevQuizBtn = document.getElementById('prev-quiz-btn');
    const quizResults = document.getElementById('quiz-results');
    const questionContainer = document.getElementById('question-container');
    const finalScoreText = document.getElementById('final-score');
    const highScoreText = document.getElementById('high-score-display');
    const restartBtn = document.getElementById('restart-btn');

    // Load High Score
    let highScore = localStorage.getItem('quizHighScore') || 0;

    function loadQuestion() {
        selectedOptionIndex = null;
        nextQuizBtn.disabled = true;
        prevQuizBtn.disabled = currentQuestion === 0;

        const currentQuizData = quizData[currentQuestion];
        questionText.innerText = currentQuizData.question;
        progressText.innerText = `Question ${currentQuestion + 1}/${quizData.length}`;
        scoreText.innerText = `Score: ${score}`;

        optionsContainer.innerHTML = '';
        currentQuizData.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => selectOption(button, index));
            optionsContainer.appendChild(button);
        });
    }

    function selectOption(selectedButton, index) {
        // Prevent multiple selections
        if (selectedOptionIndex !== null) return; 
        selectedOptionIndex = index;
        
        const correctIndex = quizData[currentQuestion].correct;
        const allButtons = optionsContainer.querySelectorAll('.option-btn');

        if (index === correctIndex) {
            selectedButton.classList.add('correct');
            score++;
            scoreText.innerText = `Score: ${score}`;
        } else {
            selectedButton.classList.add('wrong');
            allButtons[correctIndex].classList.add('correct');
        }

        // Disable all buttons after selection
        allButtons.forEach(btn => btn.style.pointerEvents = 'none');
        nextQuizBtn.disabled = false;
        
        if(currentQuestion === quizData.length - 1){
            nextQuizBtn.innerText = "Finish";
        } else {
            nextQuizBtn.innerText = "Next";
        }
    }

    nextQuizBtn.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    prevQuizBtn.addEventListener('click', () => {
        if(currentQuestion > 0){
            currentQuestion--;
            loadQuestion();
        }
    });

    function showResults() {
        questionContainer.classList.add('hidden');
        document.getElementById('quiz-header').classList.add('hidden');
        document.querySelector('.quiz-footer').classList.add('hidden');
        quizResults.classList.remove('hidden');

        finalScoreText.innerText = `You scored ${score} out of ${quizData.length}!`;
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('quizHighScore', highScore);
        }
        highScoreText.innerText = `Highest Score: ${highScore}`;
    }

    restartBtn.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        quizResults.classList.add('hidden');
        questionContainer.classList.remove('hidden');
        document.getElementById('quiz-header').classList.remove('hidden');
        document.querySelector('.quiz-footer').classList.remove('hidden');
        loadQuestion();
    });

    loadQuestion(); // Initialize Quiz

    /* --- 5. API Integration (Programming Jokes) --- */
    const jokeText = document.getElementById('joke-text');
    const fetchBtn = document.getElementById('fetch-btn');
    const loader = document.getElementById('loader');
    const jokeContent = document.getElementById('joke-content');

    const fetchJoke = async () => {
        // Show loader, hide content
        loader.classList.remove('hidden');
        jokeContent.classList.add('hidden');
        fetchBtn.disabled = true;

        try {
            // Reliable alternative: Official Joke API
            const response = await fetch('https://official-joke-api.appspot.com/jokes/programming/random');
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            // This API returns an array with a single joke object
            const joke = data[0];
            
            // Format the setup and punchline nicely
            jokeText.innerHTML = `<strong>${joke.setup}</strong><br><br><span style="color: var(--accent-color);">${joke.punchline}</span>`;
            
        } catch (error) {
            jokeText.innerText = "Oops! Couldn't fetch a joke right now. Please try again later.";
            console.error("API Fetch Error:", error);
        } finally {
            // Hide loader, show content
            loader.classList.add('hidden');
            jokeContent.classList.remove('hidden');
            fetchBtn.disabled = false;
        }
    };

    fetchBtn.addEventListener('click', fetchJoke);
    fetchJoke(); // Fetch initial joke

});