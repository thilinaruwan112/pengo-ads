
import { NextResponse, type NextRequest } from 'next/server';
import { posts } from '@/lib/data';
import type { Post } from '@/types';

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


// UPDATE a post by ID (full or partial update)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const postId = params.id;
    const updatedData: Partial<Post> = await request.json();

    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Merge new data with existing data
    posts[postIndex] = { ...posts[postIndex], ...updatedData };

    // If status is changed to approved, clear rejection reason
    if (updatedData.status === 'approved') {
        delete posts[postIndex].rejectionReason;
    }
    
    console.log(`Updated post ${postId}:`, posts[postIndex]);

    return NextResponse.json(posts[postIndex]);
}

// DELETE a post by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const postId = params.id;
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // In a real app, you would delete this from a database.
    // Here we're just removing it from the in-memory array.
    posts.splice(postIndex, 1);

    console.log(`Deleted post ${postId}`);

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
}
