import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../../service/crud.service';
import { NotificationService } from '../../shared/notification';
import { AppTitleService } from '../../shared/services';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  currentuser: any;
  constructor(
    private formBuilder: FormBuilder,
    public crud: CrudService,
    public toastr: NotificationService,
    public router: Router,
    public title: AppTitleService
  ) {
    this.title.setTitle('Connection');
  }

  ngOnInit(): void {
    this.currentuser = this.crud.getcurrentuser();
    if (this.currentuser.nom) {
      this.router.navigate(['admin/produit']);
    }
    this.initForm();
  }
  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  login() {
    // localStorage.clear();
    this.loading = true;
    this.crud.post('/login',this.loginForm.value).subscribe({
      next:(data:any) => {
        // localStorage.clear();
        this.loading = false;
        this.crud.setlocalstorage(data);
        this.toastr.onInfo('Bienvenu(e) '+data.user.prenom+' '+data.user.nom);
        this.initForm();
        this.router.navigate(['/admin/produit']);
      },
      error:(error:any) => {
        // localStorage.clear();
        this.toastr.onError('Connection non valide');
        this.loading = false;
      }
    });
  }
  toggleShow() {
    if (this.loginForm.value.password) {
      var currentype = $('#password').attr('type');
      if (currentype == 'password') {
        $('#password').attr('type', 'text');
      }
      if (currentype == 'text') {
        $('#password').attr('type', 'password');
      }
    }
  }
}
