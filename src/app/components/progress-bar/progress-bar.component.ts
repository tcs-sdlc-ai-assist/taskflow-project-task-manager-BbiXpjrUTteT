import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-bar-container">
      <div class="progress-bar-header" *ngIf="label || showPercentage">
        <span class="progress-bar-label" *ngIf="label">{{ label }}</span>
        <span class="progress-bar-percentage" *ngIf="showPercentage">{{ clampedValue }}%</span>
      </div>
      <div class="progress-bar-track" [attr.aria-label]="label || 'Progress'" role="progressbar"
           [attr.aria-valuenow]="clampedValue" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar-fill"
             [style.width.%]="clampedValue"
             [style.background-color]="color">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-bar-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .progress-bar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    .progress-bar-label {
      color: #374151;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 70%;
    }

    .progress-bar-percentage {
      color: #6b7280;
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
    }

    .progress-bar-track {
      width: 100%;
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 280ms ease-in-out;
      min-width: 0;
    }
  `]
})
export class ProgressBarComponent {
  @Input() value: number = 0;
  @Input() color: string = '#3b82f6';
  @Input() label: string = '';
  @Input() showPercentage: boolean = true;

  get clampedValue(): number {
    return Math.round(Math.min(100, Math.max(0, this.value || 0)));
  }
}