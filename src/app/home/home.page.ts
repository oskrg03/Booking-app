import { Component } from "@angular/core";
import { BookingToShow } from "../services/BookingToShow";
import { ApiBookingsService } from "../services/api-bookings.service";
import { Router } from "@angular/router";
import { Booking } from "../services/bookingResponse";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
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

    if (token.toString() == "null") {
      this.router.navigate(["login"]);
    } else {
      this.getBookings();
    }
  }
  salir(){
    localStorage.setItem("token", null)
    this.router.navigate(['login']);
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
}
