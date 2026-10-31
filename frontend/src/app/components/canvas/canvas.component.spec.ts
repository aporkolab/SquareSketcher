import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasComponent } from './canvas';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorService } from '../../services/color';
import { ApiService } from '../../services/api';
import { ArtService } from '../../services/art';
import { NotificationService } from '../../services/notification';
import { of } from 'rxjs';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;
  let colorService: jasmine.SpyObj<ColorService>;
  let apiService: jasmine.SpyObj<ApiService>;
  let artService: jasmine.SpyObj<ArtService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const colorServiceSpy = jasmine.createSpyObj('ColorService', ['selectedColor']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['savePixelArt']);
    const artServiceSpy = jasmine.createSpyObj('ArtService', ['artToLoad']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);

    await TestBed.configureTestingModule({
      imports: [CanvasComponent, NoopAnimationsModule],
      providers: [
        { provide: ColorService, useValue: colorServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ArtService, useValue: artServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    colorService = TestBed.inject.ColorService as jasmine.SpyObj<ColorService>;
    apiService = TestBed.inject.ApiService as jasmine.SpyObj<ApiService>;
    artService = TestBed.inject.ArtService as jasmine.SpyObj<ArtService>;
    notificationService = TestBed.inject.NotificationService as jasmine.SpyObj<NotificationService>;

    // Mock signals
    (Object.getOwnPropertyDescriptor(colorService, 'selectedColor')?.get as jasmine.Spy<() => any>).and.returnValue(() => '#000000');
    (Object.getOwnPropertyDescriptor(artService, 'artToLoad')?.get as jasmine.Spy<() => any>).and.returnValue(() => null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save art', () => {
    component.artName = 'test art';
    component.pixels = [['#FFFFFF']];
    apiService.savePixelArt.and.returnValue(of({ name: 'test art', pixels: [['#FFFFFF']]}));
    component.saveArt();
    expect(apiService.savePixelArt).toHaveBeenCalled();
    expect(notificationService.showSuccess).toHaveBeenCalledWith('Art saved!');
  });

  it('should not save art without a name', () => {
    component.artName = '';
    component.saveArt();
    expect(apiService.savePixelArt).not.toHaveBeenCalled();
    expect(notificationService.showError).toHaveBeenCalledWith('Please enter a name for your art.');
  });
});
