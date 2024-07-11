// import React, { useState, useEffect } from 'react';
// import './main.css'; 
// import { jsPDF } from 'jspdf';
// import companyLogo from './Companylogo.png'; 

// const Main = () => {
//   const [fileContent, setFileContent] = useState('');
//   const [placeholders, setPlaceholders] = useState([]);
//   const [placeholderValues, setPlaceholderValues] = useState({});
//   const [previewContent, setPreviewContent] = useState('');
//   const [allPlaceholdersFilledIn, setAllPlaceholdersFilledIn] = useState(false);

//   useEffect(() => {
//     const allFilled = placeholders.every((placeholder) => placeholderValues[placeholder]);
//     setAllPlaceholdersFilledIn(allFilled);
//   }, [placeholderValues, placeholders]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = event.target.result;
//       setFileContent(content);

//       const regex = /{{([^{}]+)}}/g;
//       const foundPlaceholders = content.match(regex);
//       const uniquePlaceholders = foundPlaceholders ? [...new Set(foundPlaceholders.map((placeholder) => placeholder.replace(/[{}]/g, '')))] : [];
//       setPlaceholders(uniquePlaceholders);

//       const initialValues = {};
//       uniquePlaceholders.forEach((placeholder) => {
//         initialValues[placeholder] = '';
//       });
//       setPlaceholderValues(initialValues);
//       setPreviewContent('');
//     };
//     reader.readAsText(file);
//   };

//   const handleInputChange = (e, placeholder) => {
//     const value = e.target.value;
//     setPlaceholderValues((prevValues) => ({ ...prevValues, [placeholder]: value }));
//   };

//   const updatePreviewContent = () => {
//     let updatedContent = fileContent;
//     Object.entries(placeholderValues).forEach(([placeholder, value]) => {
//       const regex = new RegExp(`{{${placeholder}}}`, 'g');
//       updatedContent = updatedContent.replace(regex, value);
//     });
//     setPreviewContent(updatedContent);
//   };

//   const downloadTemplate = () => {
//     const doc = new jsPDF();
//     const logoWidth = 200; 
//     const logoHeight = 30; 
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const logoX = (pageWidth - logoWidth) / 2; 
//     const logoY = 10;
//     const margin = 10;

//     doc.addImage(companyLogo, 'PNG', logoX, logoY, logoWidth, logoHeight);
//     doc.setFontSize(13); 
//     doc.setFont("Arial"); 

//     let y = logoY + logoHeight + 15; 
//     const lineHeight = 7;
    
//     const lines = previewContent.split('\n');
//     for (const line of lines) {
//       const wrappedLines = doc.splitTextToSize(line, pageWidth - 2 * margin); 
//       wrappedLines.forEach((wrappedLine) => {
//         if (y > pageHeight - margin) { 
//           doc.addPage();
//           y = margin; 
//         }
//         doc.text(wrappedLine, margin, y);
//         y += lineHeight;
//       });
//     }
    
//     doc.save('template.pdf');
//   };

//   return (
//     <div className="file-upload-container">
//       <div className="header-container">
//         <input type="file" onChange={handleFileChange} />
//       </div>
//       {fileContent && (
//         <div className="content-container">
//           <div className="placeholder-inputs">
//             <h2 className="file-content">Enter Placeholder Values:</h2>
//             <form>
//               {placeholders.map((placeholder, index) => (
//                 <div key={index} className="placeholder-input">
//                   <label htmlFor={placeholder}>{placeholder}</label>
//                   <input
//                     type="text"
//                     id={placeholder}
//                     value={placeholderValues[placeholder]}
//                     onChange={(e) => handleInputChange(e, placeholder)}
//                   />
//                 </div>
//               ))}
//             </form>
//           </div>
//           <div className="preview-actions">
//             {allPlaceholdersFilledIn && (
//               <>
//                 <button type="button" className="block" onClick={updatePreviewContent}>
//                   Show Preview
//                 </button>
//                 {previewContent && (
//                   <div>
//                     <h2 className="file-content">Preview:</h2>
//                     <div className="preview-content-container">
//                       <pre>{previewContent}</pre>
//                     </div>
//                     <button type="button" className="block" onClick={downloadTemplate}>
//                       Download Template
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Main;


import React, { useState, useEffect } from 'react';
import './main.css'; 
import { jsPDF } from 'jspdf';
import emailjs from '@emailjs/browser';
import companyLogo from './Companylogo.png'; 

emailjs.init('YOUR_USER_ID'); // Replace with your EmailJS user ID

const Main = () => {
  const [fileContent, setFileContent] = useState('');
  const [placeholders, setPlaceholders] = useState([]);
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  const [allPlaceholdersFilledIn, setAllPlaceholdersFilledIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const allFilled = placeholders.every((placeholder) => placeholderValues[placeholder]);
    setAllPlaceholdersFilledIn(allFilled);
  }, [placeholderValues, placeholders]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    }
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

  const sendTemplate = () => {
    if (!email) {
      alert("Please enter the HR's email address.");
      return;
    }

    const internEmail = prompt("Please enter the intern's email address:");
    if (!internEmail) {
      alert("Intern's email address is required.");
      return;
    }

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

    const pdfBlob = doc.output('blob');

    const formData = new FormData();
    formData.append('email', internEmail);
    formData.append('file', pdfBlob, 'template.pdf');

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      email: internEmail,
      file: pdfBlob
    }, 'YOUR_USER_ID')
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      alert('Email sent successfully!');
    }, (error) => {
      console.log('FAILED...', error);
      alert('Failed to send email.');
    });
  };

  return (
    <div className="App">
      <h1>Upload File and Fill Placeholders</h1>
      <input type="file" onChange={handleFileChange} />
      {fileContent && (
        <>
          <div>
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
              <div className="placeholder-input">
                <label htmlFor="email">HR Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter HR's email address"
                />
              </div>
            </form>
          </div>
          <button type="button" className="block" onClick={updatePreviewContent}>
            Update Preview
          </button>
          <button type="button" className="block" onClick={downloadTemplate}>
            Download Template
          </button>
          <button type="button" className="block" onClick={sendTemplate}>
            Send
          </button>
          <div className="preview-content">
            <h2>Preview:</h2>
            <pre>{previewContent}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default Main;
