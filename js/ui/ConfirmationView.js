import { formatHuDateTime } from "../utils.js";

export class ConfirmationView{
  constructor({root, onRestart}){
    this.root = root;
    this.onRestart = onRestart;
  }

  render({hairdresserName, appointment}){
    const dt = new Date(appointment.appointment_date.replace(" ", "T"));
    this.root.innerHTML = `
      <h1 class="page-title">Sikeres foglalás ✅</h1>
      <p class="small-muted">
        Köszi <b>${appointment.customer_name}</b>! A foglalásodat elmentettük.
      </p>

      <div class="notice">
        <div><b>Fodrász:</b> ${hairdresserName}</div>
        <div><b>Időpont:</b> ${formatHuDateTime(dt)}</div>
        <div><b>Szolgáltatás:</b> ${appointment.service}</div>
        <div><b>Telefon:</b> ${appointment.customer_phone}</div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" id="restartBtn">Vissza a fodrászokhoz</button>
      </div>
    `;

    this.root.querySelector("#restartBtn").addEventListener("click", () => this.onRestart());
  }
}
