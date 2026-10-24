/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** E-mail de l'administrateur connecté (défini par le middleware sur les routes protégées). */
    admin?: string;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_PHONE?: string;
  readonly PUBLIC_WHATSAPP_NUMBER?: string;
  readonly PUBLIC_EMAIL?: string;
  readonly PUBLIC_HOURS?: string;
  readonly PUBLIC_SOCIAL_LINKS?: string;
  readonly PUBLIC_GA_ID?: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
}
