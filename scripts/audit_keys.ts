
import fs from 'fs';
import path from 'path';

const DATA_ROOT = path.join(process.cwd(), 'public', 'data');

function scanProjects() {
    if (!fs.existsSync(DATA_ROOT)) return;

    const developers = fs.readdirSync(DATA_ROOT).filter(f => !f.startsWith('.'));

    console.log('🔍 Identifying Projects with 3D Tours...');

    for (const dev of developers) {
        const devDir = path.join(DATA_ROOT, dev);
        if (!fs.statSync(devDir).isDirectory()) continue;

        // Check projects/ subdir
        const projectsDir = path.join(devDir, 'projects');
        if (fs.existsSync(projectsDir)) {
            const projects = fs.readdirSync(projectsDir).filter(f => !f.startsWith('.'));
            for (const p of projects) {
                let projectData: any = {};
                const pPath = path.join(projectsDir, p);

                if (fs.statSync(pPath).isDirectory()) {
                    const indexPath = path.join(pPath, 'index.json');
                    if (fs.existsSync(indexPath)) {
                        projectData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
                    }
                } else if (p.endsWith('.json')) {
                    projectData = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
                }

                if (Array.isArray(projectData)) projectData = projectData[0];
                if (!projectData) continue;

                const extra = projectData.extra || {};

                // Check if it has 3D tour based on our known keys
                const has3D = !!(
                    projectData.tour_3d_url || projectData['3D_TourLink'] ||
                    extra['3_d__tour_link'] || extra.tour_3d || extra['3d'] ||
                    extra.virtual_tour || projectData.virtual_tour
                );

                if (has3D) {
                    console.log(`\n✅ FOUND 3D TOUR: [${dev}] ${projectData.slug}`);
                    console.log(`Keys with '3d':`, Object.keys(extra).filter(k => k.includes('3d')));
                    console.log(`Keys with 'tour':`, Object.keys(extra).filter(k => k.includes('tour')));
                    if (projectData.tour_3d_url) console.log(`- tour_3d_url: ${projectData.tour_3d_url}`);
                }
            }
        }
    }
}

scanProjects();
