import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService, PixelArt } from '../../services/api';
import { ArtService } from '../../services/art';
import { ColorService } from '../../services/color';
import { NotificationService } from '../../services/notification';

export const BLANK_PIXEL = '#FFFFFF';

@Component({
  selector: 'app-canvas',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './canvas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './canvas.scss',
})
export class CanvasComponent implements OnInit {
  private readonly colorService = inject(ColorService);
  private readonly apiService = inject(ApiService);
  private readonly artService = inject(ArtService);
  private readonly notifications = inject(NotificationService);

  /** Size of a newly created blank canvas. */
  readonly width = input(16);
  readonly height = input(16);

  readonly pixels = signal<string[][]>([]);
  readonly artName = signal('');
  readonly saving = signal(false);

  /** Id of the art being edited, so saving updates it instead of duplicating it. */
  private readonly artId = signal<string | undefined>(undefined);
  private canvasRevision = 0;

  readonly columns = computed(() => this.pixels()[0]?.length ?? this.width());
  readonly rows = computed(() => this.pixels().length || this.height());

  constructor() {
    effect(() => {
      const art = this.artService.artToLoad();
      if (art) {
        untracked(() => this.open(art));
      }
    });
  }

  ngOnInit(): void {
    if (this.pixels().length === 0) {
      this.newArt();
    }
  }

  changePixelColor(row: number, col: number): void {
    const color = this.colorService.selectedColor();
    this.pixels.update((pixels) =>
      pixels.map((cells, r) => (r === row ? cells.map((cell, c) => (c === col ? color : cell)) : cells)),
    );
  }

  saveArt(): void {
    const name = this.artName().trim();
    if (!name) {
      this.notifications.showError('Please enter a name for your art.');
      return;
    }
    if (this.saving()) {
      return;
    }

    const pixelArt: PixelArt = { name, pixels: this.pixels() };
    const id = this.artId();
    const revision = this.canvasRevision;
    if (id) {
      pixelArt.id = id;
    }

    this.saving.set(true);
    this.apiService.savePixelArt(pixelArt).subscribe({
      next: (saved) => {
        this.saving.set(false);
        // A delayed response must not attach the previous id to another canvas.
        if (revision === this.canvasRevision) {
          this.artId.set(saved?.id ?? id);
        }
        this.notifications.showSuccess('Art saved!');
        this.artService.notifyGalleryChanged();
      },
      error: () => {
        this.saving.set(false);
        this.notifications.showError('Could not save your art. Please try again.');
      },
    });
  }

  newArt(): void {
    this.canvasRevision += 1;
    this.pixels.set(
      Array.from({ length: this.height() }, () =>
        Array.from({ length: this.width() }, () => BLANK_PIXEL),
      ),
    );
    this.artName.set('');
    this.artId.set(undefined);
  }

  private open(art: PixelArt): void {
    if (!art.pixels?.length || !art.pixels[0]?.length) {
      this.notifications.showError(`"${art.name}" has no pixels and cannot be opened.`);
      return;
    }
    this.canvasRevision += 1;
    // Copy, so drawing does not mutate the object held by the gallery.
    this.pixels.set(art.pixels.map((row) => [...row]));
    this.artName.set(art.name);
    this.artId.set(art.id);
  }
}
