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

  it('should get all pixel art', () => {
    const mockPixelArt: PixelArt[] = [{ name: 'test', pixels: [['#FFF']] }];
    service.getAllPixelArt().subscribe(art => {
      expect(art).toEqual(mockPixelArt);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPixelArt);
  });

  it('should save pixel art', () => {
    const newPixelArt: PixelArt = { name: 'new test', pixels: [['#000']] };
    service.savePixelArt(newPixelArt).subscribe(art => {
      expect(art).toEqual(newPixelArt);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newPixelArt);
  });
});
