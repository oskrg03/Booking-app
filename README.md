# Booking-app
## Descripción

Aplicación desarrollada usando Ionic/angular para dar solución al problema4 propuesto.


### Paso 1: Crear proyecto
```
ionic start Booking-app 
```

### Paso 2: Crear componentes (Home, Login)
```
ionic g page login  
ionic g page home  
```

### Paso 3: Crear servicio (api-bookings.service)
```
ng g s services/api-bookings 
```

Desarrollamos el servicio
```
 url_user = 'https://dev.tuten.cl/TutenREST/rest/user/testapis@tuten.cl';


  constructor(private Http: HttpClient) {}


  //Método que hace la petición http a la api para validar al usuario ingresado
  async validarUser(email, password, app) {
 
    var settings: any = {
      url: 'https://dev.tuten.cl/TutenREST/rest/user/'+email,
      method: 'PUT',
      timeout: 0,
      headers: {
        password: password,
        app: app,
        Accept: 'application/json',
      },
      processData: false,
      mimeType: 'multipart/form-data',
      contentType: false,
    };

    let data;
    await $.ajax(settings).done(function (response) {
     
       data = JSON.parse(response);
      //  console.log(data)
    });
    
    
    return data;
    // return data;
  }
  //Método para obtener todos los bookings con el contacto y el token obtenido del inicio de sesión
  async getBookings(){
    const adminemail = "testapis@tuten.cl";
    const email = "contacto@tuten.cl";
    const token = localStorage.getItem("token");
    const current =  true;
    const app = "APP_BCK";


    var settings: any = {
      url: 'https://dev.tuten.cl/TutenREST/rest/user/'+email+'/bookings?current='+current,
      method: 'GET',
      timeout: 0,
      headers: {
        adminemail: adminemail,
        token: token,
        app: app,
        Accept: 'application/json',
      },
      processData: false,
      mimeType: 'multipart/form-data',
      contentType: false,
    };

    let data:Array<Booking> =[];;
    await $.ajax(settings).done(function (response) {
     
       data = JSON.parse(response);
      //  console.log(data)
    });
    
    
    return data;
  }

```

### Paso 4: Instalar JQuery 
```
npm install jquery
npm i @types/jquery --save
```

### Paso 5: login.page.ts y Login.page.html
Login.page.ts
```
   constructor(public api: ApiBookingsService, private router: Router) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');

    if (token != null) {
      this.router.navigate(['home']);
    }
  }


  validarUser(email, password, app) {
   

    this.api.validarUser(email, password, app).then((data: any) => {
      console.log(data.sessionTokenBck != null);
      if (data.sessionTokenBck != null) {
        localStorage.setItem('token', data.sessionTokenBck);
        this.router.navigate(['home']);
      }
    });
  }
  todo = {
    email:"",
    password:"",
    app:""
  }
  logForm() {
    let email = this.todo["email"];
    let password = this.todo['password'];
    let app = this.todo['app'];
    console.log(email)
    if(email!="" && password!="" && app!=""){
      this.validarUser(email, password, app);
    }else{

    }
  
  }
```

Login.page.html
```
<ion-header>
  <ion-toolbar>
    <ion-title>Iniciar sesión</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form (ngSubmit)="logForm()" style="margin: 1em;">
    <ion-item>
      <ion-label position="floating">Email</ion-label>
      <ion-input type="email" [(ngModel)]="todo.email" name="email" required ></ion-input>
    </ion-item>
    
    <ion-item>
      <ion-label position="floating">Password</ion-label>
      <ion-input type="password" [(ngModel)]="todo.password" name="password" required></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="floating">App</ion-label>
      <ion-input type="text" [(ngModel)]="todo.app" name="app" required></ion-input>
    </ion-item>
    <ion-button type="submit" color="dark" style="float: right; margin: 1em;">Iniciar sesión</ion-button>
  </form>
</ion-content>


```

### Paso 6: home.page.ts y home.page.html

home.page.ts
```
data: Array<Booking> = [];
  BookingList: Array<BookingToShow> = [];
  BookingListFiltered: Array<BookingToShow> = [];
  searchValue = 0;
  choosed = ">=";
  precio = 0;
  constructor(private api: ApiBookingsService, private router: Router) {}

  ngOnInit(): void {
    //Si el usuario inició sesión, se obtienen los bookings, de lo contrario se redirige al inicio de sesión
    let token = localStorage.getItem("token");

    if (token == null) {
      this.router.navigate(["login"]);
    } else {
      this.getBookings();
    }
  }

  details(index) {
    localStorage.setItem(
      "booking",
      JSON.stringify(this.BookingListFiltered[index])
    );
    this.router.navigate(["details"]);
  }
  segment = "all";
  choosedSegment(opcion) {
    this.segment = opcion;
  }

  getBookings() {
    this.api.getBookings().then((data) => {
      this.data = data;
      /*Se recorren los bookings obtenidos y se crean nuevos objetos
       simplificados de la información que solicitan para visualizar*/
      this.data.forEach((element) => {
        console.log(element.bookingId);
        let booking: BookingToShow = {
          bookingID: 0,
          cliente: "",
          direccion: "",
          fecha_creacion: new Date(),
          precio: 0,
        };

        booking.bookingID = element.bookingId;
        booking.cliente =
          element.tutenUserClient.firstName +
          " " +
          element.tutenUserClient.lastName;
        booking.direccion = element.locationId.streetAddress;
        booking.fecha_creacion = new Date(element.bookingTime);
        booking.precio = element.bookingPrice;

        this.BookingList.push(booking);
      });
      this.BookingListFiltered = this.BookingList;
    });
  }

  buscar() {
    let valor = "" + this.searchValue;
    if (valor != null) {
      this.filtrar();
    } else {
      this.searchValue = 0;
      this.filtrar();
    }
  }

  //Cada que se escoga una opción de filtrado, se procederá a filtrar la información
  choosedMethod(opcion) {
    this.choosed = opcion;
   console.log(this.choosed)
    this.filtrar();
  }

  filtrar() {
    this.BookingListFiltered = this.BookingList;

    if (this.searchValue > 0 || this.precio > 0) {
      //Se filtra por el bookingid
      if (this.searchValue > 0) {
        console.log(this.searchValue);
        this.BookingListFiltered = this.BookingList.filter((item) => {
          if (item.bookingID == this.searchValue) {
            return item;
          }
        });
        console.log(this.BookingListFiltered);
      }
      //Se filtra por precio
      console.log(this.choosed)
      console.log(this.precio)
      if(this.choosed.toString()=="y"){

        this.BookingListFiltered =  this.BookingListFiltered.filter((item)=>{
          if (
            item.precio == this.precio
          ) {
            return item;
          }
          })
      }else{
        if(this.choosed.toString()==">="){

          this.BookingListFiltered =  this.BookingListFiltered.filter((item)=>{
            if (
              item.precio >= this.precio
            ) {
              return item;
            }
            })
        }else{
          this.BookingListFiltered =  this.BookingListFiltered.filter((item)=>{
            if (
              item.precio <= this.precio
            ) {
              return item;
            }
            })
        }
      }
    } else {
      //En caso de que no se ingrese bookingId y/o precio, los datos son los iniciales.
      this.BookingListFiltered = this.BookingList;
    }
  }

  
```


home.page.html
```
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>
      Inicio
    </ion-title>
  </ion-toolbar>
  <ion-toolbar>
    <ion-segment value="all">
      <ion-segment-button value="all" (click)="choosedSegment('all')">
        <ion-label>Servicios</ion-label>
      </ion-segment-button>
      <ion-segment-button value="filtro" (click)="choosedSegment('filtros')">
        <ion-label>Filtros</ion-label>
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">



  <div *ngIf="segment=='filtros'">
    <ion-item>
      <ion-label style="text-align: center;">BookingID</ion-label>
    </ion-item>
 
    <ion-searchbar class="center" [(ngModel)]="searchValue" showCancelButton="focus" (ngModelChange)="buscar()">
    </ion-searchbar>

    <ion-segment style="margin-top: 1em;" value=">=">
      <ion-segment-button value="y" (click)="choosedMethod('y')">
        <ion-label>Y</ion-label>
      </ion-segment-button>
      <ion-segment-button value=">=" (click)="choosedMethod('>=')">
        <ion-label>>=</ion-label>
      </ion-segment-button>
      <ion-segment-button value="<=>" (click)="choosedMethod('<=')">
        <ion-label>
          <=</ion-label> </ion-segment-button>
        
        </ion-segment>

        <ion-label></ion-label>
          
          
          <ion-item>
            <ion-label style="text-align: center; margin-top: 1em;">Precio</ion-label>
            </ion-item>
          
            <ion-searchbar [(ngModel)]="precio" showCancelButton="focus" (ngModelChange)="filtrar()"></ion-searchbar>

  </div>

  <div *ngIf="segment=='all'">

    <ion-list>

      <ion-item *ngFor="let booking of BookingListFiltered; let i = index">
        <div class="col" (click)="details(i)">
          <div class="row">
            <h2> {{booking.bookingID}}</h2>

          </div>
          <div class="row">
            <p style="font-size: small;"> {{booking.fecha_creacion.toDateString()}}</p>
          </div>
        </div>

      </ion-item>
    </ion-list>
  </div>

</ion-content>
```

### Paso 7: estilos al gusto. 


## Running

`ionic serve` 

## Tecnologías
```
    "ionic": "~5.0.7",
    "angular": "~9.1.3",
    "jquery": "^3.5.1",
    "rxjs": "~6.5.4"
```
