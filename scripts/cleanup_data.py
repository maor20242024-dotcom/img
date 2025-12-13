#!/usr/bin/env python3
"""
Comprehensive cleanup and standardization script
1. Remove invalid projects (projects, communities, test)
2. Merge duplicates
3. Fix 3D tour links
4. Standardize field names
5. Remove duplicate images
6. Ensure hero is unique
"""

import json
import os
import shutil
from pathlib import Path
from difflib import SequenceMatcher

def similar(a, b):
    if not a or not b:
        return 0
    return SequenceMatcher(None, str(a).lower().strip(), str(b).lower().strip()).ratio()

base_dir = Path('public/data')
archive_dir = base_dir / '_archived'
archive_dir.mkdir(exist_ok=True)

# Invalid project names to remove
INVALID_NAMES = ['projects', 'communities', 'test', 'unknown', 'n/a']

# Invalid 3D tour base URLs
INVALID_TOUR_URLS = [
    'https://sobha.cloud/',
    'https://sobha.cloud',
    'http://sobha.cloud/',
    'http://sobha.cloud',
]

# Duplicate mapping: keep first, archive rest
EXACT_DUPLICATES = {
    # Sobha
    'sobha': {
        'garden-house': 'garden-houses',  # Keep garden-houses
        'golf-ridges': 'golf-ridges-at-sobha-one',  # Keep at-sobha-one (has more data)
        'avenue': 'skyscape-avenue',  # Keep skyscape-avenue
        'hartland-greens-apartment': 'hartland-greens',  # Keep hartland-greens
        'creek-vistas-heights': 'creek-vistas',  # Keep creek-vistas
        'creek-vistas-grande': 'creek-vistas',  # Keep creek-vistas
        'creek-vistas-reserve': 'creek-vistas',  # Keep creek-vistas
        'skyscape-aura': 'aura',  # Keep aura
        'skyvue-spectra': 'skyvue',  # Keep skyvue (main)
        'skyvue-solair': 'skyvue',  # These are phases, not duplicates - KEEP BOTH
        'skyvue-stellar': 'skyvue',  # These are phases, not duplicates - KEEP BOTH
    },
    # Emaar
    'emaar': {
        'creek-side-18': 'creekside-18',  # Keep creekside-18
        'silva': 'silva-dubai-creek-harbour',  # Keep full name
        'orania': 'orania-at-the-valley',  # Keep full name
        'pier-point': 'pier-point-at-rashid-yachts-marina',  # Keep full name
        'valo': 'valo-at-dubai-creek-harbour',  # Keep full name
        'albero': 'albero-at-dubai-creek-harbour',  # Keep full name
        'elie-saab': 'elie-saab-at-arabian-ranches-iii',  # Keep full name
        'greenside-residences': 'greenside-residence',  # Keep singular
        'farm-gardens': 'the-farm-gardens',  # Keep "the" version
    },
    # DAMAC
    'damac': {
        'district': 'damac-district',  # Keep damac-district
        'bay-by-cavalli': 'damac-bay-by-cavalli',  # Keep full name
        'islands': 'damac-islands-seychelles-2',  # Keep specific
        'aykon-city': 'damac-maison-aykon-city',  # Keep full name
        'riverside': 'damac-riverside-olive',  # Keep specific
        'riverside-views': 'damac-riverside-views-marine-1',  # Keep specific
        'riverside-views-marine-4': 'damac-riverside-views-marine-4',  # Keep damac prefix
        'riverside-views-marine-3': 'damac-riverside-views-marine-2',  # Merge into marine-2
        'chelsea-residences-by-damac': 'chelsea-residences',  # Keep shorter
        'seychelles-2': 'damac-islands-seychelles-2',  # Keep full name
        'seychelles': 'damac-islands-seychelles-2',  # Keep full name
    },
    # Nakheel
    'nakheel': {
        'bay-grove-residences-phase-4-by-nakheel': 'bay-grove-residences-phase-4',  # Keep shorter
        'bay-grove-residences-phase-2-by-nakheel': 'bay-grove-residences',  # Merge into main
        'bay-grove': 'bay-grove-residences',  # Merge into main
        'district-one-west-by-nakheel': 'district-one',  # Merge into main
    },
    # Binghatti
    'binghatti': {
        'binghatti-flare-01': 'binghatti-flare',  # Keep main
    }
}

# Actually remove skyvue variants from duplicates (they are phases)
# and sobha creek-vistas variants
for dev in ['sobha']:
    if dev in EXACT_DUPLICATES:
        # Remove these - they are different phases
        for key in ['skyvue-solair', 'skyvue-stellar', 'skyvue-spectra']:
            if key in EXACT_DUPLICATES[dev]:
                del EXACT_DUPLICATES[dev][key]

developers = ['emaar', 'damac', 'sobha', 'nakheel', 'binghatti']

def merge_project_data(main_data, dup_data):
    """Merge data from duplicate into main, preferring non-empty values"""
    for key, value in dup_data.items():
        if key in ['slug', 'developer']:
            continue
        main_value = main_data.get(key)
        # If main is empty/None and dup has value, use dup's value
        if not main_value and value:
            main_data[key] = value
        # If both have arrays, merge unique items
        elif isinstance(value, list) and isinstance(main_value, list):
            # For images, merge unique
            if 'image' in key.lower() or 'gallery' in key.lower():
                seen = set(main_value)
                for item in value:
                    if item not in seen:
                        main_value.append(item)
                        seen.add(item)
    return main_data

def standardize_project(project_data, slug):
    """Standardize field names and clean data"""
    changes = []
    
    # 1. Standardize image fields
    # Use images_gallery and image_hero only
    gallery = (
        project_data.pop('galleryImages', None) or 
        project_data.get('images_gallery', [])
    )
    hero = (
        project_data.pop('heroImage', None) or 
        project_data.get('image_hero', None)
    )
    
    if gallery:
        # Remove duplicates while preserving order
        seen = set()
        clean_gallery = []
        for img in gallery:
            if img and img not in seen:
                seen.add(img)
                clean_gallery.append(img)
        project_data['images_gallery'] = clean_gallery
        changes.append('images_gallery')
    
    # Set hero - ensure it's not duplicated in gallery's first position
    if hero:
        project_data['image_hero'] = hero
        changes.append('image_hero')
    elif gallery:
        project_data['image_hero'] = gallery[0]
        changes.append('image_hero_from_gallery')
    
    # 2. Fix project name field: use projectName not project
    if 'project' in project_data and 'projectName' not in project_data:
        project_data['projectName'] = project_data.pop('project')
        changes.append('projectName')
    
    # 3. Fix 3D tour URLs
    tour_url = project_data.get('tour_3d_url') or project_data.get('3D_TourLink')
    if tour_url:
        tour_clean = tour_url.strip().rstrip('/')
        # Check if it's just the base URL
        is_invalid = any(tour_clean == inv.rstrip('/') for inv in INVALID_TOUR_URLS)
        if is_invalid:
            # Remove invalid tour URLs
            project_data.pop('tour_3d_url', None)
            project_data.pop('3D_TourLink', None)
            changes.append('removed_invalid_tour')
    
    # 4. Remove duplicate fields
    # Keep only standard field names
    fields_to_remove = ['galleryImages', 'heroImage']  # Already migrated above
    for field in fields_to_remove:
        if field in project_data:
            del project_data[field]
    
    # 5. Clean bedrooms - remove duplicates
    if 'bedrooms' in project_data:
        bedrooms = project_data['bedrooms']
        if isinstance(bedrooms, list):
            # Remove duplicates and sort
            clean_bedrooms = sorted(list(set(bedrooms)))
            project_data['bedrooms'] = clean_bedrooms
            if clean_bedrooms != bedrooms:
                changes.append('bedrooms_cleaned')
    
    return project_data, changes

def process_developer(dev):
    """Process a single developer"""
    projects_dir = base_dir / dev / 'projects'
    dev_archive_dir = archive_dir / dev
    dev_archive_dir.mkdir(exist_ok=True)
    
    if not projects_dir.exists():
        return 0, 0, 0
    
    removed = 0
    merged = 0
    standardized = 0
    
    # Get list of project directories
    project_dirs = [d for d in projects_dir.iterdir() if d.is_dir() and not d.name.startswith('_')]
    
    # First pass: remove invalid names
    for proj_dir in project_dirs[:]:  # Copy list to allow modification
        slug = proj_dir.name.lower()
        
        if slug in INVALID_NAMES:
            print(f"  ❌ Removing invalid: {dev}/{slug}")
            shutil.move(str(proj_dir), str(dev_archive_dir / proj_dir.name))
            project_dirs.remove(proj_dir)
            removed += 1
    
    # Second pass: merge duplicates
    duplicates_for_dev = EXACT_DUPLICATES.get(dev, {})
    for dup_slug, main_slug in duplicates_for_dev.items():
        dup_dir = projects_dir / dup_slug
        main_dir = projects_dir / main_slug
        
        if not dup_dir.exists():
            continue
        
        dup_index = dup_dir / 'index.json'
        main_index = main_dir / 'index.json'
        
        if not dup_index.exists():
            continue
        
        # Load duplicate data
        try:
            with open(dup_index, 'r') as f:
                dup_data = json.load(f)
        except:
            continue
        
        # If main exists, merge data
        if main_index.exists():
            try:
                with open(main_index, 'r') as f:
                    main_data = json.load(f)
                
                # Merge data
                merged_data = merge_project_data(main_data, dup_data)
                
                with open(main_index, 'w') as f:
                    json.dump(merged_data, f, ensure_ascii=False, indent=2)
                
                print(f"  🔄 Merged {dev}/{dup_slug} -> {dev}/{main_slug}")
            except Exception as e:
                print(f"  ⚠️ Error merging: {e}")
        
        # Archive duplicate
        shutil.move(str(dup_dir), str(dev_archive_dir / dup_dir.name))
        merged += 1
    
    # Third pass: standardize all remaining projects
    for proj_dir in projects_dir.iterdir():
        if not proj_dir.is_dir() or proj_dir.name.startswith('_'):
            continue
        
        index_file = proj_dir / 'index.json'
        if not index_file.exists():
            continue
        
        try:
            with open(index_file, 'r') as f:
                data = json.load(f)
            
            data, changes = standardize_project(data, proj_dir.name)
            
            if changes:
                with open(index_file, 'w') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                standardized += 1
                if 'removed_invalid_tour' in changes:
                    print(f"  🎮 Fixed tour: {dev}/{proj_dir.name}")
        except Exception as e:
            print(f"  ⚠️ Error: {dev}/{proj_dir.name}: {e}")
    
    return removed, merged, standardized

# Process all developers
print("=" * 70)
print("🧹 Comprehensive Data Cleanup")
print("=" * 70)

total_removed = 0
total_merged = 0
total_standardized = 0

for dev in developers:
    print(f"\n📁 Processing {dev}...")
    removed, merged, standardized = process_developer(dev)
    total_removed += removed
    total_merged += merged
    total_standardized += standardized
    print(f"   Removed: {removed}, Merged: {merged}, Standardized: {standardized}")

print("\n" + "=" * 70)
print(f"📊 Total: Removed {total_removed}, Merged {total_merged}, Standardized {total_standardized}")
print("=" * 70)
