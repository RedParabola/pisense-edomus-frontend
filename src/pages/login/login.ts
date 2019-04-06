// Basic
import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Services
import { UserStore } from '../../providers/stores/user.store';
import { AuthService } from '../../providers/services/auth.service';
import { ToastService } from '../../providers/services/toast.service';

/**
 * Login page.
 */
@IonicPage({ name: 'page-login', segment: 'login' })
@Component({ selector: 'page-login', templateUrl: 'login.html' })
export class LoginPage implements OnInit {
 
  /**
   * Form for login/register credentials.
   */
  credentialsForm: FormGroup;
 
  /**
   * Login page constructor.
   * @param loadingController Controller to generate a loading dialog.
   * @param formBuilder Builder for forms.
   * @param userStore Store to handle user info.
   * @param authService Service to provide authentication
   * @param toastService Controller to generate & present light notifications.
   */
  constructor(private loadingController: LoadingController, private formBuilder: FormBuilder, private userStore: UserStore, private authService: AuthService, private toastService: ToastService) {
  }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.login(this.credentialsForm.value);
  }

  register() {
    const loading = this.loadingController.create({
      content: 'Registering...'
    });
    loading.present();
    this.userStore.registerUser(this.credentialsForm.value).then(
      () => {
        loading.dismiss();
        this.toastService.showToast({ message: 'Register successful!' })
        this.login(this.credentialsForm.value);
      }, () => {
        loading.dismiss();
        this.toastService.showToast({ message: 'Register process failed. Try again later.' });
      }
    );
  }

  login(credentials: any) {
    const loading = this.loadingController.create({
      content: 'Logging...'
    });
    loading.present();
    this.userStore.loginUser(credentials).then(
      () => loading.dismiss(),
      () => {
        loading.dismiss();
        this.toastService.showToast({ message: 'Could not login. Try again later.' });
    });
  }

}