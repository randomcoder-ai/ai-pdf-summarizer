import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function extractTextFromPdf(file) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      try {
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ') + '\n\n';
        }
        resolve({ text: fullText, pageCount: pdf.numPages });
      } catch (error) {
        reject(error);
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
}

export function generatePdf(summaryText, style) {
  const doc = new jsPDF();
  const styles = getPdfStyles();
  const currentStyle = styles[style];
  let y = currentStyle.margins.top;

  const lines = summaryText.split('\n');

  lines.forEach(line => {
    if (y > (doc.internal.pageSize.height - currentStyle.margins.bottom)) {
      doc.addPage();
      y = currentStyle.margins.top;
    }

    let processedLine = line.trim();

    if (processedLine.startsWith('## ')) {
        doc.setFont(currentStyle.h2.font, 'bold');
        doc.setFontSize(currentStyle.h2.fontSize);
        doc.setTextColor(currentStyle.h2.color.r, currentStyle.h2.color.g, currentStyle.h2.color.b);
        const text = processedLine.substring(3);
        const splitText = doc.splitTextToSize(text, doc.internal.pageSize.width - currentStyle.margins.left - currentStyle.margins.right);
        doc.text(splitText, currentStyle.margins.left, y);
        y += (doc.getTextDimensions(splitText).h) + currentStyle.spacing.afterHeadline;
    } else if (processedLine.startsWith('### ')) {
        doc.setFont(currentStyle.h3.font, 'bold');
        doc.setFontSize(currentStyle.h3.fontSize);
        doc.setTextColor(currentStyle.h3.color.r, currentStyle.h3.color.g, currentStyle.h3.color.b);
        const text = processedLine.substring(4);
        const splitText = doc.splitTextToSize(text, doc.internal.pageSize.width - currentStyle.margins.left - currentStyle.margins.right);
        doc.text(splitText, currentStyle.margins.left, y);
        y += (doc.getTextDimensions(splitText).h) + currentStyle.spacing.afterSubheadline;
    
    } else if (processedLine.startsWith('* ') || processedLine.startsWith('- ')) {
        doc.setFont(currentStyle.body.font, 'normal');
        doc.setFontSize(currentStyle.body.fontSize);
        doc.setTextColor(currentStyle.body.color.r, currentStyle.body.color.g, currentStyle.body.color.b);
        
        // BUG FIX 2: Use a regular expression to robustly remove any leading bullet point characters.
        const text = processedLine.replace(/^[\s*-]+/, '').trim();
        
        const splitText = doc.splitTextToSize(text, doc.internal.pageSize.width - currentStyle.margins.left - currentStyle.margins.right - 8);
        
        doc.setFillColor(currentStyle.body.color.r, currentStyle.body.color.g, currentStyle.body.color.b);
        doc.circle(currentStyle.margins.left + 2, y - 1.5, 1, 'F');
        
        doc.text(splitText, currentStyle.margins.left + 8, y);
        
        y += (doc.getTextDimensions(splitText).h) + currentStyle.spacing.lineSpacing;

    } else if (processedLine) {
        doc.setFont(currentStyle.body.font, 'normal');
        doc.setFontSize(currentStyle.body.fontSize);
        doc.setTextColor(currentStyle.body.color.r, currentStyle.body.color.g, currentStyle.body.color.b);
        const splitText = doc.splitTextToSize(processedLine, doc.internal.pageSize.width - currentStyle.margins.left - currentStyle.margins.right);
        doc.text(splitText, currentStyle.margins.left, y);
        y += (doc.getTextDimensions(splitText).h) + currentStyle.spacing.lineSpacing;
    }
  });

  doc.save(`${style}_summary.pdf`);
}

function getPdfStyles() {
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Returns an object with predefined PDF styles. The keys of the object
 * are the style names, and the values are objects with the following
 * properties:
 * - margins: An object with top, right, bottom, and left properties
 *            specifying the page margins in points.
 * - spacing: An object with afterHeadline, afterSubheadline, and lineSpacing
 *            properties specifying the vertical spacing between elements
 *            in points.
 * - h2, h3, body: Objects with font, fontSize, and color properties
 *                 specifying the font, font size, and color of the
 *                 respective elements.
 *
 * @return {Object} An object with the predefined PDF styles.
 */

/*******  bb484f90-c1ba-45e3-a7d0-94953c008ac3  *******/    return {
        modern: {
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            spacing: { afterHeadline: 6, afterSubheadline: 4, lineSpacing: 4 },
            h2: { font: 'helvetica', fontSize: 18, color: { r: 44, g: 62, b: 80 } },
            h3: { font: 'helvetica', fontSize: 14, color: { r: 52, g: 73, b: 94 } },
            body: { font: 'helvetica', fontSize: 11, color: { r: 80, g: 80, b: 80 } },
        },
        academic: {
            margins: { top: 25, right: 25, bottom: 25, left: 25 },
            spacing: { afterHeadline: 8, afterSubheadline: 5, lineSpacing: 5 },
            h2: { font: 'times', fontSize: 16, color: { r: 0, g: 0, b: 0 } },
            h3: { font: 'times', fontSize: 14, color: { r: 0, g: 0, b: 0 } },
            body: { font: 'times', fontSize: 12, color: { r: 0, g: 0, b: 0 } },
        },
        minimalist: {
            margins: { top: 20, right: 25, bottom: 20, left: 25 },
            spacing: { afterHeadline: 10, afterSubheadline: 6, lineSpacing: 6 },
            h2: { font: 'helvetica', fontSize: 16, color: { r: 0, g: 0, b: 0 } },
            h3: { font: 'helvetica', fontSize: 12, color: { r: 50, g: 50, b: 50 } },
            body: { font: 'helvetica', fontSize: 10, color: { r: 80, g: 80, b: 80 } },
        }
    };
}
