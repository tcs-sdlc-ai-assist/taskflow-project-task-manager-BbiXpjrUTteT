import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="summary-card" [style.border-top-color]="color || '#4f46e5'">
      <div class="summary-card__header">
        <span class="summary-card__icon">{{ icon }}</span>
        <span class="summary-card__title">{{ title }}</span>
      </div>
      <div class="summary-card__value" [style.color]="color || '#1e293b'">
        {{ value }}
      </div>
      <div class="summary-card__subtitle" *ngIf="subtitle">
        {{ subtitle }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .summary-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
      border-top: 4px solid #4f46e5;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: default;
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    }

    .summary-card__header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .summary-card__icon {
      font-size: 24px;
      line-height: 1;
    }

    .summary-card__title {
      font-size: 14px;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .summary-card__value {
      font-size: 36px;
      font-weight: 700;
      line-height: 1.2;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .summary-card__subtitle {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 400;
    }

    @media (max-width: 768px) {
      .summary-card {
        padding: 16px;
      }

      .summary-card__value {
        font-size: 28px;
      }

      .summary-card__icon {
        font-size: 20px;
      }

      .summary-card__title {
        font-size: 12px;
      }
    }
  `]
})
export class SummaryCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() icon: string = '📊';
  @Input() subtitle: string = '';
  @Input() color: string = '';
}