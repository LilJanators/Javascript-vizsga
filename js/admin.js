import { ApiClient } from "./services/ApiClient.js";
import { HairdresserService } from "./services/HairdresserService.js";
import { AppointmentService } from "./services/AppointmentService.js";
import { AdminView } from "./ui/AdminView.js";

class AdminController{
  constructor(){
    this.apiClient = new ApiClient();
    this.hairdresserService = new HairdresserService(this.apiClient);
    this.appointmentService = new AppointmentService(this.apiClient);

    this.root = document.getElementById("adminApp");

    this.view = new AdminView({
      root: this.root,
      onLogin: (username, password) => this.login(username, password),
      onDelete: (appointmentId) => this.deleteAppointment(appointmentId)
    });

    this.isLoggedIn = sessionStorage.getItem("admin_logged_in") === "1";

    const url = new URL(window.location.href);
    this.filterHairdresserId = url.searchParams.get("hairdresser") || "";
    this.filterDate = url.searchParams.get("date") || "";
  }

  async init(){
    if(!this.isLoggedIn){
      this.view.renderLogin();
      return;
    }

    await this.renderDashboard();
  }

  login(username, password){
    const ok = username === "admin" && password === "admin";

    if(ok){
      sessionStorage.setItem("admin_logged_in", "1");
      window.location.reload();
      return;
    }

    this.view.showLoginError("Hibás adatok. Tipp: admin / admin");
  }

  async renderDashboard(){
    const hairdressers = await this.hairdresserService.list();
    const allAppointments = await this.appointmentService.list();

    const filteredAppointments = this.applyFilters(allAppointments);
    this.sortAppointments(filteredAppointments);

    this.view.renderDashboard({
      hairdressers,
      appointments: filteredAppointments,
      selectedHairdresserId: this.filterHairdresserId,
      selectedDate: this.filterDate
    });
  }


  async deleteAppointment(appointmentId){
    const ok = confirm("Biztosan törlöd ezt a foglalást?");
    if(!ok){
      return;
    }

    try{
      await this.appointmentService.delete(appointmentId);
      await this.renderDashboard();
    }catch(err){
      alert(err?.message ? err.message : "A törlés nem sikerült.");
    }
  }

  applyFilters(appointments){
    const result = [];

    for(const appointment of appointments){
      if(this.filterHairdresserId){
        if(String(appointment.hairdresser_id) !== String(this.filterHairdresserId)){
          continue;
        }
      }

      if(this.filterDate){
        if(!appointment.appointment_date.startsWith(this.filterDate)){
          continue;
        }
      }

      result.push(appointment);
    }

    return result;
  }

  sortAppointments(appointments){
    appointments.sort((a, b) => a.appointment_date.localeCompare(b.appointment_date));
  }
}

const admin = new AdminController();
admin.init();
