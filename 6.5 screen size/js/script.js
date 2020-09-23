const screenSizeBtn = document.querySelector(".switch-btn");

screenSizeBtn.addEventListener("click", () => {
    alert(`Your screen size is ${window.screen.width} x ${window.screen.height}.`);
})