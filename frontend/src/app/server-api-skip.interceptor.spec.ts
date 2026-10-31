import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { serverSkipApiInterceptor } from './server-api-skip.interceptor';

function setup(platform: 'server' | 'browser') {
  TestBed.configureTestingModule({
    providers: [
      { provide: PLATFORM_ID, useValue: platform },
      provideHttpClient(withInterceptors([serverSkipApiInterceptor])),
      provideHttpClientTesting(),
    ],
  });
  return {
    http: TestBed.inject(HttpClient),
    httpMock: TestBed.inject(HttpTestingController),
  };
}

describe('serverSkipApiInterceptor', () => {
  it('answers API calls with an empty body on the server', () => {
    const { http, httpMock } = setup('server');
    let body: unknown = 'untouched';

    http.get('/api/pixel-art').subscribe((result) => (body = result));

    httpMock.expectNone('/api/pixel-art');
    expect(body).toBeNull();
    httpMock.verify();
  });

  it('lets non-API calls through on the server', () => {
    const { http, httpMock } = setup('server');

    http.get('/assets/data.json').subscribe();

    httpMock.expectOne('/assets/data.json').flush({});
    httpMock.verify();
  });

  it('lets API calls through in the browser', () => {
    const { http, httpMock } = setup('browser');

    http.get('/api/pixel-art').subscribe();

    httpMock.expectOne('/api/pixel-art').flush([]);
    httpMock.verify();
  });
});
