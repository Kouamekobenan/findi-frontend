export class Restaurant {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public address: string,
    public country: string,
    public latitude: number | null,
    public longitude: number | null,
    public phone: string,
    public website: string,
    public openingHours: Record<string, string>,
    public image: string,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public userId: string
  ) {}
}
