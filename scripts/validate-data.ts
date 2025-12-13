#!/usr/bin/env tsx
/**
 * Data Validation Script
 * Validates project and developer data for:
 * - Required fields (slugs, developerKey)
 * - Duplicate IDs/slugs
 * - File existence (logos, hero images, gallery)
 */

import { getAllProjects, getAllDevelopers } from '../lib/data/store';
import fs from 'node:fs/promises';
import path from 'node:path';

type Locale = 'en' | 'ar';

const ROOT = process.cwd();

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
};

const warn = (m: string) => console.warn(`${colors.yellow}⚠ WARN${colors.reset}`, m);
const error = (m: string) => console.error(`${colors.red}✖ ERROR${colors.reset}`, m);
const info = (m: string) => console.log(`${colors.cyan}ℹ INFO${colors.reset}`, m);
const success = (m: string) => console.log(`${colors.green}✓ SUCCESS${colors.reset}`, m);

async function fileExists(relativePath: string): Promise<boolean> {
  try {
    // Remove leading slash if present
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    const fullPath = path.join(ROOT, 'public', cleanPath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  info('Starting data validation...\n');

  let errorCount = 0;
  let warnCount = 0;

  try {
    // Load data
    const projects = await getAllProjects();
    const developers = await getAllDevelopers();

    info(`Loaded ${projects.length} projects and ${developers.length} developers\n`);

    // Validate developers
    info('Validating developers...');
    const devKeys = new Set<string>();

    for (const dev of developers) {
      if (!dev.key) {
        error('Developer missing key');
        errorCount++;
        continue;
      }

      if (devKeys.has(dev.key)) {
        error(`Duplicate developer key: ${dev.key}`);
        errorCount++;
      } else {
        devKeys.add(dev.key);
      }

      if (!dev.name?.en || !dev.name?.ar) {
        error(`Developer ${dev.key} missing name locales`);
        errorCount++;
      }

      if (dev.logoWhite) {
        const exists = await fileExists(dev.logoWhite);
        if (!exists) {
          warn(`Logo missing for ${dev.key}: ${dev.logoWhite}`);
          warnCount++;
        }
      }
    }

    // Validate projects
    info('\nValidating projects...');
    const projectIds = new Set<string>();
    const slugsByLocale = new Map<string, Set<string>>();
    slugsByLocale.set('en', new Set());
    slugsByLocale.set('ar', new Set());

    for (const project of projects) {
      // Check ID
      if (!project.id) {
        error('Project missing id');
        errorCount++;
        continue;
      }

      if (projectIds.has(project.id)) {
        error(`Duplicate project ID: ${project.id}`);
        errorCount++;
      } else {
        projectIds.add(project.id);
      }

      // Check developer key
      if (!project.developerKey) {
        error(`Project ${project.id} missing developerKey`);
        errorCount++;
      } else if (!devKeys.has(project.developerKey)) {
        error(`Project ${project.id} has invalid developerKey: ${project.developerKey}`);
        errorCount++;
      }

      // Check slugs
      for (const locale of ['en', 'ar'] as Locale[]) {
        const slug = project.slugs?.[locale];
        if (!slug) {
          error(`Project ${project.id} missing ${locale} slug`);
          errorCount++;
        } else {
          const localeSet = slugsByLocale.get(locale)!;
          const key = `${project.developerKey}:${slug}`;
          if (localeSet.has(key)) {
            error(`Duplicate ${locale} slug: ${key}`);
            errorCount++;
          } else {
            localeSet.add(key);
          }
        }
      }

      // Check names
      if (!project.names?.en || !project.names?.ar) {
        warn(`Project ${project.id} missing name locales`);
        warnCount++;
      }

      // Check hero image/video
      if (project.hero?.src) {
        const exists = await fileExists(project.hero.src);
        if (!exists) {
          warn(`Hero media not found for ${project.id}: ${project.hero.src}`);
          warnCount++;
        }
      }

      // Check gallery images
      if (Array.isArray(project.gallery)) {
        for (const item of project.gallery) {
          if (item.src) {
            const exists = await fileExists(item.src);
            if (!exists) {
              warn(`Gallery image not found for ${project.id}: ${item.src}`);
              warnCount++;
            }
          }
        }
      }

      // Check brochure files
      if (project.assets?.brochure) {
        for (const locale of ['en', 'ar'] as Locale[]) {
          const brochure = project.assets.brochure[locale];
          if (brochure) {
            const exists = await fileExists(brochure);
            if (!exists) {
              warn(`Brochure (${locale}) not found for ${project.id}: ${brochure}`);
              warnCount++;
            }
          }
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    info(`Validation complete!`);
    console.log(`  Projects: ${projects.length}`);
    console.log(`  Developers: ${developers.length}`);
    console.log(`  ${colors.red}Errors: ${errorCount}${colors.reset}`);
    console.log(`  ${colors.yellow}Warnings: ${warnCount}${colors.reset}`);
    console.log('='.repeat(60) + '\n');

    if (errorCount > 0) {
      error(`Found ${errorCount} errors. Please fix them before deploying.`);
      process.exit(1);
    } else {
      success('No errors found! Data is valid.');
      if (warnCount > 0) {
        warn(`Found ${warnCount} warnings. Consider fixing them.`);
      }
    }
  } catch (err) {
    error(`Validation failed: ${err}`);
    console.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
