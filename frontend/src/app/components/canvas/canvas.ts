import { Component, Input, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';

import { ColorService } from '../../services/color';
import { ApiService, PixelArt } from '../../services/api';
import { ArtService } from '../../services/art';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatSnackBarModule],
  templateUrl: './canvas.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./canvas.scss'],
})
export class CanvasComponent implements OnInit {
  @Input() width = 16;
  @Input() height = 16;

  pixels: string[][] = [];
  artName = '';

  constructor(
    private colorService: ColorService,
    private apiService: ApiService,
    private artService: ArtService,
    private snackBar: MatSnackBar,
  ) {
    effect(() => {
      const artToLoad = this.artService.artToLoad();
      if (artToLoad) {
        this.pixels = artToLoad.pixels;
        this.artName = artToLoad.name;
        this.width = artToLoad.pixels[0].length;
        this.height = artToLoad.pixels.length;
      }
    });
  }

  ngOnInit(): void {
    this.newArt();
  }

  changePixelColor(row: number, col: number): void {
    this.pixels[row][col] = this.colorService.selectedColor();
  }

  saveArt(): void {
    if (!this.artName) {
      this.snackBar.open('Please enter a name for your art.', 'Close', {
        duration: 3000,
      });
      return;
    }
    const pixelArt: PixelArt = {
      name: this.artName,
      pixels: this.pixels,
    };
    this.apiService.savePixelArt(pixelArt).subscribe(() => {
      this.snackBar.open('Art saved!', 'Close', {
        duration: 3000,
      });
    });
  }

  newArt(): void {
    this.pixels = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => '#FFFFFF'),
    );
    this.artName = '';
  }
}
