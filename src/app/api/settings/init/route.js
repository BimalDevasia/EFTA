import { NextResponse } from 'next/server';
import { initializeSettings } from '@/lib/settingsHelper';

export async function POST() {
  try {
    const result = await initializeSettings();
    
    if (result.success) {
      return NextResponse.json({
        message: result.message
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initialize settings' },
      { status: 500 }
    );
  }
}
