import React from 'react';

const DeliveryDays = () => {
    const deliveryData = [
        { area: 'אילת', days: 'ראשון, שלישי, חמישי' },
        { area: 'טבריה', days: 'שני, רביעי, שישי' },
        { area: 'קרית שמונה (גוש חלב)', days: 'שלישי, שישי' },
        { area: 'עפולה / נצרת / שפרעם', days: 'שני עד שישי' },
        { area: 'בית שאן והעמקים', days: 'שני, רביעי, שישי' },
        { area: 'חיפה', days: 'ראשון עד חמישי' },
        { area: 'חיפה והקריות', days: 'ראשון עד חמישי' },
        { area: 'אריאל / ברקן / בית שמש', days: 'ראשון, שלישי, חמישי' },
        { area: 'גוש עציון', days: 'ראשון, רביעי' },
        { area: 'שאר הארץ', days: 'ראשון עד חמישי' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 pt-40 pb-20">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 border-b-2 border-red-600 inline-block pb-2 font-serif">ימי חלוקה - טמבור</h1>
            <div className="bg-gray-50 rounded-lg shadow-md p-6">
                <p className="text-lg text-gray-700 mb-6 text-center font-sans">
                    הזמנות שיוזמנו עד השעה 15:00 יסופקו ביום שלמחרת בהתאם לימי אספקה ובכפוף לזמינות מלאי, לרשימת הזמנות קודמות ובימי עבודה עסקיים.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-right text-gray-700 font-sans">אזור</th>
                                <th className="py-3 px-4 text-right text-gray-700 font-sans">ימי חלוקה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryData.map((item, index) => (
                                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-right font-sans">{item.area}</td>
                                    <td className="py-3 px-4 text-right font-sans">{item.days}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDays;
