import { GameFlow } from "./module/Game";
import logo from "./public/logo.png"

import "../src/styles/winningPage.css"
import "../src/styles/gridStyles.css"
import "../src/styles/landingPage.css"
const image  = document.createElement("img");
image.src = logo;
image.classList.add("logo")


const header = document.querySelector("header")

header?.appendChild(image)
GameFlow




