import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavLink {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav" role="navigation" aria-label="Mobile navigation">
      @for (link of navLinks; track link.route) {
        <a
          class="bottom-nav-item"
          [routerLink]="link.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: link.route === '/' }"
          [attr.aria-label]="link.label"
          (click)="onNavClick(link.route)"
        >
          <span class="bottom-nav-icon" aria-hidden="true">{{ link.icon }}</span>
          <span class="bottom-nav-label">{{ link.label }}</span>
          <span class="bottom-nav-indicator"></span>
        </a>
      }
    </nav>
  `,
  styles: [`
    :host {
      display: none;
    }

    @media (max-width: 1023px) {
      :host {
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }
    }

    .bottom-nav {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 64px;
      background-color: #ffffff;
      border-top: 1px solid #e5e7eb;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
      padding: 0 8px;
      padding-bottom: env(safe-area-inset-bottom, 0);
    }

    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      flex: 1;
      height: 100%;
      text-decoration: none;
      color: #6b7280;
      position: relative;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: color 0.2s ease;
      outline: none;
      border: none;
      background: none;
      padding: 8px 4px;
    }

    .bottom-nav-item:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: -2px;
      border-radius: 8px;
    }

    .bottom-nav-item:hover {
      color: #4f46e5;
    }

    .bottom-nav-item.active {
      color: #6366f1;
    }

    .bottom-nav-icon {
      font-size: 22px;
      line-height: 1;
    }

    .bottom-nav-label {
      font-size: 11px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
    }

    .bottom-nav-indicator {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: transparent;
      transition: background-color 0.2s ease;
      margin-top: 2px;
    }

    .bottom-nav-item.active .bottom-nav-indicator {
      background-color: #6366f1;
    }
  `]
})
export class BottomNavComponent {
  @Input() activeRoute = '';
  @Output() navClick = new EventEmitter<string>();

  navLinks: NavLink[] = [
    { label: 'Dashboard', icon: '📊', route: '/' },
    { label: 'Projects', icon: '📁', route: '/projects' },
    { label: 'Tasks', icon: '✅', route: '/tasks' },
    { label: 'Analytics', icon: '📈', route: '/analytics' }
  ];

  onNavClick(route: string): void {
    this.navClick.emit(route);
  }
}