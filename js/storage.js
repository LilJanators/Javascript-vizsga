export class Storage {
  constructor(namespace){
    this.namespace = namespace;
  }

  read(){
    const raw = localStorage.getItem(this.namespace);
    if(!raw) return null;
    try{
      return JSON.parse(raw);
    }catch(e){
      console.warn("Storage JSON parse hiba:", e);
      return null;
    }
  }

  write(value){
    localStorage.setItem(this.namespace, JSON.stringify(value));
  }

  getAll(){
    return this.read() ?? [];
  }

  setAll(items){
    this.write(items);
  }

  add(item){
    const items = this.getAll();
    items.push(item);
    this.setAll(items);
    return item;
  }

  removeById(id){
    const items = this.getAll().filter(x => x.id !== id);
    this.setAll(items);
  }

  clear(){
    localStorage.removeItem(this.namespace);
  }
}
