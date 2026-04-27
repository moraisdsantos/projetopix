import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { ParsedPixReceipt } from '../types'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export async function extractPixReceiptFromPdf(file: File): Promise<ParsedPixReceipt> {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Selecione um comprovante em formato PDF.')
  }

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pagesText: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join('\n')
    pagesText.push(pageText)
  }

  const rawText = normalizeText(pagesText.join('\n'))
  const receipt = parseBradescoPixReceipt(rawText)

  return {
    ...receipt,
    rawText,
  }
}

function parseBradescoPixReceipt(text: string): Omit<ParsedPixReceipt, 'rawText'> {
  const value = parseValue(text)
  const date = parseDate(text)
  const recipient = parseRecipient(text)
  const controlNumber = parseControlNumber(text)

  const missing: string[] = []
  if (!Number.isFinite(value) || value <= 0) missing.push('valor')
  if (!date) missing.push('data do débito')
  if (!recipient) missing.push('destinatário')

  if (missing.length > 0) {
    throw new Error(`Não consegui ler ${missing.join(', ')} no PDF. Verifique se o arquivo segue o modelo do comprovante Bradesco.`)
  }

  return {
    value,
    date,
    recipient,
    controlNumber,
  }
}

function normalizeText(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function parseValue(text: string): number {
  const candidates = [...text.matchAll(/Valor:\s*R\$\s*([\d.]+,\d{2})/gi)]
  const valueText = candidates.at(-1)?.[1] ?? text.match(/R\$\s*([\d.]+,\d{2})/i)?.[1]
  if (!valueText) return 0
  return Number(valueText.replace(/\./g, '').replace(',', '.'))
}

function parseDate(text: string): string {
  const match = text.match(/Data do débito:\s*(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2}):(\d{2})(?::(\d{2}))?/i)
    ?? text.match(/(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2}):(\d{2})(?::(\d{2}))?/i)

  if (!match) return ''

  const [, day, month, year, hour, minute, second = '00'] = match
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`
}

function parseRecipient(text: string): string {
  const block = text.match(/Dados de quem recebeu\s+Nome:\s*([^\n]+)(?:\n|$)/i)
  if (block?.[1]) return toTitleCase(block[1].trim())

  const generic = text.match(/Nome:\s*([^\n]+)(?:\n|$)/i)
  if (generic?.[1]) return toTitleCase(generic[1].trim())

  return ''
}

function parseControlNumber(text: string): string | undefined {
  const match = text.match(/Número de Controle:\s*([^\n]+)/i)
  return match?.[1]?.trim()
}

function toTitleCase(value: string): string {
  return value
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|\s|\b)([a-zà-ú])/g, (part) => part.toLocaleUpperCase('pt-BR'))
    .replace(/\b(Da|De|Do|Das|Dos|E)\b/g, (part) => part.toLocaleLowerCase('pt-BR'))
}
