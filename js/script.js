const checkbox = document.getElementById("checkbox");
let currentTheme = localStorage.getItem('theme') || 'light';
document.body.className = currentTheme;
checkbox.checked = (currentTheme === 'dark');

const body = document.body;
const bodyStyle = body.style;
const ball = document.querySelector('.checkbox-label .ball');
const ballStyle = ball.style;
const occupation = document.getElementById('occupation');

if (checkbox.checked === true) {
    ballStyle.transform = 'translateX(24px)';
    occupation.textContent = "MS Student";
} else {
    ballStyle.transform = 'translateX(0)';
    occupation.textContent = "Researcher";
}

function changeTheme() {
    bodyStyle.transition = "background 0.2s linear";
    ballStyle.transition = "transform 0.2s linear";
    if (currentTheme === 'dark') {
        ballStyle.transform = "translateX(24px)";
    } else {
        ballStyle.transform = "translateX(0)";
    }
}

function changeOccupation() {
    if (currentTheme === 'dark') {
        occupation.textContent = "MS Student";
    } else {
        occupation.textContent = "Researcher";
    }
}

checkbox.addEventListener('change', function () {
    if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'light';
    }
    document.body.className = currentTheme;
    localStorage.setItem('theme', currentTheme);
    changeTheme();
    changeOccupation();
});
