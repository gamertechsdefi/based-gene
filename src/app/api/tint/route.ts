import { NextRequest, NextResponse } from 'next/server';
import {formidable} from 'formidable';
import {Jimp} from 'jimp';

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm();

  const [_, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });

  const file = Array.isArray(files.image) ? files.image[0] : files.image;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    const image = await Jimp.read(file.buffer);

    // Apply Base-inspired tint to foreground
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      if (this.bitmap.data[idx + 3] > 0) { // Non-transparent pixels
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        const tintColor = { r: 102, g: 212, b: 255 }; // Light blue #66D4FF
        const tintFactor = 0.2;

        this.bitmap.data[idx + 0] = Math.round(r * (1 - tintFactor) + tintColor.r * tintFactor);
        this.bitmap.data[idx + 1] = Math.round(g * (1 - tintFactor) + tintColor.g * tintFactor);
        this.bitmap.data[idx + 2] = Math.round(b * (1 - tintFactor) + tintColor.b * tintFactor);
      }
    });

    const outputBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    const base64Image = `data:image/png;base64,${outputBuffer.toString('base64')}`;

    return NextResponse.json({ processedImageUrl: base64Image });
  } catch (error) {
    console.error('Tinting failed:', error);
    return NextResponse.json(
      { error: 'Tinting failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}