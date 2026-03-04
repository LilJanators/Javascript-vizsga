import { ApiClient } from "./services/ApiClient.js";
import { HairdresserService } from "./services/HairdresserService.js";
import { AppointmentService } from "./services/AppointmentService.js";
import { Stepper } from "./ui/Stepper.js";
import { HairdresserListView } from "./ui/HairdresserListView.js";
import { BookingView } from "./ui/BookingView.js";
import { ConfirmationView } from "./ui/ConfirmationView.js";
import { toDateInputValue } from "./utils.js";

class AppController{
  constructor(){
    this.apiClient = new ApiClient();
    this.hairdresserService = new HairdresserService(this.apiClient);
    this.appointmentService = new AppointmentService(this.apiClient);

    this.root = document.getElementById("app");
    this.stepper = new Stepper(document.getElementById("stepper"));

    this.state = {
      step: 1,
      selectedHairdresserId: null,
      selectedDate: toDateInputValue(new Date())
    };

    this.listView = new HairdresserListView({
      root: this.root,
      onSelect: (hairdresserId) => this.goToBooking(hairdresserId)
    });

    this.bookingView = new BookingView({
      root: this.root,
      onBack: () => this.goToList(),
      onConfirm: (event) => this.handleBookingEvent(event)
    });

    this.confirmationView = new ConfirmationView({
      root: this.root,
      onRestart: () => this.goToList()
    });
  }

  async init(){
    this.setStep(1);
    await this.goToList();
  }

  setStep(stepNumber){
    this.state.step = stepNumber;
    this.stepper.render(stepNumber);
  }

  async goToList(){
    this.state.selectedHairdresserId = null;
    this.setStep(1);

    const hairdressers = await this.hairdresserService.list();
    this.listView.render(hairdressers);
  }

  async goToBooking(hairdresserId){
    this.state.selectedHairdresserId = hairdresserId;
    this.setStep(2);

    const hairdresser = await this.hairdresserService.get(hairdresserId);
    const freeSlots = await this.appointmentService.getFreeSlots(hairdresserId, this.state.selectedDate);

    this.bookingView.render({
      hairdresser,
      freeSlots,
      dateValue: this.state.selectedDate
    });
  }

  async handleBookingEvent(event){
    switch(event.type){
      case "changeDate":
        await this.handleDateChange(event.date);
        break;
      case "submit":
        await this.handleSubmit(event.payload);
        break;
      default:
        break;
    }
  }

  async handleDateChange(dateStr){
    this.state.selectedDate = dateStr;
    await this.goToBooking(this.state.selectedHairdresserId);
  }

  async handleSubmit(payload){
    try{
      const created = await this.appointmentService.create(payload);
      const hairdresser = await this.hairdresserService.get(payload.hairdresser_id);

      this.setStep(3);
      this.confirmationView.render({
        hairdresserName: hairdresser.name,
        appointment: created
      });
    }catch(err){
      this.bookingView.setMessage(err.message || "Hiba történt mentés közben.");
    }
  }
}

const app = new AppController();
app.init();
