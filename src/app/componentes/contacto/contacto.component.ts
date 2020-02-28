import { Component, OnInit } from '@angular/core';
import { EmailService, Email } from '../../servicios/email.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
email : string;
nombre : string;
Email : Email= new Email;
politica: boolean;
enviado:boolean = false;
  constructor( private emailService : EmailService) { }

  ngOnInit() {
    window.scrollTo(0, 0); 

  }
  enviarmail(mensajeForm: NgForm) {
    this.emailService.sendEmailAdmin(this.Email.nombre, this.Email.email, this.Email.telefono, this.Email.empresa).subscribe(
      json => {
      });
    mensajeForm.reset({//reseto lo valores del formulario para la validación
          value: undefined
        });
    this.Email = new Email();
    this.enviado=true;
  }


}
