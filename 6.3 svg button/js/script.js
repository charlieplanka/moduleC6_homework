const switchBtn = document.querySelector(".switch-btn");

switchBtn.addEventListener("click", () => {
    const icons = document.querySelectorAll(".svg-icon");
    for (let icon of icons) {
        icon.classList.toggle("invisible");
    }
})