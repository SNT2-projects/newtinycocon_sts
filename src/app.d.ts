// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Interfaces pour les réponses de l'API Directus
	interface DirectusResponse<T> {
		data: T;
	}

	interface Cocon {
		id: string;
		title: string;
		sort: number;
		user_created: string;
		date_created: string;
		user_updated: string;
		date_updated: string;
		articles: Article[];
	}

	interface Article {
		id: string;
		title: string;
		contents: Content[];
		cocon?: Cocon | string;
	}

	interface Content {
		id: string;
		language: string;
		title?: string;
		meta_title?: string;
		description?: string;
		body?: string;
		aside?: string;
		article?: Article | string;
		status?: 'published' | 'draft' | 'archived' | string;
	}
}

export {};
