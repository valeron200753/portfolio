const contactButton = document.querySelector("#contactButton");

contactButton.addEventListener("click", function () {
    document.querySelector("#contact").scrollIntoView({
        behavior: "smooth"
    });
});