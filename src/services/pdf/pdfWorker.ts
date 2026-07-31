// Runs in a Web Worker — extracts text from a PDF ArrayBuffer using pdfjs-dist
// @ts-ignore: no types in this env
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

// Absolute path so pdfjs can resolve the nested worker from inside a blob-URL worker context
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'

self.addEventListener('message', async (evt: MessageEvent) => {
  const { buffer } = evt.data as { buffer: ArrayBuffer }
  try {
    console.log('[pdfWorker] Received buffer, size:', buffer.byteLength)
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
    console.log('[pdfWorker] PDF loaded, pages:', pdf.numPages)
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      // filter out TextMarkedContent items which have no .str
      const pageText = content.items.filter((it: any) => typeof it.str === 'string').map((it: any) => it.str).join(' ')
      fullText += `\n\n--- Page ${i} ---\n\n` + pageText
    }
    const result = fullText.trim()
    console.log('[pdfWorker] Extraction complete, chars:', result.length)
    ;(self as any).postMessage({ text: result, pageCount: pdf.numPages })
  } catch (err: any) {
    console.error('[pdfWorker] Error:', err)
    ;(self as any).postMessage({ error: err?.message ?? String(err) })
  }
})
