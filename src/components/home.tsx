import React, { useState } from "react";
import Header from "./layout/Header";
import ModuleSelector from "./layout/ModuleSelector";
import CSVUploader from "./csv-uploader/CSVUploader";
import ScoringTool from "./scoring-tool/ScoringTool";

type ActiveModule = "selector" | "csv-uploader" | "scoring-tool";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeModule, setActiveModule] = useState<ActiveModule>("selector");

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would apply the theme change to the document here
    // For example: document.documentElement.classList.toggle('dark');
  };

  const handleModuleSelect = (module: "csv-uploader" | "scoring-tool") => {
    setActiveModule(module);
  };

  const handleReturnToSelector = () => {
    setActiveModule("selector");
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case "csv-uploader":
        return <CSVUploader onCancel={handleReturnToSelector} />;
      case "scoring-tool":
        return <ScoringTool />;
      case "selector":
      default:
        return <ModuleSelector onSelectModule={handleModuleSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header
        title="CSV Uploader & Scoring System"
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
      />

      <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center">
        {activeModule !== "selector" && (
          <div className="w-full max-w-7xl mb-6">
            <button
              onClick={handleReturnToSelector}
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              ← Return to module selection
            </button>
          </div>
        )}

        {renderActiveModule()}
      </main>

      <footer className="py-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>CSV Uploader & Scoring System © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;
