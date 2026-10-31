import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService, PixelArt } from './api';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/pixel-art`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('posts pixel art to save it', () => {
    const art: PixelArt = { name: 'Test Art', pixels: [['#FFFFFF']] };
    let result: PixelArt | undefined;

    service.savePixelArt(art).subscribe((saved) => (result = saved));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(art);
    req.flush({ ...art, id: '1' });
    expect(result).toEqual({ ...art, id: '1' });
  });

  it('puts pixel art that already has an id to update it', () => {
    const art: PixelArt = { id: 'a/1', name: 'Test Art', pixels: [['#FFFFFF']] };
    let result: PixelArt | undefined;

    service.savePixelArt(art).subscribe((saved) => (result = saved));

    const req = httpMock.expectOne(`${apiUrl}/a%2F1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Test Art', pixels: [['#FFFFFF']] });
    req.flush(art);
    expect(result).toEqual(art);
  });

  it('gets all pixel art', () => {
    const arts: PixelArt[] = [
      { id: '1', name: 'Art 1', pixels: [['#FFFFFF']] },
      { id: '2', name: 'Art 2', pixels: [['#000000']] },
    ];
    let result: PixelArt[] | undefined;

    service.getAllPixelArt().subscribe((all) => (result = all));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(arts);
    expect(result).toEqual(arts);
  });

  it('gets pixel art by id', () => {
    const art: PixelArt = { id: '1', name: 'Test Art', pixels: [['#FFFFFF']] };
    let result: PixelArt | undefined;

    service.getPixelArtById('1').subscribe((found) => (result = found));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(art);
    expect(result).toEqual(art);
  });

  it('encodes the id in the URL', () => {
    service.getPixelArtById('a/b?c').subscribe();

    httpMock.expectOne(`${apiUrl}/a%2Fb%3Fc`).flush(null);
  });
});
