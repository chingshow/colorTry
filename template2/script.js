document.addEventListener('DOMContentLoaded', function() {
    // Load content from JSON file
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            // Populate content
            populateContent(data);
        })
        .catch(error => console.error('Error loading content:', error));

    function populateContent(content) {
        // Set page title
        document.title = content.siteTitle;
        document.querySelector('.logo').textContent = content.siteTitle;

        // Populate navigation
        const navUl = document.querySelector('nav ul');
        content.navigation.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.link}">${item.label}</a>`;
            navUl.appendChild(li);
        });

        addSmoothScrolling();

        // Set hero content
        document.querySelector('#hero h1').textContent = content.hero.title;
        document.querySelector('#hero .date').textContent = content.hero.date;
        document.querySelector('#hero .cta-button').textContent = content.hero.ctaButton.text;
        document.querySelector('#hero').style.backgroundImage = `url(${content.hero.backgroundImage})`;

        // Set introduction content
        document.querySelector('#intro h2').textContent = content.introduction.title;
        document.querySelector('#intro p').textContent = content.introduction.content;
        document.querySelector('#agenda img').src = content.agenda.image;

        // Populate speakers
        const speakerGrid = document.querySelector('.speaker-grid');
        content.speakers.list.forEach(speaker => {
            const speakerCard = document.createElement('div');
            speakerCard.className = 'speaker-card';
            speakerCard.innerHTML = `
                <img src="${speaker.photo}" alt="${speaker.name}">
                <h3>${speaker.name}</h3>
                <p class="title">${speaker.title}</p>
                <div class="description">
                    <p>${speaker.description}</p>
                </div>
            `;
            speakerGrid.appendChild(speakerCard);
        });


        // Populate Documents
        const documentsContent = document.querySelector('.documents-content');
        content.documents.items.forEach(item => {
            const documentItem = document.createElement('a');
            documentItem.href = `./documents/${item.no}.html`;
            documentItem.target = "_blank";
            documentItem.innerHTML = `
                <div class="documents-item"><h3>${item.titles}</h3><p class="author">- ${item.author}</p></div> 
            `;
            documentsContent.appendChild(documentItem);
        });

        // Populate FAQ
        const faqContent = document.querySelector('.faq-content');
        content.faq.items.forEach(item => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <h3>${item.question}</h3>
                <p>${item.answer}</p>
            `;
            faqContent.appendChild(faqItem);
        });

        // Set registration content
        document.querySelector('#register h2').textContent = content.registration.title;
        const registerOptions = document.querySelector('.register-options');
        content.registration.options.forEach(option => {
            const registerButton = document.createElement('a');
            registerButton.href = option.link;
            registerButton.className = 'register-button';
            registerButton.innerHTML = `<img src="${option.image}" alt="Sign Up Website">`;
            registerOptions.appendChild(registerButton);
        });

        // Set footer content
        document.querySelector('.organizers h3').textContent = content.footer.organizer.title;
        document.querySelector('.organizers img').src = content.footer.organizer.image;
        document.querySelector('.co-organizers h3').textContent = content.footer.coOrganizer.title;
        document.querySelector('.co-organizers img').src = content.footer.coOrganizer.image;
        document.querySelector('.sponsors h3').textContent = content.footer.sponsor.title;
        document.querySelector('.sponsors img').src = content.footer.sponsor.image;
        document.querySelector('.contact h3').textContent = content.footer.contact.title;
        document.querySelector('.contact p:nth-child(2)').textContent = `Phone: ${content.footer.contact.phone}`;
        document.querySelector('.contact p:nth-child(3)').textContent = `Address: ${content.footer.contact.address}`;

        // Set event date for countdown
        const eventDate = new Date(content.registration.eventDate).getTime();
        updateCountdown(eventDate);
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    menuToggle.addEventListener('click', function() {
        navUl.classList.toggle('show');
    });

    function addSmoothScrolling() {
        document.querySelector('nav').addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // Countdown timer
    function updateCountdown(eventDate) {
        const countdownElement = document.getElementById('countdown');

        function update() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `Event starts in: ${days}d ${hours}h ${minutes}m ${seconds}s`;

            if (distance < 0) {
                clearInterval(countdownTimer);
                countdownElement.innerHTML = "Event has started!";
            }
        }

        const countdownTimer = setInterval(update, 1000);
        update(); // Initial call to avoid delay
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        document.querySelector('#hero').style.backgroundPositionY = scrollPosition * 0.7 + 'px';
    });
});