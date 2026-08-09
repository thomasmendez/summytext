// Placeholder: PDF-to-text extraction is intentionally disabled pending a
// security audit of the PDF parsing path (the original used pdfjs-dist, which
// carried a high-severity CVE for JS execution in a malicious PDF). See the
// original implementation in `frontend/` before re-enabling.
const PdfToTextButton = () => {
  return (
    <button
      type="button"
      disabled
      title="PDF to Text is temporarily disabled pending a security review"
      className="flex-1 cursor-not-allowed rounded-md bg-blue-600 px-4 py-2 font-medium text-white opacity-50"
    >
      PDF to Text
    </button>
  )
}

export default PdfToTextButton
