import { Component, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../shared/password-match-directive';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [AuthService]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
    ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: passwordMatchValidator
    });
  }

  submitDetails() {
    const { email, password } = this.registerForm.value;
    const newUser  = { email, password };
    this.authService.registerUser(newUser as User).subscribe(
      response => { 
        console.log(response);
        const toast = document.getElementById("registerSuccessToast");
        if (toast) this.renderer.addClass(toast, "show");
        this.router.navigate(["/login"]);
      },
      error => console.log(error)
    )
  }
}
