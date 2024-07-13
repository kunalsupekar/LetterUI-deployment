import React, { useState, useEffect } from 'react';
import './main.css'; 
import { jsPDF } from 'jspdf';
import companyLogo from './Companylogo.png'; 

const Main = () => {
  const [fileContent, setFileContent] = useState('');
  const [placeholders, setPlaceholders] = useState([]);
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  const [allPlaceholdersFilledIn, setAllPlaceholdersFilledIn] = useState(false);

  useEffect(() => {
    const allFilled = placeholders.every((placeholder) => placeholderValues[placeholder]);
    setAllPlaceholdersFilledIn(allFilled);
  }, [placeholderValues, placeholders]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setFileContent(content);

      const regex = /{{([^{}]+)}}/g;
      const foundPlaceholders = content.match(regex);
      const uniquePlaceholders = foundPlaceholders ? [...new Set(foundPlaceholders.map((placeholder) => placeholder.replace(/[{}]/g, '')))] : [];
      setPlaceholders(uniquePlaceholders);

      const initialValues = {};
      uniquePlaceholders.forEach((placeholder) => {
        initialValues[placeholder] = '';
      });
      setPlaceholderValues(initialValues);
      setPreviewContent('');
    };
    reader.readAsText(file);
  };

  const handleInputChange = (e, placeholder) => {
    const value = e.target.value;
    setPlaceholderValues((prevValues) => ({ ...prevValues, [placeholder]: value }));
  };

  const updatePreviewContent = () => {
    let updatedContent = fileContent;
    Object.entries(placeholderValues).forEach(([placeholder, value]) => {
      const regex = new RegExp(`{{${placeholder}}}`, 'g');
      updatedContent = updatedContent.replace(regex, value);
    });
    setPreviewContent(updatedContent);
  };

  const downloadTemplate = () => {
    const doc = new jsPDF();
    const logoWidth = 200; 
    const logoHeight = 30; 
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logoX = (pageWidth - logoWidth) / 2; 
    const logoY = 10;
    const margin = 10;

    doc.addImage(companyLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);
    doc.setFontSize(13); 
    doc.setFont("Arial"); 

    let y = logoY + logoHeight + 15; 
    const lineHeight = 7;
    
    const lines = previewContent.split('\n');
    for (const line of lines) {
      const wrappedLines = doc.splitTextToSize(line, pageWidth - 2 * margin); 
      wrappedLines.forEach((wrappedLine) => {
        if (y > pageHeight - margin) { 
          doc.addPage();
          y = margin; 
        }
        doc.text(wrappedLine, margin, y);
        y += lineHeight;
      });
    }
    
    doc.save('template.pdf');
  };

  return (
    <div className="file-upload-container">
      <div className="header-container">
        <input type="file" onChange={handleFileChange} />
      </div>
      {fileContent && (
        <div className="content-container">
          <div className="placeholder-inputs">
            <h2 className="file-content">Enter Placeholder Values:</h2>
            <form>
              {placeholders.map((placeholder, index) => (
                <div key={index} className="placeholder-input">
                  <label htmlFor={placeholder}>{placeholder}</label>
                  <input
                    type="text"
                    id={placeholder}
                    value={placeholderValues[placeholder]}
                    onChange={(e) => handleInputChange(e, placeholder)}
                  />
                </div>
              ))}
            </form>
          </div>
          <div className="preview-actions">
            {allPlaceholdersFilledIn && (
              <>
                <button type="button" className="block" onClick={updatePreviewContent}>
                  Show Preview
                </button>
                {previewContent && (
                  <div>
                    <h2 className="file-content">Preview:</h2>
                    <div className="preview-content-container">
                      <pre>{previewContent}</pre>
                    </div>
                    <button type="button" className="block" onClick={downloadTemplate}>
                      Download Template
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;



