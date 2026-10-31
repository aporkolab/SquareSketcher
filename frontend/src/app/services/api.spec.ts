import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, PixelArt } from './api';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/pixel-art`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save pixel art', () => {
    const mockArt: PixelArt = { name: 'Test Art', pixels: [['#FFFFFF']] };
    service.savePixelArt(mockArt).subscribe(art => {
      expect(art).toEqual(mockArt);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockArt);
  });

  it('should get all pixel art', () => {
    const mockArts: PixelArt[] = [
      { id: '1', name: 'Art 1', pixels: [['#FFFFFF']] },
      { id: '2', name: 'Art 2', pixels: [['#000000']] }
    ];
    service.getAllPixelArt().subscribe(arts => {
      expect(arts.length).toBe(2);
      expect(arts).toEqual(mockArts);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockArts);
  });

  it('should get pixel art by id', () => {
    const mockArt: PixelArt = { id: '1', name: 'Test Art', pixels: [['#FFFFFF']] };
    service.getPixelArtById('1').subscribe(art => {
      expect(art).toEqual(mockArt);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArt);
  });
});
