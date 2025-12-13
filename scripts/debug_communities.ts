
import { getAllCommunities, getCommunityBySlugGlobal, getCommunitiesByDeveloper } from '../lib/unifiedDataService';

async function main() {
    console.log('--- Debugging Communities ---');

    // 1. Test by Developer
    const binghattiComms = await getCommunitiesByDeveloper('binghatti');
    console.log(`Binghatti Communities Found: ${binghattiComms.length}`);
    if (binghattiComms.length > 0) {
        console.log('Sample:', JSON.stringify(binghattiComms[0].name, null, 2));
    } else {
        console.log('WARNING: No Binghatti communities found. Checking path...');
    }

    // 2. Test All
    const all = await getAllCommunities();
    console.log(`Total Communities Found: ${all.length}`);
    all.forEach(c => console.log(` - ${c.slug} (${c.developer})`));

    // 3. Test Slug Lookup
    const slug = 'jumeirah-village-circle';
    const comm = await getCommunityBySlugGlobal(slug);
    if (comm) {
        console.log(`✅ Found Community by slug "${slug}":`, comm.name);
    } else {
        console.error(`❌ Failed to find Community by slug "${slug}"`);
    }
}

main().catch(console.error);
