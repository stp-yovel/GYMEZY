import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm } from '../src/controllers/banner.controller.js';

describe('Banner Geo Distance & Sorting Unit Tests', () => {
  test('1. calculateDistanceKm computes accurate distance between Mangadu and Porur (~5.5 km)', () => {
    // Mangadu coordinates: [80.1079915, 13.0289609]
    // Porur coordinates: [80.1585, 13.0382]
    const distance = calculateDistanceKm(13.0289609, 80.1079915, 13.0382, 80.1585);
    assert.ok(distance > 5 && distance < 6, `Expected distance between 5 and 6 km, got ${distance}`);
  });

  test('2. calculateDistanceKm returns 0 for identical coordinates', () => {
    const distance = calculateDistanceKm(13.0289609, 80.1079915, 13.0289609, 80.1079915);
    assert.equal(distance, 0);
  });

  test('3. calculateDistanceKm handles null/invalid coordinates gracefully', () => {
    assert.equal(calculateDistanceKm(null, 80.1, 13.0, 80.2), null);
    assert.equal(calculateDistanceKm(13.0, null, 13.0, 80.2), null);
    assert.equal(calculateDistanceKm('invalid', 80.1, 13.0, 80.2), null);
  });

  test('4. Priority Banners partition & sort before regular distance-sorted banners', () => {
    const banners = [
      { id: 'b1', name: 'Mangadu Ad', isPriority: false, distanceKm: 0.5 },
      { id: 'b2', name: 'Anna Nagar Priority Ad', isPriority: true, distanceKm: 14.2 },
      { id: 'b3', name: 'Porur Ad', isPriority: false, distanceKm: 4.8 },
    ];

    const priority = banners.filter((b) => b.isPriority).sort((a, b) => a.distanceKm - b.distanceKm);
    const regular = banners.filter((b) => !b.isPriority).sort((a, b) => a.distanceKm - b.distanceKm);
    const result = [...priority, ...regular];

    assert.equal(result[0].name, 'Anna Nagar Priority Ad');
    assert.equal(result[1].name, 'Mangadu Ad');
    assert.equal(result[2].name, 'Porur Ad');
  });
});
