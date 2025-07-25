import React from 'react';
import { generatePdf } from '../utils/pdf';

function StyleSelectionScreen({ summaryText }) {
  return (
    <div className="style-selection-container">
      <div className="summary-preview">
        <h3>Generated Summary Preview</h3>
        <pre>{summaryText}</pre>
      </div>
      <div className="style-selector-container">
        <h2>Choose Your PDF Style</h2>
        <div className="style-options">
          <div className="style-card" onClick={() => generatePdf(summaryText, 'modern')}>
            <h3>Modern</h3>
            <p>Sleek and vibrant. Perfect for presentations.</p>
          </div>
          <div className="style-card" onClick={() => generatePdf(summaryText, 'academic')}>
            <h3>Academic</h3>
            <p>Classic and formal. Ideal for reports.</p>
          </div>
          <div className="style-card" onClick={() => generatePdf(summaryText, 'minimalist')}>
            <h3>Minimalist</h3>
            <p>Clean and simple. Great for clarity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StyleSelectionScreen;
