// ===== CONFIGURE YOUR LOTTERY START TIME =====
// Example: 10 Nov 2025, 6:00 PM
const lotteryStartTime = new Date("2025-10-06T00:05:00");

// ===== ELEMENT REFERENCES =====
const button = document.querySelector("button");
const lottoDiv = document.getElementById("lotto");

// ===== MAIN FUNCTION (triggered on button click) =====
function myFunction() {
    button.disabled = true;

    // Prevent re-generation if already saved
    if (localStorage.getItem("lotteryNumbers")) {
        displayNumbers(JSON.parse(localStorage.getItem("lotteryNumbers")));
        return;
    }

    // Generate 6 unique random numbers between 1 and 200
    let arr = [];
    while (arr.length < 6) {
        let r = Math.floor(Math.random() * 200) + 1;
        if (!arr.includes(r)) arr.push(r);
    }

    // Sort & save
    const sorted = arr.sort((a, b) => a - b);
    localStorage.setItem("lotteryNumbers", JSON.stringify(sorted));

    // Show results
    displayNumbers(sorted);
}

// ===== DISPLAY FUNCTION =====
function displayNumbers(numbers) {
    lottoDiv.innerHTML = ""; // clear old content
    numbers.forEach(num => {
        const circle = document.createElement("span");
        circle.className = "circle m-3";
        circle.textContent = num;
        lottoDiv.append(circle);
    });
}

// ===== COUNTDOWN TIMER FUNCTION =====
function startCountdown() {
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const distance = lotteryStartTime - now;

        if (distance <= 0) {
            clearInterval(countdownInterval);
            showReadyState();
            return;
        }

        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        lottoDiv.innerHTML = `
            <p class="text-center">
                ⏳ Lottery goes live in 
                <strong>${hours}h ${minutes}m ${seconds}s</strong>
            </p>
        `;
        button.disabled = true;
    }, 1000);
}

// ===== SHOW READY STATE OR EXISTING RESULTS =====
function showReadyState() {
    const savedNumbers = localStorage.getItem("lotteryNumbers");
    if (savedNumbers) {
        displayNumbers(JSON.parse(savedNumbers));
        button.disabled = true;
    } else {
        lottoDiv.innerHTML = `<p class="text-center">🎉 Lottery is live! Click above to reveal winners.</p>`;
        button.disabled = false;
    }
}

// ===== INITIAL PAGE LOGIC =====
window.onload = function() {
    const now = new Date();
    const savedNumbers = localStorage.getItem("lotteryNumbers");

    if (savedNumbers) {
        displayNumbers(JSON.parse(savedNumbers));
        button.disabled = true;
    } else if (now < lotteryStartTime) {
        startCountdown();
    } else {
        showReadyState();
    }
};
