import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const ranges = JSON.parse(formData.get('ranges') as string);

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();

    const results = [];

    for (const range of ranges) {
      const newPdfDoc = await PDFDocument.create();
      const [start, end] = range.includes('-') 
        ? range.split('-').map(Number)
        : [Number(range), Number(range)];

      const pageIndices = [];
      for (let i = start - 1; i < Math.min(end, totalPages); i++) {
        pageIndices.push(i);
      }

      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();
      results.push({
        name: `${file.name.replace('.pdf', '')}_pages_${range}.pdf`,
        data: Array.from(pdfBytes)
      });
    }

    return NextResponse.json({ files: results });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to split PDF' }, { status: 500 });
  }
}