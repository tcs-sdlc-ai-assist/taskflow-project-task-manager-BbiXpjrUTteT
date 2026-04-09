import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" aria-label="Main navigation">
      <div class="sidebar-header">
        <span class="sidebar-logo">📋</span>
        <span class="sidebar-title">TaskFlow</span>
      </div>
      <nav class="sidebar-nav" role="navigation" aria-label="Desktop navigation">
        <ul class="nav-list">
          @for (link of navLinks; track link.route) {
            <li class="nav-item">
              <a
                class="nav-link"
                [routerLink]="link.route"
                routerLinkActive="nav-link--active"
                [routerLinkActiveOptions]="{ exact: link.route === '/' }"
                [attr.aria-label]="'Navigate to ' + link.label"
              >
                <span class="nav-link-icon" aria-hidden="true">{{ link.icon }}</span>
                <span class="nav-link-label">{{ link.label }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    :host {
      display: none;
    }

    @media (min-width: 1024px) {
      :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 256px;
        height: 100vh;
        z-index: 100;
      }
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      width: 256px;
      height: 100%;
      background-color: #1e1e2e;
      color: #cdd6f4;
      border-right: 1px solid #313244;
      overflow-y: auto;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid #313244;
    }

    .sidebar-logo {
      font-size: 28px;
      line-height: 1;
    }

    .sidebar-title {
      font-size: 20px;
      font-weight: 700;
      color: #cdd6f4;
      letter-spacing: -0.02em;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      margin: 0;
      padding: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      text-decoration: none;
      color: #a6adc8;
      font-size: 15px;
      font-weight: 500;
      transition: background-color 0.15s ease, color 0.15s ease;
      cursor: pointer;
      outline: none;
    }

    .nav-link:hover {
      background-color: #313244;
      color: #cdd6f4;
    }

    .nav-link:focus-visible {
      outline: 2px solid #89b4fa;
      outline-offset: -2px;
    }

    .nav-link--active {
      background-color: #313244;
      color: #89b4fa;
      font-weight: 600;
    }

    .nav-link--active:hover {
      background-color: #45475a;
      color: #89b4fa;
    }

    .nav-link-icon {
      font-size: 20px;
      line-height: 1;
      flex-shrink: 0;
    }

    .nav-link-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class SidebarComponent {
  readonly navLinks: NavLink[] = [
    { label: 'Dashboard', icon: '📊', route: '/' },
    { label: 'Projects', icon: '📁', route: '/projects' },
    { label: 'Tasks', icon: '✅', route: '/tasks' },
    { label: 'Analytics', icon: '📈', route: '/analytics' }
  ];
}