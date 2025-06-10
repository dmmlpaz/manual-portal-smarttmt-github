// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	image: {
		service: passthroughImageService(),
	},
	site: 'http://localhost:4321/',
	integrations: [
		starlight({
			title: 'Manual portal tribuitario',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Español',
					lang: 'es', // lang is required for root locales
				},
				en: {
					label: 'English',
				},
			},
			logo: {
				src: './src/assets/logo.png',
				alt: 'Tribuitario Logo',
			},
			favicon: './src/assets/favicon.png',
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Inicio sesión',
					autogenerate: {
						directory: 'iniciosesion',
					},
				},
				{
					label: 'Registro de usuario',
					autogenerate: {
						directory: 'registrousuario',
					},
				},
				{
					label: 'Declaraciones',
					autogenerate: {
						directory: 'declaraciones',
					},
				},
				{
					label: 'Rit',
					autogenerate: {
						directory: 'rit',
					},
				},
				{
					label: 'Firma electronica',
					autogenerate: {
						directory: 'firmaelectronica',
					},
				},
				{
					label: 'Prueba',
					autogenerate: {
						directory: 'prueba',
					},
				},
			],
		}),
	],
});
