import { pad2 } from "../utils.js";

export class AppointmentService{
  constructor(apiClient){
    this.api = apiClient;

    this.openingHours = {
      start: "14:00",
      end: "19:00"
    };

    this.slotMinutes = 30;
  }

  async list(){
    return this.api.getAppointments();
  }

  async create(payload){
    return this.api.createAppointment(payload);
  }

  async delete(id){
    return this.api.deleteAppointment(id);
  }

  async getFreeSlots(hairdresserId, dateStr){
    const appointments = await this.list();

    const busyTimes = [];
    for(const appointment of appointments){
      const sameHairdresser = Number(appointment.hairdresser_id) === Number(hairdresserId);
      const sameDay = appointment.appointment_date.startsWith(dateStr);

      if(sameHairdresser && sameDay){
        const timePart = appointment.appointment_date.slice(11, 16);
        busyTimes.push(timePart);
      }
    }

    const allSlots = this.generateSlots();

    const freeSlots = [];
    for(const slot of allSlots){
      if(!busyTimes.includes(slot)){
        freeSlots.push(slot);
      }
    }

    return freeSlots;
  }

  generateSlots(){
    const startParts = this.openingHours.start.split(":");
    const endParts = this.openingHours.end.split(":");

    const startHour = Number(startParts[0]);
    const startMinute = Number(startParts[1]);

    const endHour = Number(endParts[0]);
    const endMinute = Number(endParts[1]);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const slots = [];
    for(let total = startTotalMinutes; total < endTotalMinutes; total += this.slotMinutes){
      const hour = Math.floor(total / 60);
      const minute = total % 60;
      slots.push(`${pad2(hour)}:${pad2(minute)}`);
    }

    return slots;
  }
}
