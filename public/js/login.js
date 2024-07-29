function togglePassword(){
    const pswdField = document.getElementById("pswd");
    const toggleIcon = document.getElementById("toggle-icon");

    if(pswdField.type === "password"){
        pswdField.type = "text";
        toggleIcon.src = "/images/eye-solid.svg";
    } else {
        pswdField.type = "password";
        toggleIcon.src = "/images/eye-slash-solid.svg";
    }
}

function animateArrow() {
    const arrowIcon = document.getElementById("arrow-icon");
    
    // Add the animation class to the arrow icon
    arrowIcon.classList.add("animate-right");
    
    // Wait for the animation to complete before submitting the form
    setTimeout(() => {
        // Submit the form
        document.getElementById("loginForm").submit();
    }, 500); // Duration should match the CSS transition time
}