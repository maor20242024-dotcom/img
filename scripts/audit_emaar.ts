
import fs from 'fs';
import path from 'path';

const DATA_ROOT = path.join(process.cwd(), 'public', 'data');

function scanEmaar() {
    if (!fs.existsSync(DATA_ROOT)) return;

    const emaarDir = path.join(DATA_ROOT, 'emaar', 'projects');
    if (!fs.existsSync(emaarDir)) return;

    const projects = fs.readdirSync(emaarDir).filter(f => !f.startsWith('.'));

    console.log(`\n🔍 Detailed Status of Emaar Projects (${projects.length}):`);
    console.log('slug | Hero | Gallery | Price | Desc_En | Desc_Ar');
    console.log('--- | --- | --- | --- | --- | ---');

    let missingHero = 0;
    let missingGallery = 0;
    let missingPrice = 0;
    let missingDescAr = 0;

    for (const p of projects) {
        let projectData: any = {};
        const pPath = path.join(emaarDir, p);

        if (fs.statSync(pPath).isDirectory()) {
            const indexPath = path.join(pPath, 'index.json');
            if (fs.existsSync(indexPath)) {
                projectData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
            }
        } else if (p.endsWith('.json')) {
            projectData = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
        }

        const extra = projectData.extra || {};
        const hasHero = !!(projectData.image_hero || projectData.heroImage || extra.hero_image);
        const gallery = projectData.images_gallery || projectData.galleryImages || extra.gallery_images || [];
        const hasGallery = Array.isArray(gallery) && gallery.length > 0;
        const hasPrice = !!(projectData.price_aed_min || extra.min_price_a_e_d);
        const hasDescEn = !!(projectData.description_en || extra.description_en || projectData.description?.en);
        const hasDescAr = !!(projectData.description_ar || extra.description_ar || projectData.description?.ar);

        if (!hasHero) missingHero++;
        if (!hasGallery) missingGallery++;
        if (!hasPrice) missingPrice++;
        if (!hasDescAr) missingDescAr++;

        // Print only if significantly empty
        if (!hasHero || !hasGallery) {
            console.log(`${projectData.slug} | ${hasHero ? '✅' : '❌'} | ${hasGallery ? '✅' : '❌'} | ${hasPrice ? '✅' : '❌'} | ${hasDescEn ? '✅' : '❌'} | ${hasDescAr ? '✅' : '❌'}`);
        }
    }

    console.log(`\nSTATS:`);
    console.log(`Missing Hero: ${missingHero}`);
    console.log(`Missing Gallery: ${missingGallery}`);
    console.log(`Missing Price: ${missingPrice}`);
    console.log(`Missing Arabic Desc: ${missingDescAr}`);
}

scanEmaar();
