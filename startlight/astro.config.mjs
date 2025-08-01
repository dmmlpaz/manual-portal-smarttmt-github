// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	// habilita SSR
	output: 'server',

	adapter: node({
		mode: 'standalone', // o 'middleware' si usas otro framework
	}),

	// Asegúrate de que no sea una subruta (ej: "/docs")
	base: "/",

	image: {
		service: passthroughImageService(),
	},

	integrations: [
		starlight({
			components: {
				// Aquí es donde debe ir la configuración de componentes
				Footer: './src/components/ChatIA.astro' // Ruta a tu componente de chat
			},
			title: 'Portal tributario Doc.',
			customCss: [
				'./src/styles/custom.css',
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
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
				}
			],

		}),
		react()
	],
});