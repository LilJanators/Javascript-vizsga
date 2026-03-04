export class HairdresserService{
  constructor(apiClient){
    this.api = apiClient;
  }

  async list(){
    return this.api.getHairdressers();
  }

  async get(id){
    return this.api.getHairdresserById(id);
  }
}
