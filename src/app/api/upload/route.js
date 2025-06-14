import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      if (!file.size) {
        throw new Error('Invalid file');
      }

      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload to Cloudinary
      const result = await uploadToCloudinary(base64, 'gifts');
      
      return {
        url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        originalName: file.name,
      };
    });

    const uploadResults = await Promise.all(uploadPromises);

    return NextResponse.json({
      message: 'Images uploaded successfully',
      images: uploadResults,
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { public_id } = await request.json();
    
    if (!public_id) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const { deleteFromCloudinary } = await import('@/lib/cloudinary');
    await deleteFromCloudinary(public_id);

    return NextResponse.json({
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
