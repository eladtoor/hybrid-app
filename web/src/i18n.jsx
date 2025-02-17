import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
    .use(Backend) // מאפשר טעינה של תרגומים מקובץ JSON
    .use(LanguageDetector) // מזהה אוטומטית שפה מהדפדפן או מהאחסון המקומי
    .use(initReactI18next)
    .init({
        fallbackLng: "he", // ברירת מחדל לעברית
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"], // ניסיון לקחת מהאחסון, ואם אין אז מהדפדפן
            caches: ["localStorage"], // שמירת השפה שנבחרה
        },
        resources: {
            en: {
                translation: {
                    welcome: "Welcome",
                    search: "Search",
                    profile: "My Profile",
                    logout: "Logout",
                    categories: "Categories",
                    cart: "Cart",
                    checkout: "Checkout",
                    language: "English",
                },
            },
            he: {
                translation: {
                    welcome: "ברוך הבא",
                    search: "חיפוש",
                    profile: "הפרופיל שלי",
                    logout: "התנתק",
                    categories: "קטגוריות",
                    cart: "עגלה",
                    checkout: "לתשלום",
                    language: "עברית",
                },
            },
        },
    });

export default i18n;
