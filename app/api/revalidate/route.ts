// app/api/revalidate/route.ts - On-demand ISR Revalidation API
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { PROJECT_CACHE_TAGS } from '@/lib/projects';

// Security: Add a secret token for revalidation
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'imperium-gate-revalidate-2024';

export async function POST(request: NextRequest) {
  try {
    // Verify the secret token
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '') ||
      request.nextUrl.searchParams.get('secret');

    if (providedSecret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, path, tag, developer, slug } = body;

    let revalidated: string[] = [];

    switch (type) {
      case 'all':
        // Revalidate all project-related caches
        try {
          await Promise.all([
            revalidateTag(PROJECT_CACHE_TAGS.ALL_PROJECTS),
            revalidateTag(PROJECT_CACHE_TAGS.DEVELOPERS),
            revalidateTag(PROJECT_CACHE_TAGS.PROJECT_BY_SLUG),
            revalidateTag(PROJECT_CACHE_TAGS.PROJECTS_BY_DEVELOPER)
          ]);
          revalidated = ['all-projects', 'developers', 'project-by-slug', 'projects-by-developer'];
        } catch (error) {
          console.error('Error revalidating tags:', error);
          revalidated = ['error-revalidating'];
        }
        break;

      case 'projects':
        // Revalidate all projects cache
        try {
          await revalidateTag(PROJECT_CACHE_TAGS.ALL_PROJECTS);
          revalidated = ['all-projects'];
        } catch (error) {
          console.error('Error revalidating projects:', error);
          revalidated = ['error-revalidating-projects'];
        }
        break;

      case 'developers':
        // Revalidate developers cache
        try {
          await revalidateTag(PROJECT_CACHE_TAGS.DEVELOPERS);
          revalidated = ['developers'];
        } catch (error) {
          console.error('Error revalidating developers:', error);
          revalidated = ['error-revalidating-developers'];
        }
        break;

      case 'project':
        // Revalidate specific project
        if (developer && slug) {
          try {
            await Promise.all([
              revalidateTag(PROJECT_CACHE_TAGS.PROJECT_BY_SLUG),
              revalidateTag(PROJECT_CACHE_TAGS.PROJECTS_BY_DEVELOPER)
            ]);
            revalidatePath(`/ar/projects/${developer}/${slug}`);
            revalidatePath(`/en/projects/${developer}/${slug}`);
            revalidated = [`project-${developer}-${slug}`, 'projects-by-developer'];
          } catch (error) {
            console.error('Error revalidating project:', error);
            revalidated = ['error-revalidating-project'];
          }
        } else {
          return NextResponse.json(
            { error: 'Developer and slug required for project revalidation' },
            { status: 400 }
          );
        }
        break;

      case 'developer':
        // Revalidate specific developer's projects
        if (developer) {
          try {
            await revalidateTag(PROJECT_CACHE_TAGS.PROJECTS_BY_DEVELOPER);
            revalidatePath(`/ar/projects`);
            revalidatePath(`/en/projects`);
            revalidated = [`developer-${developer}`];
          } catch (error) {
            console.error('Error revalidating developer:', error);
            revalidated = ['error-revalidating-developer'];
          }
        } else {
          return NextResponse.json(
            { error: 'Developer required for developer revalidation' },
            { status: 400 }
          );
        }
        break;

      case 'path':
        // Revalidate specific path
        if (path) {
          revalidatePath(path);
          revalidated = [path];
        } else {
          return NextResponse.json(
            { error: 'Path required for path revalidation' },
            { status: 400 }
          );
        }
        break;

      case 'tag':
        // Revalidate specific tag
        if (tag) {
          try {
            await revalidateTag(tag);
            revalidated = [tag];
          } catch (error) {
            console.error('Error revalidating tag:', error);
            revalidated = ['error-revalidating-tag'];
          }
        } else {
          return NextResponse.json(
            { error: 'Tag required for tag revalidation' },
            { status: 400 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid revalidation type. Use: all, projects, developers, project, developer, path, or tag' },
          { status: 400 }
        );
    }

    console.log(`🔄 ISR Revalidation completed for: ${revalidated.join(', ')}`);

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
      type
    });

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during revalidation' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Imperium Gate ISR Revalidation API',
    endpoints: {
      POST: '/api/revalidate',
      types: ['all', 'projects', 'developers', 'project', 'developer', 'path', 'tag']
    },
    timestamp: new Date().toISOString()
  });
}