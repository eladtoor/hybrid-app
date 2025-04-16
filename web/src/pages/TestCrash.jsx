import React from "react";

const TestCrash = () => {
    throw new Error("💥 טסט: קריסת קומפוננטה מכוונת!");
};

export default TestCrash;
