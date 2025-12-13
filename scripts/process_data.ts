
import fs from 'fs-extra';
import path from 'path';
import slugify from 'slugify';

const DATA_DIR = path.join(process.cwd(), 'public/data');
// Output to public/developers so it persists during build and is copied to out/ by Next.js
const OUT_DIR = path.join(process.cwd(), 'public');
const ARCHIVE_DIR = path.join(process.cwd(), 'archive/ingested');
const REPORT_FILE = path.join(process.cwd(), 'report/merge_report.json');
const WHITELIST_FILE = path.join(process.cwd(), 'whitelist.json');

interface Report {
    timestamp: string;
    notes: any[];
    stats: any;
}

const report: Report = {
    timestamp: new Date().toISOString(),
    notes: [],
    stats: { processed: 0, errors: 0 }
};

async function loadWhitelist(): Promise<string[]> {
    if (await fs.pathExists(WHITELIST_FILE)) {
        const data = await fs.readJSON(WHITELIST_FILE);
        return data.approved_domains || [];
    }
    return [];
}


const WHITELIST_DOMAINS = [
    'sobharealty.com', 'sobha.com', 'sobha.cloud',
    'damacproperties.com',
    'nakheel.com',
    'binghatti.com',
    'properties.emaar.com', 'emaar.com'
];

function isValidMedia(url: string, whitelist: string[]): boolean {
    if (!url) return false;
    try {
        const u = new URL(url);
        const ext = path.extname(u.pathname).toLowerCase();
        // Policy: JPG/JPEG only for images (though migration allowed mp4 for hero, standard usually stricter)
        // Let's allow JPG/JPEG and MP4
        const allowedExt = ['.jpg', '.jpeg', '.mp4'].includes(ext);
        const domainAllowed = WHITELIST_DOMAINS.some(d => u.hostname.endsWith(d));
        return domainAllowed && allowedExt;
    } catch {
        return false;
    }
}


function generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
}

// Standard keys that should NOT go into 'extra'
const STANDARD_KEYS = [
    'name', 'description', 'media', 'hero_prefer', 'canonical_url',
    'units', 'location', 'slug', 'completion_date', 'community', 'developer', 'developer_slug', 'community_slug', 'type'
];

async function processEntity(filePath: string, type: 'community' | 'project', whitelist: string[], devName: string) {
    const content = await fs.readJSON(filePath);
    const filename = path.basename(filePath);

    // Generate Slug if missing
    let nameToSlug = content.name;
    if (typeof nameToSlug !== 'string') {
        nameToSlug = filename.replace('.json', '');
    }
    const slug = content.slug || generateSlug(nameToSlug);

    // Normalize developer name (use directory name as strict slug)
    const developerSlug = devName.toLowerCase();
    const developerName = content.developer || devName.charAt(0).toUpperCase() + devName.slice(1);

    const processed: any = {
        slug: slug,
        developer: developerName,
        developer_slug: developerSlug,
        type: type,
        extra: {}
    };

    // If project, handle community_slug
    if (type === 'project') {
        if (content.community) {
            processed.community = content.community;
            processed.community_slug = content.community_slug || generateSlug(content.community);
        } else {
            processed.community = null;
            processed.community_slug = null;
        }
    }

    const notes: string[] = [];

    // Validate Media
    if (Array.isArray(content.media)) {
        processed.media = content.media.filter((url: string) => {
            const valid = isValidMedia(url, whitelist);
            if (!valid) {
                notes.push(`تم استبعاد رابط وسائط غير مسموح: ${url}`);
            }
            return valid;
        });
    } else {
        processed.media = [];
    }

    // Hero Prefer
    if (content.hero_prefer && !['image', 'video'].includes(content.hero_prefer)) {
        notes.push(`قيمة hero_prefer غير صالحة '${content.hero_prefer}'، تم تعيين الافتراضي إلى image.`);
        processed.hero_prefer = 'image';
    } else {
        processed.hero_prefer = content.hero_prefer || 'image';
    }

    // Populate Standard Keys & Extra
    for (const [key, value] of Object.entries(content)) {
        if (STANDARD_KEYS.includes(key) || key === 'media' || key === 'slug') {
            // already handled or special logic above
            if (['units', 'location', 'completion_date', 'canonical_url', 'name', 'description'].includes(key)) {
                processed[key] = value;
            }
        } else {
            // Move to extra
            processed.extra[key] = value;
        }
    }

    // Specific Checks for Report
    if (!processed.name) notes.push(`الاسم مفقود في الملف ${filename}`);
    if (processed.extra.missing_trans) notes.push(`الترجمة مفقودة في ${filename}`);

    // Add notes to global report
    if (notes.length > 0) {
        report.notes.push({
            file: `${devName}/${type}/${filename}`,
            issues: notes
        });
    }

    return processed;
}

async function main() {
    console.log("...بدء معالجة البيانات");


    // Ensure output directories exist
    await fs.ensureDir(path.dirname(REPORT_FILE));

    // Check if DATA_DIR exists
    if (!await fs.pathExists(DATA_DIR)) {
        console.log("لم يتم العثور على مجلد البيانات. يرجى التأكد من وجود public/data");
        return;
    }

    const developers = await fs.readdir(DATA_DIR);

    for (const dev of developers) {
        const devPath = path.join(DATA_DIR, dev);
        if (!(await fs.stat(devPath)).isDirectory()) continue;

        console.log(`جاري معالجة المطور: ${dev}`);
        const outDevDir = path.join(OUT_DIR, 'developers', dev);
        await fs.ensureDir(outDevDir);

        const communities: any[] = [];
        const projects: any[] = [];

        // Process Communities
        const commDir = path.join(devPath, 'communities');
        if (await fs.pathExists(commDir)) {
            const files = await fs.readdir(commDir);
            for (const file of files) {
                if (!file.endsWith('.json')) continue;
                const data = await processEntity(path.join(commDir, file), 'community', [], dev);
                communities.push(data);
            }
        }

        // Process Projects
        const projDir = path.join(devPath, 'projects');
        if (await fs.pathExists(projDir)) {
            const files = await fs.readdir(projDir);
            for (const file of files) {
                if (!file.endsWith('.json')) continue;
                const data = await processEntity(path.join(projDir, file), 'project', [], dev);
                projects.push(data);
            }
        }

        // Write Outputs
        await fs.writeJSON(path.join(outDevDir, 'communities.json'), communities, { spaces: 2 });
        await fs.writeJSON(path.join(outDevDir, 'projects.json'), projects, { spaces: 2 });

        console.log(`تم حفظ ${communities.length} مجتمع و ${projects.length} مشروع للمطور ${dev}`);

        // Archive
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archiveDest = path.join(ARCHIVE_DIR, dev, timestamp);
        await fs.ensureDir(archiveDest);
        await fs.copy(devPath, archiveDest);
        // await fs.remove(devPath); // Consume the source - DISABLED to preserve source data
        console.log(`تم أرشفة البيانات المصدرية إلى ${archiveDest}`);
    }

    // Write Report
    await fs.writeJSON(REPORT_FILE, report, { spaces: 2 });
    console.log(`تم إنشاء التقرير في ${REPORT_FILE}`);
}

main().catch(console.error);
