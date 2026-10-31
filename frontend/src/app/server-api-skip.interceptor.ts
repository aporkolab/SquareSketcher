import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const serverSkipApiInterceptor: HttpInterceptorFn = (req, next) => {
	const platformId = inject(PLATFORM_ID);

	// SSR/prerender alatt: ne kérjünk valódi /api erőforrást
	if (isPlatformServer(platformId) && req.url.startsWith('/api/')) {
		// Válassz: 204 No Content vagy egy minimál mock body
		return of(
			new HttpResponse({
				status: 204,
				url: req.url,
				body: null
			})
		);
	}

	return next(req);
};
