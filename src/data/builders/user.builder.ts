import { UserModel } from '../models/user.model';
import { DataGenerator } from '../dynamic/data-generator';

/**
 * Fluent Test Data Builder for UserModel.
 * Follows the Builder Pattern to create deterministic or customizable test entities.
 */
export class UserBuilder {
  private user: UserModel;

  private constructor() {
    this.user = {
      id: DataGenerator.uuid(),
      firstName: DataGenerator.firstName(),
      lastName: DataGenerator.lastName(),
      email: DataGenerator.email(),
      username: DataGenerator.username(),
      password: DataGenerator.password(),
      role: 'standard',
      jobTitle: DataGenerator.jobTitle(),
      phone: DataGenerator.phone(),
      address: DataGenerator.address(),
    };
  }

  public static aUser(): UserBuilder {
    return new UserBuilder();
  }

  public withId(id: string): this {
    this.user.id = id;
    return this;
  }

  public withFirstName(firstName: string): this {
    this.user.firstName = firstName;
    return this;
  }

  public withLastName(lastName: string): this {
    this.user.lastName = lastName;
    return this;
  }

  public withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  public withUsername(username: string): this {
    this.user.username = username;
    return this;
  }

  public withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  public withRole(role: 'admin' | 'standard' | 'guest'): this {
    this.user.role = role;
    return this;
  }

  public withJobTitle(jobTitle: string): this {
    this.user.jobTitle = jobTitle;
    return this;
  }

  public build(): UserModel {
    return { ...this.user };
  }
}
