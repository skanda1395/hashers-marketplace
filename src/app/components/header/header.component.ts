import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [AuthService],
})

export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
  }
  
  ngOnInit(): void {
    console.log("SUB TO AUTH STATUS");
    this.authService.isLoggedIn$.subscribe(status => {
      console.log("SUB", status);
      this.isLoggedIn = status;
      // this.cdRef.detectChanges();
    })
  }

  logout() {
    sessionStorage.clear();
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
