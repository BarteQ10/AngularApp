import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from "./components/menu/menu.component";
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MessageService],
    imports: [RouterOutlet, ToastModule, HttpClientModule, MenuComponent]
})
export class AppComponent {
  title = 'My Box';
}
