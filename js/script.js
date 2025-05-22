document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Script started.");

    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const heroSection = document.getElementById('hero');
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const starFallContainer = document.querySelector('.star-fall-container');

    // Увеличиваем количество и диапазон размеров звезд для прелоадера
    const numPreloaderStars = 200; // Увеличено количество звезд
    const numHeroStars = 70; // Количество мерцающих звезд на Hero Section

    // --- Custom Message Box Functions (for consultation form) ---
    const customMessageBox = document.getElementById('customMessageBox');
    const messageText = document.getElementById('messageText');
    const messageCloseBtn = document.getElementById('messageCloseBtn');

    function showCustomMessage(message) {
        messageText.textContent = message;
        customMessageBox.classList.add('show');
    }

    function hideCustomMessage() {
        customMessageBox.classList.remove('show');
    }

    if (messageCloseBtn) {
        messageCloseBtn.addEventListener('click', hideCustomMessage);
    }
    if (customMessageBox) {
        customMessageBox.addEventListener('click', (event) => {
            if (event.target === customMessageBox) { // Close only if clicking on the overlay
                hideCustomMessage();
            }
        });
    }

    // --- Global Star Generation Function ---
    // This function will be called for both preloader and consultation page
    function createStars(container, numStars, starClass, durationVar, delayVar, isFalling = false) {
        if (!container) {
            console.warn(`Контейнер для звезд не найден: ${container ? container.id : 'null'}. Звезды не будут генерироваться.`);
            return;
        }

        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.classList.add(starClass);

            let size;
            if (isFalling) {
                // Для падающих звезд (прелоадер): более крупные и разнообразные размеры
                size = Math.random() * 10 + 5; // Размеры от 5px до 15px
            } else {
                // Для мерцающих звезд (Hero Section и страница консультации): более мелкие
                size = Math.random() * 5 + 1; // Размеры от 1px до 4px
            }
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            if (isFalling) {
                // For falling stars (preloader)
                const startX = Math.random() * 100 - 20;
                const startY = Math.random() * 100 - 20;
                star.style.setProperty('--star-start-x', `${startX}vw`);
                star.style.setProperty('--star-start-y', `${startY}vh`);

                const endX = startX + (Math.random() * 100 + 50);
                const endY = startY + (Math.random() * 100 + 50);
                star.style.setProperty('--star-end-x', `${endX}vw`);
                star.style.setProperty('--star-end-y', `${endY}vh`);

                star.style.setProperty(durationVar, `${Math.random() * 2 + 3}s`); // 3-5 seconds
                star.style.animationDelay = `${Math.random() * 5}s`; // 0-5 seconds delay

                star.addEventListener('animationend', () => {
                    star.remove();
                    createStars(container, 1, starClass, durationVar, delayVar, isFalling); // Recreate one star
                });
            } else {
                // For twinkling stars (hero section and consultation page)
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.setProperty(durationVar, `${Math.random() * 10 + 10}s`); // 10-20 seconds for slow twinkling
                star.style.animationDelay = `${Math.random() * 10}s`; // Random delay
            }
            container.appendChild(star);
        }
    }

    // --- Conditional Page Initialization ---
    if (preloader && mainContent) { // We are on the main index.html page
        console.log("Инициализация главной страницы (index.html).");

        // Generate preloader falling stars
        createStars(starFallContainer, numPreloaderStars, 'star', '--star-duration', null, true);

        // Generate hero section twinkling stars
        createStars(heroSection, numHeroStars, 'hero-star', '--twinkle-duration');

        // Preloader Hiding Logic
        window.addEventListener('load', () => {
            console.log("Window fully loaded (все ресурсы загружены).");
            const preloaderTransitionDuration = 1000; // Matches CSS transition duration for #preloader

            setTimeout(() => {
                if (preloader) {
                    console.log("Имитация начальной загрузки завершена, добавляем класс 'fade-out'.");
                    preloader.classList.add('fade-out');

                    setTimeout(() => {
                        if (preloader) {
                            preloader.style.display = 'none';
                            console.log("Прелоадер скрыт через display: none.");
                        }
                        if (mainContent) {
                            mainContent.classList.remove('hidden');
                            mainContent.classList.add('visible');
                            console.log("Основной контент сделан видимым.");
                        }
                    }, preloaderTransitionDuration + 100); // Add a small buffer
                } else {
                    console.warn("Элемент прелоадера не найден при window.load. Пропускаем fade-out.");
                }
            }, 2000); // Initial delay before fade-out starts
        });

        // Emergency fallback: Hide preloader after max time
        setTimeout(() => {
            if (preloader && preloader.style.display !== 'none' && preloader.style.visibility !== 'hidden') {
                console.warn("Аварийный механизм активирован: Принудительное скрытие прелоадера после 10 секунд.");
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                preloader.style.display = 'none';
                if (mainContent) {
                    mainContent.classList.remove('hidden');
                    mainContent.classList.add('visible');
                }
            }
        }, 10000); // Max wait time 10 seconds

        // Smooth Scroll for Navigation Links
        document.querySelectorAll('.nav-links a').forEach(anchor => {
			anchor.addEventListener('click', function (e) {
				if (this.getAttribute('href').startsWith('#')) {
					e.preventDefault();
					const targetId = this.getAttribute('href');
					const targetElement = document.querySelector(targetId);
					if (targetElement) {
						const navHeight = document.querySelector('header').offsetHeight;
						const targetPosition = targetElement.offsetTop - navHeight - 20; // 20px дополнительного отступа
                
						window.scrollTo({
							top: targetPosition,
							behavior: 'smooth'
						});
					}
				}

				// Оставшийся код для закрытия мобильного меню...
				if (navLinks && navLinks.classList.contains('active')) {
					navLinks.classList.remove('active');
					if (menuToggle) {
						menuToggle.querySelector('i').classList.remove('fa-times');
						menuToggle.querySelector('i').classList.add('fa-bars');
					}
				}
		});
	});

        // Mobile Menu Toggle
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    if (navLinks.classList.contains('active')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (navLinks && menuToggle && navLinks.classList.contains('active')) {
                if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            }
        });

    } else if (document.getElementById('consultation-page')) { // We are on the consultation.html page
        console.log("Инициализация страницы консультации (consultation.html).");
        const starsBackground = document.getElementById('stars-background');
        if (starsBackground) {
            // Для страницы консультации используем мерцающие звезды, как на Hero Section
            createStars(starsBackground, 100, 'hero-star', '--twinkle-duration', null, false);
        }

        // Add mousemove effect for stars on consultation page
        document.addEventListener("mousemove", (event) => {
            const starsContainer = document.getElementById("stars-background");
            if (starsContainer) {
                let x = (event.clientX / window.innerWidth - 0.5) * 50;
                let y = (event.clientY / window.innerHeight - 0.5) * 50;
                starsContainer.style.transform = `translate(${x}px, ${y}px)`;
            }
        });


        // --- Consultation Form Submission Logic ---
        const consultationForm = document.getElementById("consultationForm");
        if (consultationForm) {
            consultationForm.addEventListener("submit", async function(event) {
                event.preventDefault();

                const projectName = document.getElementById("project_name").value;
                const projectLink = document.getElementById("project_link").value;
                const telegram = document.getElementById("telegram").value;

                // IMPORTANT: Replace with your actual bot token and chat ID
                const botToken = "7506642500:AAFpJQuRNLZaWAg3a01Pwgz48_Mq7yhS4uE"; // Your Telegram Bot Token
                const chatId = "1621189363"; // Your Telegram Chat ID

                const message = `Новый запрос на консультацию:\n\n` +
                                `Название проекта: ${projectName}\n` +
                                `Ссылка на проект: ${projectLink}\n` +
                                `Контакт в Telegram: ${telegram}`;

                const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

                try {
                    const response = await fetch(telegramUrl, { method: "GET" });
                    const data = await response.json();

                    if (data.ok) {
                        showCustomMessage("✅ Запрос успешно отправлен!");
                        consultationForm.reset();
                    } else {
                        showCustomMessage(`❌ Ошибка: ${data.description || 'Неизвестная ошибка.'}`);
                    }
                } catch (error) {
                    console.error("Ошибка сети или API:", error);
                    showCustomMessage("❌ Ошибка сети. Проверьте консоль.");
                }
            });
        }
    }
});
