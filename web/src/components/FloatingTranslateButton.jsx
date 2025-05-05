import { useEffect } from 'react';

const FloatingGTranslateButton = () => {
    useEffect(() => {
        // יצירת אלמנט הסקריפט
        const scriptSettings = document.createElement('script');
        scriptSettings.innerHTML = `
      window.gtranslateSettings = {
        "default_language": "iw",
        "native_language_names": true,
        "detect_browser_language": true,
        "languages": ["iw", "ar", "ru", "en"],
        "globe_color": "#66aaff",
        "wrapper_selector": ".gtranslate_wrapper",
        "flag_size": 32,
        "horizontal_position": "left",
        "vertical_position": "bottom"
      };
    `;
        document.body.appendChild(scriptSettings);

        const script = document.createElement('script');
        script.src = 'https://cdn.gtranslate.net/widgets/latest/globe.js';
        script.defer = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="gtranslate_wrapper"></div>
    );
};

export default FloatingGTranslateButton;