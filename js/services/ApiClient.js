import { Storage } from "../storage.js";

export class ApiClient{
  constructor(){
    this.useMock = true;
    this.appointmentsStore = new Storage("appointments_v1");
  }

  async getHairdressers(){
    if(this.useMock){
      const res = await fetch("assets/hairdressers.json");
      return res.json();
    }
    throw new Error("JSON hiba.");
  }

  async getHairdresserById(id){
    const list = await this.getHairdressers();
    return list.find(h => Number(h.id) === Number(id));
  }

  async getAppointments(){
    if(this.useMock){
      return this.appointmentsStore.getAll();
    }
    throw new Error("JSON hiba.");
  }

  async createAppointment(payload){
    if(this.useMock){
      if(!payload.customer_name || payload.customer_name.length < 2){
        throw new Error("A név túl rövid.");
      }
      if(!payload.customer_phone || payload.customer_phone.length < 7){
        throw new Error("A telefonszám túl rövid.");
      }
      if(!payload.appointment_date){
        throw new Error("Nincs időpont kiválasztva.");
      }

      const appointments = await this.getAppointments();
      const exists = appointments.some(a =>
        Number(a.hairdresser_id) === Number(payload.hairdresser_id) &&
        a.appointment_date === payload.appointment_date
      );
      if(exists){
        throw new Error("Ez az időpont már foglalt.");
      }

      const item = {
        id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
        created_at: new Date().toISOString(),
        ...payload
      };
      this.appointmentsStore.add(item);
      return item;
    }
    throw new Error("JSON hiba.");
  }

  async deleteAppointment(id){
    if(this.useMock){
      this.appointmentsStore.removeById(id);
      return true;
    }
    throw new Error("JSON hiba.");
  }
}
