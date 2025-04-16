import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: "" };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error, errorInfo) {
        console.error("🚨 Error Boundary Caught:", error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, errorMessage: "" });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-800 p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">משהו השתבש 😢</h1>
                    <p className="mb-4">{this.state.errorMessage}</p>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={this.handleReload}
                    >
                        רענן את הדף
                    </button>
                </div>
            );
        }

        return this.props.children;
    }

}

export default ErrorBoundary;

