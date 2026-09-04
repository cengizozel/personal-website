// Opens and closes the dated update popovers on annotated text.
document.addEventListener('click', function (event) {
    const target = event.target.closest('.annotated');
    document.querySelectorAll('.annotated.open').forEach((el) => {
        if (el !== target) el.classList.remove('open');
    });
    if (target && !event.target.closest('.annotation')) {
        target.classList.toggle('open');
    }
});
