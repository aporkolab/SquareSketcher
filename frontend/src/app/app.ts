import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { CanvasComponent } from './components/canvas/canvas';
import { ColorPaletteComponent } from './components/color-palette/color-palette';
import { GalleryComponent } from './components/gallery/gallery';

@Component({
  selector: 'app-root',
  imports: [CanvasComponent, ColorPaletteComponent, GalleryComponent, MatToolbarModule, RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
})
export class App {}
