import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { ApiService, PixelArt } from '../../services/api';
import { ArtService } from '../../services/art';
import { ColorService } from '../../services/color';
import { NotificationService } from '../../services/notification';
import { BLANK_PIXEL, CanvasComponent } from './canvas';

describe('CanvasComponent', () => {
  let fixture: ComponentFixture<CanvasComponent>;
  let component: CanvasComponent;
  let api: { savePixelArt: ReturnType<typeof vi.fn> };
  let notifications: { showSuccess: ReturnType<typeof vi.fn>; showError: ReturnType<typeof vi.fn> };
  let artService: ArtService;
  let colorService: ColorService;

  beforeEach(async () => {
    api = { savePixelArt: vi.fn() };
    notifications = { showSuccess: vi.fn(), showError: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CanvasComponent],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: NotificationService, useValue: notifications },
      ],
    }).compileComponents();

    artService = TestBed.inject(ArtService);
    colorService = TestBed.inject(ColorService);
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function pixelElements(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.canvas-pixel'));
  }

  it('starts with a blank 16x16 canvas', () => {
    expect(component.pixels().length).toBe(16);
    expect(component.pixels().every((row) => row.length === 16)).toBe(true);
    expect(component.pixels().flat().every((pixel) => pixel === BLANK_PIXEL)).toBe(true);
    expect(pixelElements().length).toBe(256);
  });

  it('paints a clicked pixel with the selected color', async () => {
    colorService.setSelectedColor('#FF0000');

    pixelElements()[16 + 2].click(); // row 1, column 2
    await fixture.whenStable();

    expect(component.pixels()[1][2]).toBe('#FF0000');
    expect(component.pixels().flat().filter((pixel) => pixel === '#FF0000').length).toBe(1);
    expect(pixelElements()[18].style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('refuses to save without a name', () => {
    component.artName.set('   ');
    component.saveArt();

    expect(api.savePixelArt).not.toHaveBeenCalled();
    expect(notifications.showError).toHaveBeenCalledWith('Please enter a name for your art.');
  });

  it('saves the art, notifies the user and refreshes the gallery', () => {
    api.savePixelArt.mockReturnValue(of({ id: 'new-id', name: 'Test Art', pixels: [] }));
    const versionBefore = artService.galleryVersion();
    component.artName.set(' Test Art ');

    component.saveArt();

    expect(api.savePixelArt).toHaveBeenCalledWith({ name: 'Test Art', pixels: component.pixels() });
    expect(notifications.showSuccess).toHaveBeenCalledWith('Art saved!');
    expect(artService.galleryVersion()).toBe(versionBefore + 1);
    expect(component.saving()).toBe(false);
  });

  it('updates the same art on a second save instead of creating a copy', () => {
    api.savePixelArt.mockReturnValue(of({ id: 'new-id', name: 'Art', pixels: [] }));
    component.artName.set('Art');

    component.saveArt();
    component.saveArt();

    expect(api.savePixelArt.mock.calls[1][0].id).toBe('new-id');
  });

  it('ignores repeated clicks while a save is in flight', () => {
    api.savePixelArt.mockReturnValue(new Subject<PixelArt>());
    component.artName.set('Art');

    component.saveArt();
    component.saveArt();

    expect(api.savePixelArt).toHaveBeenCalledTimes(1);
  });

  it('does not attach an old save response to a new canvas', () => {
    const pending = new Subject<PixelArt>();
    api.savePixelArt.mockReturnValue(pending);
    component.artName.set('First');
    component.saveArt();

    component.newArt();
    component.artName.set('Second');
    pending.next({ id: 'first-id', name: 'First', pixels: [['#000000']] });
    pending.complete();

    api.savePixelArt.mockReturnValue(of({ id: 'second-id', name: 'Second', pixels: [] }));
    component.saveArt();
    expect(api.savePixelArt.mock.calls[1][0].id).toBeUndefined();
    expect(api.savePixelArt.mock.calls[1][0].name).toBe('Second');
  });

  it('preserves the selected gallery id when an earlier save completes', async () => {
    const pending = new Subject<PixelArt>();
    api.savePixelArt.mockReturnValue(pending);
    component.artName.set('First');
    component.saveArt();

    const selected = { id: 'selected-id', name: 'Selected', pixels: [['#FFFFFF']] };
    artService.loadArt(selected);
    await fixture.whenStable();
    pending.next({ id: 'first-id', name: 'First', pixels: [['#000000']] });
    pending.complete();

    api.savePixelArt.mockReturnValue(of(selected));
    component.saveArt();
    expect(api.savePixelArt.mock.calls[1][0].id).toBe('selected-id');
  });

  it('reports a failed save', () => {
    api.savePixelArt.mockReturnValue(throwError(() => new Error('offline')));
    component.artName.set('Art');

    component.saveArt();

    expect(notifications.showError).toHaveBeenCalledWith('Could not save your art. Please try again.');
    expect(notifications.showSuccess).not.toHaveBeenCalled();
    expect(component.saving()).toBe(false);
  });

  it('opens art picked in the gallery without mutating it', async () => {
    const art: PixelArt = { id: '42', name: 'Loaded', pixels: [['#000000', '#FFFFFF']] };
    artService.loadArt(art);
    await fixture.whenStable();

    expect(component.artName()).toBe('Loaded');
    expect(component.columns()).toBe(2);
    expect(component.rows()).toBe(1);

    colorService.setSelectedColor('#00FF00');
    component.changePixelColor(0, 1);
    expect(component.pixels()[0][1]).toBe('#00FF00');
    expect(art.pixels[0][1]).toBe('#FFFFFF');

    api.savePixelArt.mockReturnValue(of(art));
    component.saveArt();
    expect(api.savePixelArt.mock.calls[0][0]).toEqual({
      id: '42',
      name: 'Loaded',
      pixels: [['#000000', '#00FF00']],
    });
  });

  it('rejects art without pixels', async () => {
    artService.loadArt({ id: '1', name: 'Empty', pixels: [] });
    await fixture.whenStable();

    expect(notifications.showError).toHaveBeenCalledWith('"Empty" has no pixels and cannot be opened.');
    expect(component.pixels().length).toBe(16);
  });

  it('starts a new art, forgetting the loaded one', async () => {
    artService.loadArt({ id: '42', name: 'Loaded', pixels: [['#000000']] });
    await fixture.whenStable();

    component.newArt();
    api.savePixelArt.mockReturnValue(of({ name: 'Fresh', pixels: [] }));
    component.artName.set('Fresh');
    component.saveArt();

    expect(component.pixels().length).toBe(16);
    expect(api.savePixelArt.mock.calls[0][0].id).toBeUndefined();
  });
});
