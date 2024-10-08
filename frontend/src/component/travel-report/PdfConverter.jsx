
const PdfConverter = () => {
	const contentRef = useRef(null);

	const convertToPdf = () => {
		const content = contentRef.current;

		const options = {
			filename: 'my-document.pdf',
			margin: 1,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: {
				unit: 'in',
				format: 'a4',
				orientation: 'portrait',
			},
		};

		html2pdf().set(options).from(content).save();
	};

	return (
		<div>
			<div ref={contentRef} className='w-full'>
				{/* Your HTML content that you want to convert to PDF */}
				<Heloo />
			</div>
			<button onClick={convertToPdf}>Convert to PDF</button>
		</div>
	);
};


const Heloo = () => {

	return (
		<div className=""><h1 className='tertiary'>Hello, PDF!</h1>
			<p>
				This is a simple example of HTML-to-PDF conversion using
				React and html2pdf.
			</p></div>
	)
}








// import { useRef } from 'react';

// import ReportTemplate from './ReportTemplate';

export const Pdf = () => {
	const reportTemplateRef = useRef(null);

	const handleGeneratePdf = async () => {
		const doc = new jsPDF({
			format: 'a4',
			unit: 'px',
		});

		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('document');
			},
		});
	};

	return (
		<div>
			<button className="button" onClick={handleGeneratePdf}>
				Generate PDF
			</button>
			<div ref={reportTemplateRef}>
				<ReportTemplate />
			</div>
		</div>
	);
}





