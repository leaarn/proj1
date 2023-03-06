// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// const intro = document.querySelector("intro");
// // h1.innerHTML = h1.textContent.replace(/\S/g, "<span>$&</span>")

// // Support Space:
// intro.innerHTML = intro.textContent.replace(/\S/g, "<span>$&</span>").replace(/\s/g, "<span>&nbsp;</span>");

// let delay = 0;
// document.querySelectorAll("span").forEach((span, index) => {
//   delay += 0.1;

//   if (index === 45) delay += 0.3;

//   span.style.setProperty("--delay", `${delay}s`);
// });

// intro.addEventListener("animationend", (e) => {
//   if (e.target === document.querySelector("h1 span:last-child")) {
//     intro.classList.add("ended");
//   }
// });
