import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

/**
 * Enterprise Dynamic Data Generator wrapper around Faker & UUID.
 * Ensures isolation and collision avoidance across parallel test workers.
 */
export class DataGenerator {
  public static uuid(): string {
    return uuidv4();
  }

  public static firstName(): string {
    return faker.person.firstName();
  }

  public static lastName(): string {
    return faker.person.lastName();
  }

  public static fullName(): string {
    return faker.person.fullName();
  }

  public static email(prefix = 'test'): string {
    return `${prefix}.${Date.now()}.${faker.string.alphanumeric(6)}@example.com`.toLowerCase();
  }

  public static username(base = 'user'): string {
    return `${base}_${faker.string.alphanumeric(8)}`.toLowerCase();
  }

  public static password(minLength = 12): string {
    return `Aa1!${faker.internet.password({ length: minLength })}`;
  }

  public static phone(): string {
    return faker.phone.number();
  }

  public static jobTitle(): string {
    return faker.person.jobTitle();
  }

  public static company(): string {
    return faker.company.name();
  }

  public static address() {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    };
  }

  public static postalCode(): string {
    return faker.location.zipCode();
  }
}
