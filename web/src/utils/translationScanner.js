import { saveTranslation } from "../i18n";

const scanAndSaveTranslations = async (lang) => {
    const elements = document.querySelectorAll("*:not(script):not(style)");

    for (const element of elements) {
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) { // לבדוק שזה טקסט
            const text = element.innerText.trim();
            if (text && !i18n.exists(text, lang)) {
                await saveTranslation(text, text, lang); // שומר את המקור
            }
        }
    }
};

export default scanAndSaveTranslations;
