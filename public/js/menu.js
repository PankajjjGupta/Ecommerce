const menuButton = document.getElementById("menu");
const rightSideMenu = document.getElementById("right_side_menu");
const cancelButton = document.getElementById("cancel_icon");
const shopMenuButton = document.getElementById("shop_submenu");
const shopSubmenuOptions = document.getElementsByClassName("shop_submenu_options")[0];

menuButton.addEventListener("click", (e) => {
    rightSideMenu.style.display = "inline-block"
})

cancelButton.addEventListener("click", (e) => {
    rightSideMenu.style.display = "none"
})

shopMenuButton.addEventListener("click", (e) => {
    console.log(shopSubmenuOptions)
    shopSubmenuOptions.classList.toggle("display-block")
})


window.addEventListener("resize", () => {
    if(window.innerWidth >= 1200) {
        // rightSideMenu.classList.toggle("display-none")
        if(rightSideMenu.style.display !== 'none') {
            rightSideMenu.style.display = "none";
        }
    }
})