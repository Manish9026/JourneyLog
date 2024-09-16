import React, { useEffect } from 'react'
import './style.scss'
import {useDispatch} from 'react-redux'
import { setTicket } from '../../slices/buyticketSlice';
const SeatContainer = () => {
const dispatch=useDispatch();
    function appendSeats(seats, rowType,rowId) {
        const row = document.querySelector(`.${rowType}`);
        for (let i = 1; i <= seats; i++) {
          const seat = document.createElement("div");

          seat.classList.add("seat");
          seat.innerHTML=rowId+"-"+i
          row.appendChild(seat);

        //   seat.appendChild("li")
        }
      }
      
      function selectSeats() {
        const seat = document.querySelectorAll(".seat");
        seat.forEach((item) => {
          item.addEventListener("click", () => {
            item.classList.toggle("selected");
            console.log(item.innerHTML);
            dispatch(setTicket({type:[["tickets",{tkNo:Math.floor(Math.random()*100000),seatNo:item.innerHTML}]]}))
            
          });
        });
      }
      
      function markRandomSeats(SEAT_RESERVED) {
        const totalSeats = document.querySelectorAll(".seat");
        const reservedSeats = getRandomSeats(totalSeats, SEAT_RESERVED);
        reservedSeats.forEach((seat) => {
          seat.classList.add("reserved");
        });
      }
      
      function getRandomSeats(seats, count) {
        const shuffledSeats = Array.from(seats).sort(() => 0.5 - Math.random());
        return shuffledSeats.slice(0, count);
      }
useEffect(()=>{
    const SEAT_RESERVED = 10;
    appendSeats(5, "first-front-row","R1");
    appendSeats(14, "second-front-row","R2");
    appendSeats(96, "middle-row","R3");
    appendSeats(14, "second-last-row","R4");
    appendSeats(12, "first-last-row","R5");
    selectSeats()
    // markRandomSeats(selectSeats);
},[])
  return (
    <div class="container">
       
    <div class="front-screen">
        <div class="screen"></div>
        <div class="overlay"></div>
    </div>
    <div class="seats">
        <div class="front-row first-front-row" >
        </div>
        <div class="front-row second-front-row"></div>
        <div class="middle-row"></div>
        <div class="front-row second-last-row"></div>
        <div class="front-row first-last-row"></div>
    </div>
    <div class="legend">
        <div>
            <div class="seat available"></div>
            <span>Available</span>
        </div>
        <div>
            <div class="seat selected"></div>
            <span>Selected</span>
        </div>
        <div>
            <div class="seat reserved"></div>
            <span>Reserved</span>
        </div>
    </div>
</div>
  )
}

export default SeatContainer