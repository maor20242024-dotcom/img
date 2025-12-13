#!/usr/bin/env python3
"""
Comprehensive fix script for Imperium Gate:
1. Fix project names (name_en/name_ar -> projectName)
2. Archive empty/invalid projects
3. Enrich with PropertyFinder data
4. Clean duplicate gallery images
5. Fix mixed language issues
"""

import re
import json
import os
import shutil
from pathlib import Path
from difflib import SequenceMatcher

def similar(a, b):
    if not a or not b:
        return 0
    return SequenceMatcher(None, str(a).lower(), str(b).lower()).ratio()

def slugify(text):
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def extract_pf_data(filepath):
    """Extract PropertyFinder JSON data from HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Method 1: Try devResult.projects.data pattern
        match = re.search(r'<script id="__NEXT_DATA__" type="application/json">\s*(\{.*?\})\s*</script>', content, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(1))
                projects = data.get('props', {}).get('pageProps', {}).get('devResult', {}).get('projects', {}).get('data', [])
                if projects:
                    return projects
            except:
                pass
        
        # Method 2: Recursively search for projects array
        scripts = re.findall(r'<script[^>]*type="application/json"[^>]*>(.*?)</script>', content, re.DOTALL)
        
        def find_projects(obj):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    if k == 'projects' and isinstance(v, list) and v and isinstance(v[0], dict) and 'title' in v[0]:
                        return v
                    result = find_projects(v)
                    if result:
                        return result
            elif isinstance(obj, list):
                for item in obj:
                    result = find_projects(item)
                    if result:
                        return result
            return None
        
        for script in scripts:
            try:
                data = json.loads(script)
                projects = find_projects(data)
                if projects:
                    return projects
            except:
                pass
                
    except Exception as e:
        print(f"Error extracting from {filepath}: {e}")
    return []

def find_matching_pf_project(project_name, pf_projects):
    """Find matching PropertyFinder project"""
    if not project_name:
        return None
    
    project_name_clean = str(project_name).lower().strip()
    
    best_match = None
    best_score = 0
    
    for pf in pf_projects:
        pf_title = pf.get('title', '')
        
        # Direct slug match
        if slugify(pf_title) == slugify(project_name):
            return pf
        
        # Similarity match
        score = similar(project_name_clean, pf_title.lower())
        if score > best_score and score > 0.6:
            best_score = score
            best_match = pf
    
    return best_match

def fix_project(project_path, pf_data_map, archived_dir):
    """Fix a single project and return True if valid, False if archived"""
    
    try:
        with open(project_path, 'r', encoding='utf-8') as f:
            project = json.load(f)
    except:
        return False
    
    slug = project.get('slug', '')
    changes = []
    
    # 1. Fix project name structure
    if not project.get('projectName'):
        name_en = project.get('name_en', '')
        name_ar = project.get('name_ar', '')
        
        if name_en or name_ar:
            project['projectName'] = {
                'en': name_en or name_ar,
                'ar': name_ar or name_en
            }
            changes.append('projectName')
    
    # 2. Fix description structure
    if not project.get('description') or (isinstance(project.get('description'), dict) and not project['description'].get('en') and not project['description'].get('ar')):
        desc_en = project.get('description_en', '')
        desc_ar = project.get('description_ar', '')
        
        if desc_en or desc_ar:
            project['description'] = {
                'en': desc_en or '',
                'ar': desc_ar or ''
            }
            if desc_en or desc_ar:
                changes.append('description')
    
    # 3. Fix location structure
    if not project.get('location') or (isinstance(project.get('location'), dict) and not project['location'].get('en') and not project['location'].get('ar')):
        loc_en = project.get('address_en', '') or project.get('location_en', '')
        loc_ar = project.get('address_ar', '') or project.get('location_ar', '')
        city_en = project.get('city_en', '')
        city_ar = project.get('city_ar', '')
        
        if loc_en or loc_ar or city_en or city_ar:
            project['location'] = {
                'en': loc_en or city_en or loc_ar,
                'ar': loc_ar or city_ar or loc_en
            }
            changes.append('location')
    
    # 4. Clean duplicate gallery images
    gallery = project.get('images_gallery', []) or project.get('galleryImages', [])
    if gallery:
        # Remove duplicates while preserving order
        seen = set()
        clean_gallery = []
        for img in gallery:
            if img and img not in seen:
                seen.add(img)
                clean_gallery.append(img)
        
        if len(clean_gallery) != len(gallery):
            project['galleryImages'] = clean_gallery
            project['images_gallery'] = clean_gallery
            changes.append(f'gallery_dedup({len(gallery)}->{len(clean_gallery)})')
        else:
            project['galleryImages'] = clean_gallery
    
    # 5. Ensure hero image is set
    if not project.get('heroImage') and project.get('image_hero'):
        project['heroImage'] = project['image_hero']
        changes.append('heroImage')
    elif not project.get('heroImage') and gallery:
        project['heroImage'] = gallery[0]
        changes.append('heroImage_from_gallery')
    
    # 6. Enrich from PropertyFinder
    name = project.get('name_en', '') or (project.get('projectName', {}).get('en', '') if isinstance(project.get('projectName'), dict) else project.get('projectName', ''))
    developer = project.get('developer', '').lower()
    
    pf_projects = pf_data_map.get(developer, [])
    pf_match = find_matching_pf_project(name or slug, pf_projects)
    
    if pf_match:
        # Price
        if pf_match.get('startingPrice') and not project.get('minPriceAED'):
            project['minPriceAED'] = pf_match['startingPrice']
            changes.append(f"price:{pf_match['startingPrice']}")
        
        # Payment plans
        pf_plans = pf_match.get('paymentPlans', [])
        if pf_plans and not project.get('paymentPlan'):
            project['paymentPlan'] = ', '.join(list(set(pf_plans)))
            changes.append('paymentPlan')
        
        # Amenities
        pf_amenities = [a.get('name') for a in pf_match.get('amenities', []) if a.get('name')]
        if pf_amenities:
            existing = project.get('amenities', [])
            existing_names = set()
            
            for a in existing:
                if isinstance(a, dict):
                    n = a.get('name', {})
                    if isinstance(n, dict):
                        existing_names.add(n.get('en', '').lower())
                    elif isinstance(n, str):
                        existing_names.add(n.lower())
                elif isinstance(a, str):
                    existing_names.add(a.lower())
            
            new_amenities = []
            for amenity in pf_amenities:
                if amenity.lower() not in existing_names:
                    new_amenities.append({'name': {'en': amenity, 'ar': amenity}})
            
            if new_amenities:
                project['amenities'] = existing + new_amenities
                changes.append(f'amenities(+{len(new_amenities)})')
        
        # Coordinates
        pf_loc = pf_match.get('location', {})
        pf_coords = pf_loc.get('coordinates', {})
        if pf_coords.get('lat') and not project.get('latitude'):
            project['latitude'] = pf_coords['lat']
            project['longitude'] = pf_coords.get('lng') or pf_coords.get('lon')
            # Also update coordinates object
            project['coordinates'] = {
                'lat': pf_coords['lat'],
                'lng': pf_coords.get('lng') or pf_coords.get('lon')
            }
            changes.append('coordinates')
        
        # Handover
        if pf_match.get('deliveryDate') and not project.get('deliveryDate'):
            delivery = pf_match['deliveryDate']
            if 'T' in delivery:
                project['deliveryDate'] = delivery.split('T')[0]
                changes.append('deliveryDate')
        
        # Bedrooms
        if pf_match.get('bedrooms') and not project.get('bedrooms'):
            project['bedrooms'] = [int(b) for b in pf_match['bedrooms'] if b.isdigit()]
            if project['bedrooms']:
                changes.append('bedrooms')
        
        # Images from PF
        pf_images = pf_match.get('images', [])
        if pf_images and not project.get('galleryImages'):
            # Convert to original quality
            pf_images = [img.replace('/medium.webp', '/original.webp') for img in pf_images]
            project['galleryImages'] = pf_images
            project['images_gallery'] = pf_images
            if not project.get('heroImage'):
                project['heroImage'] = pf_images[0]
            changes.append(f'pf_images({len(pf_images)})')
    
    # 7. Check if project should be archived (empty/invalid)
    has_name = project.get('projectName') or project.get('name_en') or project.get('name_ar')
    has_content = (
        project.get('minPriceAED') or 
        project.get('amenities') or 
        project.get('galleryImages') or 
        project.get('images_gallery') or
        project.get('description')
    )
    
    if not has_name:
        # Archive this project
        shutil.move(str(project_path.parent), archived_dir / project_path.parent.name)
        return False
    
    # Save changes
    if changes:
        with open(project_path, 'w', encoding='utf-8') as f:
            json.dump(project, f, ensure_ascii=False, indent=2)
        print(f"  ✓ {slug}: {', '.join(changes)}")
    
    return True

def main():
    base_dir = Path(__file__).parent.parent
    data_dir = base_dir / 'public' / 'data'
    
    # Create archive directory
    archived_dir = data_dir / '_archived'
    archived_dir.mkdir(exist_ok=True)
    
    # Load PropertyFinder data
    pf_data_map = {}
    pf_files = {
        'emaar': 'emaar.md',
        'damac': 'damac.md',
        'sobha': 'sobha.md',
        'nakheel': 'nakheel.md',
        'binghatti': 'binghati.md',
    }
    
    print("📥 Loading PropertyFinder data...")
    for dev, pf_file in pf_files.items():
        pf_path = data_dir / pf_file
        if pf_path.exists():
            pf_projects = extract_pf_data(pf_path)
            pf_data_map[dev] = pf_projects
            print(f"  {dev}: {len(pf_projects)} projects")
    
    # Process each developer
    developers = ['emaar', 'damac', 'sobha', 'nakheel', 'binghatti']
    
    total_fixed = 0
    total_archived = 0
    
    for dev in developers:
        projects_dir = data_dir / dev / 'projects'
        if not projects_dir.exists():
            continue
        
        print(f"\n{'='*60}")
        print(f"Processing: {dev}")
        print(f"{'='*60}")
        
        dev_archived_dir = archived_dir / dev
        dev_archived_dir.mkdir(exist_ok=True)
        
        fixed = 0
        archived = 0
        
        for project_folder in projects_dir.iterdir():
            if not project_folder.is_dir():
                continue
            if project_folder.name.startswith('_'):
                continue
            
            index_file = project_folder / 'index.json'
            if not index_file.exists():
                continue
            
            if fix_project(index_file, pf_data_map, dev_archived_dir):
                fixed += 1
            else:
                archived += 1
        
        print(f"\n{dev}: Fixed {fixed}, Archived {archived}")
        total_fixed += fixed
        total_archived += archived
    
    print(f"\n{'='*60}")
    print(f"📊 Total: Fixed {total_fixed}, Archived {total_archived}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
