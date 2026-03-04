export class Stepper{
  constructor(root){
    this.root = root;
    this.steps = [
      {id: 1, label: "Fodrász"},
      {id: 2, label: "Időpont"},
      {id: 3, label: "Visszaigazolás"},
    ];
  }

  render(activeStep){
    this.root.innerHTML = "";
    for(const s of this.steps){
      const el = document.createElement("div");
      el.className = "step" + (s.id === activeStep ? " active" : "");
      el.innerHTML = `
        <div class="bubble">${s.id}</div>
        <div>${s.label}</div>
      `;
      this.root.appendChild(el);
    }
  }
}
