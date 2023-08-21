window.onload = function(){
    var aboutBox = document.getElementById('about-box');
    var nameBox = document.getElementById('name-box');
    var contactBox = document.getElementById('contact-box');

    var adjustBoxWidth = function() {
        var newWidth = getComputedStyle(aboutBox).height;
        aboutBox.style.width = newWidth;
        nameBox.style.width = newWidth;
        contactBox.style.width = newWidth;
    }
    adjustBoxWidth();

    // Modify width on window resize
    window.addEventListener("resize", adjustBoxWidth);
}
