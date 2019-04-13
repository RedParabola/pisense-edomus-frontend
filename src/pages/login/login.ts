// Basic
import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Services
import { ApplicationDataStore } from '../../providers/stores/application-data.store';
import { UserStore } from '../../providers/stores/user.store';
import { ApplicationService } from '../../providers/services/application.service';
import { LoadingService } from '../../providers/services/loading.service';
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
  public credentialsForm: FormGroup;

  /**
   * Form for network URLs.
   */
  public urlForm: FormGroup;

  /**
   * localUrl input
   */
  public localUrl: string;

  /**
   * remoteUrl input
   */
  public remoteUrl: string;

  /**
   * Login page constructor.
   * @param formBuilder Builder for forms.
   * @param appDataStore Used to access to stored application info such as unique device id.
   * @param userStore Store to handle user info.
   * @param applicationService Service to get the application main functionality.
   * @param loadingService Service used to generate a loading dialog
   * @param toastService Service used to show toasts.
   */
  constructor(private formBuilder: FormBuilder, private appDataStore: ApplicationDataStore, private userStore: UserStore, private applicationService: ApplicationService, private loadingService: LoadingService, private toastService: ToastService) {
  }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.localUrl = this.appDataStore.getLocalEndpoint();
    this.remoteUrl = this.appDataStore.getRemoteEndpoint();
  }

  onSubmit() {
    this.login(this.credentialsForm.value);
  }

  public register(): void {
    this.loadingService.show({
      content: 'Registering...'
    });
    this.userStore.registerUser(this.credentialsForm.value).then(
      () => {
        this.loadingService.dismiss();
        this.toastService.showToast({ message: 'Register successful!' })
        this.login(this.credentialsForm.value);
      }, () => {
        this.loadingService.dismiss();
        this.toastService.showToast({ message: 'Register process failed. Try again later.' });
      }
    );
  }

  public login(credentials: any): void {
    this.loadingService.show({
      content: 'Logging...'
    });
    this.userStore.loginUser(credentials).then(
      () => this.loadingService.dismiss(),
      () => {
        this.loadingService.dismiss();
        this.toastService.showToast({ message: 'Could not login. Try again later.' });
    });
  }

  public linkServer(): void {
    this.loadingService.show({
      content: 'Linking server...'
    });
    this.appDataStore.storeApiEndpoints(this.localUrl, this.remoteUrl).then(
      () => {
        this.loadingService.setContent("Link successful! App will autoclose in 10 seconds in order to use the new server settings... Please restart the App :)");
        setTimeout(() => {
          this.applicationService.closeApp();
        }, 10000);
      }, () => {
        this.loadingService.dismiss();
        this.toastService.showToast({ message: 'Could not link the server.' });
    });
  }
}