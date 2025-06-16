// @ts-check
import { defineConfig,passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'server', // habilita SSR
	adapter: node({
		mode: 'standalone', // o 'middleware' si usas otro framework
	}),
	base: "/",  // Asegúrate de que no sea una subruta (ej: "/docs")
	image: {
		service: passthroughImageService(),
	},
	integrations: [
		starlight({
			title: 'Portal tributario Doc.', 
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
	],
});
