import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  onActivate(event: any) {
//    window.scrollTo(0, 0); // how far to scroll on each step
  }



/*  onActivate(event) {
    window.scroll(0, 0);
  }*/
}

