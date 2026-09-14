import { UserBuilder } from '../builders/user.builder';
import { UserModel } from '../models/user.model';
import { config } from '../../core/config';

/**
 * Factory pattern for immediate creation of standard domain entities.
 */
export class UserFactory {
  public static createStandardUser(): UserModel {
    return UserBuilder.aUser().withRole('standard').build();
  }

  public static createAdminUser(): UserModel {
    return UserBuilder.aUser().withRole('admin').build();
  }

  public static createPreSeededStandardUser(): UserModel {
    return UserBuilder.aUser()
      .withUsername(config.STANDARD_USERNAME)
      .withPassword(config.STANDARD_PASSWORD)
      .withRole('standard')
      .build();
  }

  public static createPreSeededAdminUser(): UserModel {
    return UserBuilder.aUser()
      .withUsername(config.ADMIN_USERNAME)
      .withPassword(config.ADMIN_PASSWORD)
      .withRole('admin')
      .build();
  }
}
