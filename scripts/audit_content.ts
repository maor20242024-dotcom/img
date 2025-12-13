
import fs from 'fs';
import path from 'path';

// Types for our audit
interface AuditResult {
    developer: string;
    slug: string;
    name: string;
    missing: string[];
    hasBrochure: boolean;
    has3D: boolean;
    hasPrice: boolean;
    hasImages: boolean;
    dataCompleteness: number; // 0-100
}

const DATA_ROOT = path.join(process.cwd(), 'public', 'data');

function scanProjects(): AuditResult[] {
    const results: AuditResult[] = [];

    if (!fs.existsSync(DATA_ROOT)) {
        console.error('Data root not found:', DATA_ROOT);
        return [];
    }

    const developers = fs.readdirSync(DATA_ROOT).filter(f => !f.startsWith('.'));

    for (const dev of developers) {
        const devDir = path.join(DATA_ROOT, dev);
        if (!fs.statSync(devDir).isDirectory()) continue;

        // Check for projects/ subdir
        const projectsDir = path.join(devDir, 'projects');
        if (!fs.existsSync(projectsDir)) continue;

        const projects = fs.readdirSync(projectsDir).filter(f => !f.startsWith('.'));

        for (const p of projects) {
            let projectData: any = {};
            const pPath = path.join(projectsDir, p);

            if (fs.statSync(pPath).isDirectory()) {
                // Try index.json
                const indexPath = path.join(pPath, 'index.json');
                if (fs.existsSync(indexPath)) {
                    projectData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
                } else {
                    // Try any json
                    const files = fs.readdirSync(pPath).filter(f => f.endsWith('.json'));
                    if (files.length > 0) {
                        projectData = JSON.parse(fs.readFileSync(path.join(pPath, files[0]), 'utf-8'));
                    }
                }
            } else if (p.endsWith('.json')) {
                projectData = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
            }

            if (Array.isArray(projectData)) projectData = projectData[0]; // Take first if array
            if (!projectData || Object.keys(projectData).length === 0) continue;

            // --- AUDIT LOGIC ---
            const missing: string[] = [];
            const extra = projectData.extra || {};

            // 1. Images
            const hasHero = !!(projectData.image_hero || projectData.heroImage || extra.hero_image || extra.heroImage);
            const gallery = projectData.images_gallery || projectData.galleryImages || extra.gallery_images || extra.galleryImages || [];
            const hasGallery = Array.isArray(gallery) && gallery.length > 0;

            if (!hasHero) missing.push('Hero Image');
            if (!hasGallery) missing.push('Gallery');

            // 2. Names
            const hasNameEn = !!(projectData.name_en || projectData.projectName?.en || (typeof projectData.projectName === 'string' && projectData.projectName));
            const hasNameAr = !!(projectData.name_ar || projectData.projectName?.ar);

            if (!hasNameEn) missing.push('English Name');
            if (!hasNameAr) missing.push('Arabic Name');

            // 3. Prices
            const hasPrice = !!(
                projectData.price_aed_min || projectData.minPriceAED ||
                projectData.minPrice || extra.min_price_a_e_d || extra.min_price ||
                extra.starting_price
            );
            if (!hasPrice) missing.push('Price');

            // 4. Media (Brochure/3D) - Checking strict specific keys user mentioned too
            const hasBrochure = !!(
                projectData.brochure_url || projectData.brochurePdfLink ||
                extra.brochure_pdf_link || extra.pdf ||
                extra.brochure?.english || extra.brochure?.en ||
                projectData.brochure?.english || projectData.brochure?.en
            );

            const has3D = !!(
                projectData.tour_3d_url || projectData['3D_TourLink'] ||
                extra['3_d__tour_link'] || extra.tour_3d || extra['3d'] ||
                extra.virtual_tour || projectData.virtual_tour
            );

            if (!hasBrochure) missing.push('Brochure PDF');
            if (!has3D) missing.push('3D Tour');

            // 5. Description
            const hasDescEn = !!(projectData.description_en || projectData.description?.en || (typeof projectData.description === 'string' && projectData.description));
            const hasDescAr = !!(projectData.description_ar || projectData.description?.ar);

            if (!hasDescEn) missing.push('English Desc');
            // Arabic desc often missing, maybe warning only? Added to missing list for visibility.
            if (!hasDescAr) missing.push('Arabic Desc');


            // Calc Score
            let score = 0;
            if (hasHero) score += 20;
            if (hasNameEn) score += 20;
            if (hasPrice) score += 20;
            if (hasBrochure) score += 10;
            if (has3D) score += 10;
            if (hasDescEn) score += 20;


            results.push({
                developer: dev,
                slug: projectData.slug || p.replace('.json', ''),
                name: projectData.name_en || projectData.projectName?.en || projectData.slug || 'Unknown',
                missing,
                hasBrochure,
                has3D,
                hasPrice,
                hasImages: hasHero,
                dataCompleteness: score
            });
        }
    }
    return results;
}


// Run
const data = scanProjects();
const emptyProjects = data.filter(d => d.dataCompleteness < 50);
const richProjects = data.filter(d => d.dataCompleteness >= 90);

console.log(`\n📊 AUDIT SUMMARY`);
console.log(`=================`);
console.log(`Total Projects Scanned: ${data.length}`);
console.log(`✅ Rich Projects (>90%): ${richProjects.length}`);
console.log(`⚠️ Low Data Projects (<50%): ${emptyProjects.length}`);
console.log(`\nBrochure Availability: ${data.filter(d => d.hasBrochure).length} / ${data.length}`);
console.log(`3D Tour Availability: ${data.filter(d => d.has3D).length} / ${data.length}`);

if (emptyProjects.length > 0) {
    console.log(`\n🚨 WORST OFFENDERS (Bottom 5):`);
    emptyProjects.slice(0, 5).forEach(p => {
        console.log(`- [${p.developer}] ${p.name}: Missing [${p.missing.join(', ')}]`);
    });
}

// Check specific "empty pages" developers if mentioned
console.log(`\n🔍 Checking 'Emaar' specifics:`);
const emaar = data.filter(d => d.developer === 'emaar');
console.log(`Emaar Projects: ${emaar.length}`);
console.log(`Emaar with PDF: ${emaar.filter(d => d.hasBrochure).length}`);
console.log(`Emaar with 3D: ${emaar.filter(d => d.has3D).length}`);
