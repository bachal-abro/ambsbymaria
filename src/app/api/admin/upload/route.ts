import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

function isAuthorized(request: Request) {
    return request.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'admin123')
}

export async function POST(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File must be smaller than 5MB' }, { status: 400 })
        }

        const filename = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

        const blob = await put(filename, file, {
            access: 'public',
            contentType: file.type,
        })

        return NextResponse.json({ url: blob.url })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
