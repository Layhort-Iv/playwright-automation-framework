import { OrderModel } from '../models/user.model';
import { DataGenerator } from '../dynamic/data-generator';

/**
 * Fluent Test Data Builder for OrderModel.
 */
export class OrderBuilder {
  private order: OrderModel;

  private constructor() {
    this.order = {
      orderId: DataGenerator.uuid(),
      firstName: DataGenerator.firstName(),
      lastName: DataGenerator.lastName(),
      postalCode: DataGenerator.postalCode(),
      items: [
        {
          id: 'sauce-labs-backpack',
          name: 'Sauce Labs Backpack',
          price: 29.99,
          quantity: 1,
        },
      ],
    };
  }

  public static anOrder(): OrderBuilder {
    return new OrderBuilder();
  }

  public withFirstName(firstName: string): this {
    this.order.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): this {
    this.order.lastName = lastName;
    return this;
  }

  public withPostalCode(postalCode: string): this {
    this.order.postalCode = postalCode;
    return this;
  }

  public withItem(item: { id: string; name: string; price: number; quantity: number }): this {
    this.order.items.push(item);
    return this;
  }

  public build(): OrderModel {
    return { ...this.order };
  }
}
