import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

export async function POST(req: NextRequest) {
    // Dynamically import Jimp as an ES module
    const Jimp = (await import('jimp')).default;

    try {
        const form = await req.formData();
        const file = form.get('image') as File | null;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const projectType = (form.get('projectType') as string) || 'base';
        const backgroundChoice = (form.get('backgroundChoice') as string) || 'background1.png';

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Step 1: Remove background using Remove.bg API
        const removeBgForm = new FormData();
        removeBgForm.append('image_file', fileBuffer, file.name || 'image.png');
        removeBgForm.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.REMOVEBG_API_KEY as string,
            },
            body: removeBgForm as any,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Remove.bg API failed: ${errorText}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        // Step 2: Load the image with transparent background
        const image = await Jimp.read(buffer);

        // Step 3: Load the background from the public folder
        const backgroundPath = join(process.cwd(), 'public', 'assets', projectType, backgroundChoice);
        let backgroundBuffer: Buffer;

        try {
            backgroundBuffer = await readFile(backgroundPath);
        } catch (err) {
            throw new Error(`Failed to read background image at ${backgroundPath}: ${(err as Error).message}`);
        }

        const background = await Jimp.read(backgroundBuffer);

        // Resize background to match image dimensions
        background.resize(image.bitmap.width, image.bitmap.height);

        // Step 4: Composite the image over the background
        background.composite(image, 0, 0);

        // Step 5: Convert to base64 and return
        const outputBuffer = await background.getBufferAsync(Jimp.MIME_PNG);
        const base64Image = `data:image/png;base64,${outputBuffer.toString('base64')}`;
        return NextResponse.json({ processedImageUrl: base64Image });
    } catch (error) {
        console.error('Image processing failed:', error);
        return NextResponse.json(
            { error: 'Image processing failed', details: (error as Error).message },
            { status: 500 }
        );
    }
}