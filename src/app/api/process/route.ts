import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const format = formData.get('format') as string;
        const quality = parseInt(formData.get('quality') as string) || 80;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let sharpInstance = sharp(buffer);
        let processedBuffer: Buffer;
        let contentType: string;

        switch (format) {
            case 'png':
                processedBuffer = await sharpInstance.png({ quality }).toBuffer();
                contentType = 'image/png';
                break;
            case 'webp':
                processedBuffer = await sharpInstance.webp({ quality }).toBuffer();
                contentType = 'image/webp';
                break;
            case 'jpg':
            case 'jpeg':
            default:
                processedBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
                contentType = 'image/jpeg';
                break;
        }

        return new NextResponse(processedBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Length': processedBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('Image processing error:', error);
        return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
        );
    }
}
