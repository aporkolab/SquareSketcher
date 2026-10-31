import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiService, PixelArt } from '../../services/api';
import { ArtService } from '../../services/art';
import { GalleryComponent } from './gallery';

describe('GalleryComponent', () => {
  const arts: PixelArt[] = [
    { id: '1', name: 'First', pixels: [['#000000']] },
    { id: '2', name: 'Second', pixels: [['#FFFFFF']] },
  ];
  let api: { getAllPixelArt: ReturnType<typeof vi.fn> };
  let fixture: ComponentFixture<GalleryComponent>;

  async function create(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [{ provide: ApiService, useValue: api }],
    }).compileComponents();
    fixture = TestBed.createComponent(GalleryComponent);
    await fixture.whenStable();
  }

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  beforeEach(() => {
    api = { getAllPixelArt: vi.fn().mockReturnValue(of(arts)) };
  });

  it('lists the saved art', async () => {
    await create();

    const items = fixture.nativeElement.querySelectorAll('mat-list-item');
    expect(items.length).toBe(2);
    expect(text()).toContain('First');
    expect(text()).toContain('Second');
  });

  it('opens the clicked art on the canvas', async () => {
    await create();

    fixture.nativeElement.querySelectorAll('mat-list-item')[1].click();

    expect(TestBed.inject(ArtService).artToLoad()).toEqual(arts[1]);
  });

  it('reloads when the gallery changes', async () => {
    await create();
    expect(api.getAllPixelArt).toHaveBeenCalledTimes(1);

    TestBed.inject(ArtService).notifyGalleryChanged();
    await fixture.whenStable();

    expect(api.getAllPixelArt).toHaveBeenCalledTimes(2);
  });

  it('shows an empty state for an empty or missing response', async () => {
    api.getAllPixelArt.mockReturnValue(of(null));
    await create();

    expect(fixture.componentInstance.pixelArts()).toEqual([]);
    expect(text()).toContain('No saved art yet.');
  });

  it('shows an error when the gallery cannot be loaded', async () => {
    api.getAllPixelArt.mockReturnValue(throwError(() => new Error('offline')));
    await create();

    expect(text()).toContain('Could not load the gallery.');
    expect(text()).not.toContain('No saved art yet.');
  });
});
