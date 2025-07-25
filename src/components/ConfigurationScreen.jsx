import React from 'react';

function ConfigurationScreen({ pageCount, config, setConfig, onSubmit, error }) {
  const maxPages = Math.max(1, Math.ceil(pageCount / 2));

  return (
    <div className="config-container">
      <h2>Configure Your Summary</h2>
      
      {/* Display the error message if it exists */}
      {error && <div className="error-message">{error}</div>}

      <div className="config-option">
        <label htmlFor="pages">Summary Length: {config.summaryPages} page(s)</label>
        <input
          type="range"
          id="pages"
          min="1"
          max={maxPages}
          value={config.summaryPages}
          onChange={(e) => setConfig(prev => ({ ...prev, summaryPages: Number(e.target.value) }))}
          className="slider"
        />
        <div className="slider-labels">
          <span>1</span>
          <span>{maxPages}</span>
        </div>
      </div>
      <div className="config-option">
        <label>Format</label>
        <div className="format-buttons">
          <button
            className={config.summaryFormat === 'paragraph' ? 'active' : ''}
            onClick={() => setConfig(prev => ({ ...prev, summaryFormat: 'paragraph' }))}
          >
            Paragraphs
          </button>
          <button
            className={config.summaryFormat === 'bullets' ? 'active' : ''}
            onClick={() => setConfig(prev => ({ ...prev, summaryFormat: 'bullets' }))}
          >
            Bullet Points
          </button>
        </div>
      </div>
      <button onClick={onSubmit} className="submit-button">Generate Summary</button>
    </div>
  );
}

export default ConfigurationScreen;
