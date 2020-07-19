import { Component, OnInit } from '@angular/core';
import { BookingToShow } from '../services/BookingToShow';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  booking: BookingToShow;
  constructor() { }

  ngOnInit() {
    this.booking = JSON.parse(localStorage.getItem("booking"));
    this.booking.fecha_creacion =new Date(this.booking.fecha_creacion);
    console.log(this.booking.bookingID)
  }

}
