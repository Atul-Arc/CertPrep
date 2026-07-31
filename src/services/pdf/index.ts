// @ts-ignore: no dedicated types for legacy build
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
// ?url resolves to a proper server path so pdfjs can spawn its own worker correctly
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export async function extractTextFromPdf(file: File): Promise<{ text: string; pageCount: number }> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  console.log('[pdfWorker] PDF loaded, pages:', pdf.numPages)
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    // filter out TextMarkedContent items which have no .str
    const pageText = content.items
      .filter((it: any) => typeof it.str === 'string')
      .map((it: any) => it.str)
      .join(' ')
    fullText += `\n\n--- Page ${i} ---\n\n` + pageText
  }
  const text = fullText.trim()
  console.log('[pdfWorker] Extraction complete, chars:', text.length)
  return { text, pageCount: pdf.numPages }
}

