import { TestBed } from '@angular/core/testing';
import { ArtService } from './art';

describe('ArtService', () => {
  let service: ArtService;

  beforeEach(() => {
    service = TestBed.inject(ArtService);
  });

  it('starts with nothing to load', () => {
    expect(service.artToLoad()).toBeNull();
  });

  it('exposes the art selected for loading', () => {
    const art = { id: '1', name: 'Art', pixels: [['#000000']] };
    service.loadArt(art);
    expect(service.artToLoad()).toBe(art);
  });

  it('bumps the gallery version on every change notification', () => {
    const initial = service.galleryVersion();
    service.notifyGalleryChanged();
    service.notifyGalleryChanged();
    expect(service.galleryVersion()).toBe(initial + 2);
  });
});
