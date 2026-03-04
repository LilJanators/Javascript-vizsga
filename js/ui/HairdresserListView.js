import { initials } from "../utils.js";

export class HairdresserListView{
  constructor({root, onSelect}){
    this.root = root;
    this.onSelect = onSelect;
  }

  render(hairdressers){
    this.root.innerHTML = `
      <h1 class="page-title">Fodrászat</h1>
      <p class="small-muted">Válassz fodrászt, majd foglalj időpontot.</p>
      <div class="grid" id="hdGrid"></div>
    `;

    const grid = this.root.querySelector("#hdGrid");

    hairdressers.forEach(h => {
      const card = document.createElement("div");
      card.className = "hd-card";
      card.innerHTML = `
        <div class="hd-avatar" style="background: linear-gradient(145deg, ${h.color}33, rgba(47,184,180,.22));">
          ${h.image ? `<img src="${h.image}" alt="${h.name}">` : initials(h.name)}
        </div>
        <div class="hd-name">${h.name}</div>
        <div class="hd-role">${h.role}</div>
        <div class="hd-bio">${h.bio}</div>
        <div class="hd-actions">
          <button class="btn btn-primary">Időpontfoglalás</button>
        </div>
      `;
      card.querySelector("button").addEventListener("click", () => {
        this.onSelect(h.id);
      });
      grid.appendChild(card);
    });
  }
}
