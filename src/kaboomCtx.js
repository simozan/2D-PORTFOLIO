// here is where we set up kaboom
import kaboom from "kaboom";
import { scaleFactor } from "./constants";


// to have cleaner code instead of import jaboom globally
export const k = kaboom(
    {
        global: false,
        //make the app working on mobile aswell. traslate on the phone
        touchToMouse: true,
        // we give to kaboom the canvas element
        canvas: document.getElementById("game"),
        debug: false, // set to false once ready for production

    }
)