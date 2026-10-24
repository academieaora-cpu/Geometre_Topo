import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Articles de la rubrique « Conseils » : un fichier Markdown par article dans src/content/conseils/.
 * Le nom du fichier devient l'adresse : mon-article.md → /conseils/mon-article
 */
const conseils = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conseils' }),
  schema: z.object({
    title: z.string().max(110),
    /** Titre SEO (balise title), 60 caractères environ. */
    metaTitle: z.string().max(80).optional(),
    description: z.string().min(50).max(170),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Slug de la photo (src/data/gallery.ts) illustrant l'article. */
    image: z.string().optional(),
    /** Services liés (slugs) : l'article est proposé sur ces pages. */
    services: z.array(z.string()).default([]),
    /** Service présélectionné dans le formulaire en bas d'article. */
    ctaService: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { conseils };
