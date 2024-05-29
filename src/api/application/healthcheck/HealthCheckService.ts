type HealthCheckResponse = {
  success: boolean;
  time: string;
};

export class HealthCheckService {
  public async invoke(): Promise<HealthCheckResponse> {
    return {
      success: true,
      time: new Date().toISOString(),
    };
  }
}
