import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification';

describe('NotificationService', () => {
  let snackBar: { open: ReturnType<typeof vi.fn> };
  let service: NotificationService;

  beforeEach(() => {
    snackBar = { open: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: MatSnackBar, useValue: snackBar }] });
    service = TestBed.inject(NotificationService);
  });

  it('shows success messages with the success style', () => {
    service.showSuccess('Saved');
    expect(snackBar.open).toHaveBeenCalledWith('Saved', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  });

  it('shows error messages with the error style', () => {
    service.showError('Failed');
    expect(snackBar.open).toHaveBeenCalledWith('Failed', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  });
});
