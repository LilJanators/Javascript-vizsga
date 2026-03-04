import { initials, toDateInputValue } from "../utils.js";

export class BookingView{
  constructor({root, onBack, onConfirm}){
    this.root = root;
    this.onBack = onBack;
    this.onConfirm = onConfirm;

    this.selectedTime = null;
  }

  render({hairdresser, freeSlots, dateValue}){
  
    const today = new Date();
    const minDate = toDateInputValue(today);

    this.root.innerHTML = `
      <div class="booking-head">
        <div class="hd-avatar" style="background: linear-gradient(145deg, ${hairdresser.color}33, rgba(242,163,59,.22));">
          ${hairdresser.image ? `<img src="${hairdresser.image}" alt="${hairdresser.name}">` : initials(hairdresser.name)}
        </div>
        <div class="meta">
          <div class="title">${hairdresser.name}</div>
          <div class="sub">${hairdresser.role} • ${this.openingText()}</div>
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label>Dátum</label>
          <input type="date" id="dateInput" min="${minDate}" value="${dateValue}" />
        </div>
        <div class="field">
          <label>Szolgáltatás</label>
          <select id="serviceSelect">
            <option>Hajvágás</option>
            <option>Festés</option>
            <option>Frufru igazítás (15 perc)</option>
            <option>Férfi hajvágás</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label>Név</label>
          <input id="nameInput" placeholder="pl. Kovács Anna" />
        </div>
        <div class="field">
          <label>Telefon</label>
          <input id="phoneInput" placeholder="pl. 06301234567" />
        </div>
      </div>

      <div class="section-title">Időpontok</div>
      <div class="times" id="times"></div>

      <div class="actions">
        <button class="btn btn-outline" id="backBtn">Vissza</button>
        <button class="btn btn-primary" id="bookBtn">Lefoglalom</button>
      </div>

      <div id="msg" class="notice" style="display:none"></div>
    `;

    const times = this.root.querySelector("#times");
    this.renderTimes(times, freeSlots);

    this.root.querySelector("#backBtn").addEventListener("click", () => this.onBack());
    this.root.querySelector("#bookBtn").addEventListener("click", () => this.submit(hairdresser.id));
    this.root.querySelector("#dateInput").addEventListener("change", (e) => {
  
      this.onConfirm({type:"changeDate", date: e.target.value});
    });
  }

  setMessage(text){
    const msg = this.root.querySelector("#msg");
    msg.style.display = "block";
    msg.textContent = text;
  }

  clearMessage(){
    const msg = this.root.querySelector("#msg");
    msg.style.display = "none";
    msg.textContent = "";
  }

  openingText(){
    return "Nyitás: 14:00–19:00 (félórás időpontok)";
  }

  renderTimes(root, freeSlots){
    this.selectedTime = null;
    root.innerHTML = "";

    if(!freeSlots.length){
      root.innerHTML = `<span class="badge">Erre a napra nincs szabad időpont 😢</span>`;
      return;
    }

    freeSlots.forEach(t => {
      const btn = document.createElement("button");
      btn.className = "time-btn";
      btn.textContent = t;

      btn.addEventListener("click", () => {
        this.selectedTime = t;
        root.querySelectorAll(".time-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });

      root.appendChild(btn);
    });
  }

  submit(hairdresserId){
    this.clearMessage();

    const date = this.root.querySelector("#dateInput").value;
    const service = this.root.querySelector("#serviceSelect").value;
    const name = this.root.querySelector("#nameInput").value.trim();
    const phone = this.root.querySelector("#phoneInput").value.trim();

    if(!this.selectedTime){
      this.setMessage("Válassz egy időpontot is (csak egyet lehet).");
      return;
    }

    const payload = {
      hairdresser_id: hairdresserId,
      customer_name: name,
      customer_phone: phone,
      appointment_date: `${date} ${this.selectedTime}:00`,
      service
    };

    this.onConfirm({type:"submit", payload});
  }
}
