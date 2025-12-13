import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // ensure fs is available

export async function POST(req: Request){
  // Only allow write in development
  if (process.env.NODE_ENV === 'production'){
    return NextResponse.json({ error: 'Uploads are only allowed in development.' }, { status: 403 });
  }
  try{
    const form = await req.formData();
    const developer = String(form.get('developer') || '').trim();
    const slug = String(form.get('slug') || '').trim();
    const file = form.get('file') as File | null;

    if (!developer || !slug || !file){
      return NextResponse.json({ error: 'developer, slug, and file are required' }, { status: 400 });
    }

    // Validate developer and slug parameters to prevent path traversal
    const nameRegex = /^[a-z0-9-]+$/; // Allow lowercase letters, numbers, and hyphens
    if (!nameRegex.test(developer)){
      return NextResponse.json({ error: 'Invalid developer name. Only lowercase letters, numbers, and hyphens are allowed.' }, { status: 400 });
    }
    if (!nameRegex.test(slug)){
      return NextResponse.json({ error: 'Invalid slug. Only lowercase letters, numbers, and hyphens are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const content = Buffer.from(bytes).toString('utf-8');

    // Validate JSON
    let parsed: unknown;
    try{
      parsed = JSON.parse(content);
    }catch{
      return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 });
    }

    const BASE_DATA_DIR = path.join(process.cwd(), 'public', 'data');
    const destDir = path.join(BASE_DATA_DIR, developer);
    const destFile = path.join(destDir, `${slug}.json`);

    // Ensure the resolved path is within the intended base directory
    if (!destFile.startsWith(BASE_DATA_DIR)) {
      return NextResponse.json({ error: 'Attempted to write file outside of designated directory.' }, { status: 400 });
    }

    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(destFile, JSON.stringify(parsed, null, 2), 'utf-8');

    return NextResponse.json({ message: `Saved to ${destFile.replace(process.cwd(), '')}` });
  }catch(err: any){
    console.error('Upload error:', err);
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 });
  }
}