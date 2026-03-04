import { toDateInputValue, formatHuDateTime } from "../utils.js";

export class AdminView{
  constructor({root, onLogin, onDelete}){
    this.root = root;
    this.onLogin = onLogin;
    this.onDelete = onDelete;
  }

  renderLogin(){
    this.root.innerHTML = `
      <div class="login-box">
        <h2 style="margin:0 0 6px">Admin belépés</h2>
        <p class="small-muted">Felhasználó és jelszó: <b>admin / admin</b></p>

        <div class="form-row">
          <div class="field">
            <label>Felhasználónév</label>
            <input id="usernameInput" placeholder="admin" />
          </div>
          <div class="field">
            <label>Jelszó</label>
            <input id="passwordInput" type="password" placeholder="admin" />
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-primary" id="loginBtn">Belépés</button>
        </div>

        <div id="msg" class="notice" style="display:none"></div>
      </div>
    `;

    const loginBtn = this.root.querySelector("#loginBtn");
    loginBtn.addEventListener("click", () => this.handleLogin());
  }

  handleLogin(){
    const username = this.root.querySelector("#usernameInput").value.trim();
    const password = this.root.querySelector("#passwordInput").value.trim();
    this.onLogin(username, password);
  }

  showLoginError(text){
    const msg = this.root.querySelector("#msg");
    msg.style.display = "block";
    msg.textContent = text;
  }

  renderDashboard({hairdressers, appointments, selectedHairdresserId, selectedDate}){
    const today = toDateInputValue(new Date());

    const options = [];
    options.push(`<option value="">Összes fodrász</option>`);

    for(const hairdresser of hairdressers){
      const isSelected = String(hairdresser.id) === String(selectedHairdresserId);
      const selectedAttr = isSelected ? "selected" : "";
      options.push(`<option value="${hairdresser.id}" ${selectedAttr}>${hairdresser.name}</option>`);
    }

    const hdOptionsHtml = options.join("");

    this.root.innerHTML = `
      <div class="filters">
        <div class="field" style="min-width:220px">
          <label>Fodrász</label>
          <select id="hdSelect">${hdOptionsHtml}</select>
        </div>
        <div class="field" style="min-width:220px">
          <label>Dátum</label>
          <input id="dateFilter" type="date" value="${selectedDate ?? ""}" min="${today}" />
        </div>
        <div style="align-self:end">
          <span class="badge">${appointments.length} találat</span>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Időpont</th>
            <th>Fodrász</th>
            <th>Vendég</th>
            <th>Telefon</th>
            <th>Szolgáltatás</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="rows"></tbody>
      </table>
    `;

    this.root.querySelector("#hdSelect").addEventListener("change", () => this.emitFilters());
    this.root.querySelector("#dateFilter").addEventListener("change", () => this.emitFilters());

    const rows = this.root.querySelector("#rows");

    if(appointments.length === 0){
      rows.innerHTML = `<tr><td colspan="6" class="small-muted">Nincs foglalás a szűrők alapján.</td></tr>`;
      return;
    }

    for(const appointment of appointments){
      const dateTime = new Date(appointment.appointment_date.replace(" ", "T"));
      const hairdresser = hairdressers.find(h => Number(h.id) === Number(appointment.hairdresser_id));

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatHuDateTime(dateTime)}</td>
        <td>${hairdresser ? hairdresser.name : "-"}</td>
        <td><b>${appointment.customer_name}</b></td>
        <td>${appointment.customer_phone}</td>
        <td>${appointment.service}</td>
        <td><button class="btn btn-danger" data-id="${appointment.id}">Törlés</button></td>
      `;
      const deleteBtn = tr.querySelector("button");
      if(deleteBtn && this.onDelete){
        deleteBtn.addEventListener("click", () => this.onDelete(appointment.id));
      }

      rows.appendChild(tr);
    }
  }

  emitFilters(){
    const selectedHairdresserId = this.root.querySelector("#hdSelect").value;
    const selectedDate = this.root.querySelector("#dateFilter").value;

    const url = new URL(window.location.href);

    if(selectedHairdresserId){
      url.searchParams.set("hairdresser", selectedHairdresserId);
    }else{
      url.searchParams.delete("hairdresser");
    }

    if(selectedDate){
      url.searchParams.set("date", selectedDate);
    }else{
      url.searchParams.delete("date");
    }

    window.location.href = url.toString();
  }
}
