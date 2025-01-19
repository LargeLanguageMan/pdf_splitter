import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs-extra';
import * as path from 'path';

async function splitPDF(inputPath: string, outputDirectory: string): Promise<void> {
    try {
        // Read the PDF file
        const pdfBytes = await fs.readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const numberOfPages = pdfDoc.getPageCount();

        // Create output directory if it doesn't exist
        await fs.ensureDir(outputDirectory);

        // Split each page into a separate PDF
        for (let i = 0; i < numberOfPages; i++) {
            // Create a new document
            const newPdfDoc = await PDFDocument.create();

            // Copy the page from the original document
            const [page] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.addPage(page);

            // Save the new document
            const newPdfBytes = await newPdfDoc.save();
            const outputPath = path.join(outputDirectory, `page_${i + 1}.pdf`);
            await fs.writeFile(outputPath, newPdfBytes);
        }

        console.log(`Successfully split PDF into ${numberOfPages} pages`);
    } catch (error) {
        console.error('Error splitting PDF:', error);
        throw error;
    }
}

// Example usage
const inputPath = './pdf_main.pdf';
const outputDirectory = './pdf_output';

splitPDF(inputPath, outputDirectory)
    .then(() => console.log('PDF splitting completed'))
    .catch(error => console.error('Failed to split PDF:', error));
