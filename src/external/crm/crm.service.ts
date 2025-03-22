import { Injectable, Logger } from '@nestjs/common';

/**
 * Mock service to simulate integration with CRM system
 */
@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  /**
   * Get customers with birthdays in the next 7 days
   */
  async getCustomersWithBirthdaysInNextWeek(): Promise<any[]> {
    /**
     * TODO Call an API or query a database to fetch customers
     * Returns mock data for demonstration purposes
     */
    this.logger.log('Fetching customers with birthdays in the next week');

    return [
      {
        id: 'customer-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        birthDate: this.getBirthdateInNextWeek(),
        preferences: ['electronics', 'books'],
        purchaseHistory: ['product-123', 'product-456'],
      },
      {
        id: 'customer-002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        birthDate: this.getBirthdateInNextWeek(),
        preferences: ['fashion', 'beauty'],
        purchaseHistory: ['product-789', 'product-101'],
      },
    ];
  }

  /**
   * Helper method to generate a birthdate in the next week
   */
  private getBirthdateInNextWeek(): Date {
    const date = new Date();
    const daysToAdd = Math.floor(Math.random() * 7) + 1;
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }
}
