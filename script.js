let clickCount = 0;
const maxShares = 5;

// Check if already submitted on page load
if (localStorage.getItem('techForGirls_submitted')) {
    disableForm();
    showSubmissionMessage();
}

// File upload handling
document.getElementById('screenshot').addEventListener('change', function (e) {
    const fileName = e.target.files[0]?.name || '';
    const fileNameElement = document.getElementById('fileName');
    if (fileName) {
        fileNameElement.textContent = `Selected: ${fileName}`;
        fileNameElement.style.display = 'block';
    } else {
        fileNameElement.style.display = 'none';
    }
});

// WhatsApp share button logic
document.getElementById('whatsappButton').addEventListener('click', function () {
    if (clickCount >= maxShares) {
        alert("You have already completed all required shares!");
        return;
    }

    clickCount++;
    updateClickCount();
    updateProgressBar();

    const message = "🚀 Hey! Join the Tech for Girls Community - Empowering women in technology! 👩\u200d💻✨ #TechForGirls #WomenInTech";
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    // Store progress in localStorage
    localStorage.setItem('techForGirls_shareCount', clickCount);

    if (clickCount === maxShares) {
        setTimeout(() => {
            alert("🎉 Excellent! You've completed all required shares. You can now submit your registration!");
            document.getElementById('whatsappButton').style.background = '#128c7e';
            document.getElementById('whatsappButton').innerHTML = '<i class="fas fa-check"></i> Sharing Complete!';
        }, 1000);
    }
});

// Load saved share count
const savedCount = localStorage.getItem('techForGirls_shareCount');
if (savedCount) {
    clickCount = parseInt(savedCount);
    updateClickCount();
    updateProgressBar();
    if (clickCount >= maxShares) {
        document.getElementById('whatsappButton').style.background = '#128c7e';
        document.getElementById('whatsappButton').innerHTML = '<i class="fas fa-check"></i> Sharing Complete!';
    }
}

// Update the counter text
function updateClickCount() {
    document.getElementById('shareCount').textContent = clickCount;
}

// Update progress bar
function updateProgressBar() {
    const percentage = (clickCount / maxShares) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
}

// Form submission logic
document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    if (clickCount < maxShares) {
        alert(`Please complete the sharing requirement (${clickCount}/${maxShares}) before submitting.`);
        return;
    }

    if (localStorage.getItem('techForGirls_submitted')) {
        alert("You have already submitted your registration.");
        return;
    }

    // Show loading
    document.getElementById('loading').classList.add('show');
    document.getElementById('submitButton').disabled = true;

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const college = document.getElementById('college').value;
    const screenshot = document.getElementById('screenshot').files[0];

    // Create URL with parameters (to avoid CORS)
    const params = new URLSearchParams({
        name: name,
        phone: phone,
        email: email,
        college: college,
        screenshot: screenshot ? screenshot.name : 'No file uploaded'
    });

    const url = `https://script.google.com/macros/s/AKfycbzps88wydRe9LZIOQ-VZDOhA_AX0eFUSUIO5UMHPSNAK3hIHOFvexswCaWOJrp1VdCkxg/exec?${params}`;

    // Use fetch with GET request to avoid CORS
    fetch(url, {
        method: 'GET',
        mode: 'cors'
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').classList.remove('show');

            if (data.success) {
                localStorage.setItem('techForGirls_submitted', 'true');
                localStorage.removeItem('techForGirls_shareCount');
                disableForm();
                showSubmissionMessage();
            } else {
                alert("There was an error submitting your registration. Please try again.");
                document.getElementById('submitButton').disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('loading').classList.remove('show');

            // Fallback: Create a hidden iframe to submit the form
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            // Assume success after 3 seconds
            setTimeout(() => {
                localStorage.setItem('techForGirls_submitted', 'true');
                localStorage.removeItem('techForGirls_shareCount');
                disableForm();
                showSubmissionMessage();
                document.body.removeChild(iframe);
            }, 3000);
        });
});

// Disable all inputs and buttons after submission
function disableForm() {
    document.querySelectorAll('input, button').forEach(el => {
        el.disabled = true;
    });
}

// Show the submission success message and hide form
function showSubmissionMessage() {
    document.getElementById('submissionMessage').classList.add('show');
    document.getElementById('registrationForm').style.display = 'none';
}

// Initialize progress bar
updateProgressBar();