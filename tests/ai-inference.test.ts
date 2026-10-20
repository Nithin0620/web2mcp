import { describe, it, expect } from 'vitest';
import { classifyToolSafety } from '../services/ai/safety-classifier';
import { inferToolsFromExploration } from '../services/ai/schema-inference';
import type { PageExplorationResult } from '../types/platform';

describe('AI Schema Inference & Safety Classification', () => {
  it('classifyToolSafety correctly tags read_only vs consequential tools', () => {
    const searchSafety = classifyToolSafety('search_flights', 'Search available flights by route and date');
    expect(searchSafety.riskLevel).toBe('read_only');
    expect(searchSafety.requiresApproval).toBe(false);

    const bookingSafety = classifyToolSafety('book_flight', 'Confirm seat reservation and submit payment details');
    expect(bookingSafety.riskLevel).toBe('consequential');
    expect(bookingSafety.requiresApproval).toBe(true);

    const bidSafety = classifyToolSafety('submit_tender_bid', 'Submit competitive bid on contract');
    expect(bidSafety.riskLevel).toBe('consequential');
    expect(bidSafety.requiresApproval).toBe(true);
  });

  it('inferToolsFromExploration synthesizes typed MCP tools with JSON Schema', async () => {
    const mockExploration: PageExplorationResult = {
      url: 'https://skyway.com/flights',
      title: 'SkyWay Airline Booking',
      cleanMarkdown: '# SkyWay Airlines\nSearch flights worldwide. Best prices guaranteed.',
      forms: [
        {
          id: 'flight-search-form',
          action: '/api/flights',
          method: 'GET',
          purposeGuess: 'search',
          submitButtonText: 'Search Flights',
          fields: [
            { name: 'origin', type: 'text', label: 'From', required: true },
            { name: 'destination', type: 'text', label: 'To', required: true },
            { name: 'departureDate', type: 'date', label: 'Date', required: true },
            { name: 'cabinClass', type: 'select', label: 'Class', required: false, options: ['economy', 'business'] },
          ],
        },
        {
          id: 'booking-form',
          action: '/api/book',
          method: 'POST',
          purposeGuess: 'booking',
          submitButtonText: 'Confirm Booking',
          fields: [
            { name: 'flightId', type: 'text', label: 'Flight Number', required: true },
            { name: 'passengerName', type: 'text', label: 'Passenger Name', required: true },
            { name: 'passportNumber', type: 'text', label: 'Passport', required: true },
          ],
        },
      ],
      listContainers: [
        {
          containerSelector: '.results-list',
          itemSelector: '.flight-item',
          sampleItemsCount: 5,
          extractedFields: ['Flight #101', '$350', 'Non-stop', '09:00 AM'],
        },
      ],
      navigationLinks: [],
      inferredSiteType: 'travel_flight_booking',
    };

    const tools = await inferToolsFromExploration(mockExploration, 'proj-123', 'Search flights and book tickets');
    expect(tools.length).toBeGreaterThanOrEqual(2);

    const searchTool = tools.find(t => t.category === 'search');
    expect(searchTool).toBeDefined();
    expect(searchTool?.name).toContain('search');
    expect(searchTool?.parameters.properties.origin).toBeDefined();
    expect(searchTool?.parameters.properties.origin.type).toBe('string');
    expect(searchTool?.parameters.properties.cabinClass?.enum).toEqual(['economy', 'business']);
    expect(searchTool?.requiresApproval).toBe(false);

    const bookingTool = tools.find(t => t.name.includes('book') || t.category === 'action');
    expect(bookingTool).toBeDefined();
    expect(bookingTool?.requiresApproval).toBe(true);
    expect(bookingTool?.riskLevel).toBe('consequential');
  });
});
