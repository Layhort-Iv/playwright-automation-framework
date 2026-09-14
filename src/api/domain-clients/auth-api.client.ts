import { BaseApiClient } from '../client/base-api.client';
import { ApiResponse } from '../../common/types';
import { LoginResponse, LoginErrorResponse } from '../schemas/auth.schema';
import { RequestBuilder } from '../request-builders/request.builder';

/**
 * Domain-specific API client for Authentication endpoints.
 */
export class AuthApiClient {
  private readonly loginEndpoint = '/login';

  constructor(private readonly client: BaseApiClient) {}

  public async loginSuccess(credentials: {
    email: string;
    password?: string;
  }): Promise<ApiResponse<LoginResponse>> {
    const requestOptions = RequestBuilder.create().withBody(credentials).build();
    return this.client.post<LoginResponse>(this.loginEndpoint, requestOptions);
  }

  public async loginFailure(credentials: {
    email: string;
    password?: string;
  }): Promise<ApiResponse<LoginErrorResponse>> {
    const requestOptions = RequestBuilder.create().withBody(credentials).build();
    return this.client.post<LoginErrorResponse>(this.loginEndpoint, requestOptions);
  }
}
