import { toPng } from 'html-to-image';

export async function exportTestimonialToPDF(
    element: HTMLDivElement,
    fileName: string
): Promise<void> {
    try {
        // Dynamic import to avoid build issues
        // @ts-ignore - jsPDF will be installed at runtime
        const { jsPDF } = await import('jspdf');

        // Convert element to image
        const dataUrl = await toPng(element, {
            cacheBust: true,
            backgroundColor: '#ffffff',
            pixelRatio: 2,
        });

        // Calculate dimensions
        const img = new Image();
        img.src = dataUrl;

        await new Promise((resolve) => {
            img.onload = resolve;
        });

        const imgWidth = 210 - 20; // A4 width minus margins
        const imgHeight = (img.height * imgWidth) / img.width;

        let heightLeft = imgHeight;
        let position = 10; // Top margin

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = 297 - 20; // A4 height minus margins

        // Add image to PDF
        pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save PDF
        pdf.save(fileName);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
}
