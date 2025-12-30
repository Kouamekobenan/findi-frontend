export class Dish {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly category: string,
    public readonly image: string,
    public readonly searchTerms: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
