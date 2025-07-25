import React, { useState } from 'react';
import ReactGA from "react-ga4";
import FileUpload from './components/FileUpload';
import ConfigurationScreen from './components/ConfigurationScreen';
import StyleSelectionScreen from './components/StyleSelectionScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { extractTextFromPdf } from './utils/pdf';
import { generateSummary } from './utils/gemini';
import './App.css';

function App() {
  const [appState, setAppState] = useState({
    currentStep: 'upload',
    originalPageCount: 0,
    extractedText: '',
    summaryText: '',
    isLoading: false,
    loadingMessage: '',
    error: null,
  });

  const [config, setConfig] = useState({
    summaryPages: 1,
    summaryFormat: 'paragraph',
  });

  const handleFileSelect = async (file) => {
    setAppState(prev => ({ ...prev, isLoading: true, loadingMessage: 'Reading PDF...', error: null }));
    try {
      const { text, pageCount } = await extractTextFromPdf(file);
      setAppState(prev => ({
        ...prev,
        originalPageCount: pageCount,
        extractedText: text,
        currentStep: 'configure',
        isLoading: false,
      }));
      setConfig(prev => ({ ...prev, summaryPages: Math.max(1, Math.floor(pageCount / 4)) }));
    } catch (error) {
      console.error("Error reading PDF:", error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        currentStep: 'upload',
        error: 'Could not read the PDF file. Please try another file.'
      }));
    }
  };

  const handleConfigSubmit = async () => {
    setAppState(prev => ({ ...prev, isLoading: true, loadingMessage: 'Generating summary with AI...', error: null }));
    try {
      const summary = await generateSummary(appState.extractedText, config);
      setAppState(prev => ({
        ...prev,
        summaryText: summary,
        currentStep: 'selectStyle',
        isLoading: false,
      }));

      // --- Send Custom Event to Google Analytics ---
      ReactGA.event({
        category: "User Interaction",
        action: "Generate Summary",
        label: `Format: ${config.summaryFormat}, Pages: ${config.summaryPages}`, // Optional: send config details
      });
      
    } catch (error) {
      console.error("The specific API error is:", error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        currentStep: 'configure',
        error: `Error: ${error.message}`
      }));
    }
  };

  const handleReset = () => {
    setAppState({
      currentStep: 'upload',
      originalPageCount: 0,
      extractedText: '',
      summaryText: '',
      isLoading: false,
      loadingMessage: '',
      error: null,
    });
    setConfig({
      summaryPages: 1,
      summaryFormat: 'paragraph',
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI PDF Summarizer Pro</h1>
        <p>Get a perfectly structured, styled summary of any PDF.</p>
      </header>

      {appState.currentStep !== 'upload' && (
        <button onClick={handleReset} className="reset-button">Start Over</button>
      )}

      <main>
        {appState.isLoading && <LoadingSpinner message={appState.loadingMessage} />}
        
        {!appState.isLoading && appState.currentStep === 'upload' && (
            <FileUpload onFileSelect={handleFileSelect} error={appState.error} />
        )}
        {!appState.isLoading && appState.currentStep === 'configure' && (
          <ConfigurationScreen
            pageCount={appState.originalPageCount}
            config={config}
            setConfig={setConfig}
            onSubmit={handleConfigSubmit}
            error={appState.error}
          />
        )}
        {!appState.isLoading && appState.currentStep === 'selectStyle' && (
          <StyleSelectionScreen summaryText={appState.summaryText} />
        )}
      </main>
    </div>
  );
}

export default App;
