
import { NextResponse, type NextRequest } from 'next/server';
import { posts } from '@/lib/data';

// GET a single post by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const postId = params.id;
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
}


// UPDATE a post by ID (e.g. for changing status)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const postId = params.id;
    const updatedData: { status: 'approved' | 'rejected', rejectionReason?: string } = await request.json();

    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update status and rejection reason
    posts[postIndex].status = updatedData.status;
    if (updatedData.status === 'rejected') {
        posts[postIndex].rejectionReason = updatedData.rejectionReason;
    } else {
        delete posts[postIndex].rejectionReason; // Remove reason if approved
    }
    
    console.log(`Updated post ${postId}:`, posts[postIndex]);

    return NextResponse.json(posts[postIndex]);
}
